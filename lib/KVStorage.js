// Storage simplificado con Redis + Vercel KV fallback
import { Redis } from '@upstash/redis';

// Redis principal
const redis = new Redis({
  url: process.env.KV_REST_API_URL || 'https://redis-18507.crce202.eu-west-3-1.ec2.redns.redis-cloud.com',
  token: process.env.KV_REST_API_TOKEN,
  retry: { retries: 2, delay: 1000 }
});

class KVStorage {
  static SCORES_KEY = 'pi-runner:scores';
  static TIMEOUT = 8000;

  // Obtener todos los scores con fallback
  static async getAllScores() {
    // Intentar Redis primero
    try {
      const scores = await Promise.race([
        redis.get(this.SCORES_KEY),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Redis timeout')), this.TIMEOUT)
        )
      ]);
      return scores || [];
    } catch (error) {
      console.error('Redis failed, trying Vercel KV:', error);
      
      // Fallback a Vercel KV
      try {
        const { kv } = await import('@vercel/kv');
        const scores = await kv.get(this.SCORES_KEY);
        return scores || [];
      } catch (kvError) {
        console.error('Vercel KV also failed:', kvError);
        return [];
      }
    }
  }

  // Guardar score con fallback
  static async addScore(scoreData) {
    const allScores = await this.getAllScores();
    
    // Buscar duplicados
    const existingIndex = allScores.findIndex(s => s.paymentId === scoreData.paymentId);
    
    if (existingIndex >= 0) {
      allScores[existingIndex] = scoreData;
    } else {
      allScores.push(scoreData);
    }

    // Intentar guardar en Redis
    try {
      await Promise.race([
        redis.set(this.SCORES_KEY, allScores),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Redis timeout')), this.TIMEOUT)
        )
      ]);
      console.log(`Score saved to Redis. Total: ${allScores.length}`);
      return scoreData;
    } catch (error) {
      console.error('Redis save failed, trying Vercel KV:', error);
      
      // Fallback a Vercel KV
      try {
        const { kv } = await import('@vercel/kv');
        await kv.set(this.SCORES_KEY, allScores);
        console.log(`Score saved to Vercel KV. Total: ${allScores.length}`);
        return scoreData;
      } catch (kvError) {
        console.error('Both Redis and Vercel KV failed:', kvError);
        throw new Error('Storage completely failed');
      }
    }
  }

  // Obtener scores filtrados
  static async getScores(type = 'allTime', limit = 10) {
    const allScores = await this.getAllScores();
    
    // Filtrar por período
    let filtered = this.filterByPeriod(allScores, type);
    
    // Ordenar y limitar
    return filtered
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((score, index) => ({ ...score, rank: index + 1 }));
  }

  // Filtrar por período de tiempo
  static filterByPeriod(scores, type) {
    if (type === 'allTime') return scores;
    
    const now = new Date();
    const cutoff = new Date(now);
    
    switch (type) {
      case 'daily':
        cutoff.setDate(cutoff.getDate() - 1);
        break;
      case 'weekly':
        cutoff.setDate(cutoff.getDate() - 7);
        break;
      case 'monthly':
        cutoff.setMonth(cutoff.getMonth() - 1);
        break;
      default:
        return scores;
    }
    
    return scores.filter(s => new Date(s.timestamp) > cutoff);
  }

  // Limpiar todos los datos
  static async clearAll() {
    try {
      await redis.del(this.SCORES_KEY);
      const { kv } = await import('@vercel/kv');
      await kv.del(this.SCORES_KEY);
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export default KVStorage;
