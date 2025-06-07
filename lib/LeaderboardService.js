// Leaderboard Service simplificado
import KVStorage from './KVStorage.js';

class LeaderboardService {
  static cache = new Map();
  static CACHE_TTL = 30000; // 30 segundos

  static async getScores(type = 'allTime', limit = 10) {
    const cacheKey = `${type}_${limit}`;
    const cached = this.cache.get(cacheKey);
    
    // Retornar cache válido
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const scores = await KVStorage.getScores(type, limit);
      
      // Actualizar cache
      this.cache.set(cacheKey, {
        data: scores,
        timestamp: Date.now()
      });

      return scores;
    } catch (error) {
      console.error('Error getting scores:', error);
      
      // Retornar cache expirado si existe
      if (cached) return cached.data;
      
      return [];
    }
  }

  static async saveScore(scoreData) {
    try {
      this.cache.clear(); // Limpiar cache
      return await KVStorage.addScore(scoreData);
    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  }

  static async healthCheck() {
    try {
      const scores = await KVStorage.getAllScores();
      return {
        status: 'healthy',
        totalScores: scores.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default LeaderboardService;
