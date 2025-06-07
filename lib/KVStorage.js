// Storage con Vercel Blob (sin Redis)
import { put, list, del } from '@vercel/blob';

class KVStorage {
  static SCORES_FILE = 'pi-runner-scores.json';

  static async getAllScores() {
    try {
      const blobs = await list({ prefix: this.SCORES_FILE });
      
      if (blobs.blobs.length === 0) {
        console.log('No scores file found, returning empty array');
        return [];
      }
      
      const response = await fetch(blobs.blobs[0].url);
      const scores = await response.json();
      console.log(`Loaded ${scores.length} scores from blob`);
      return scores || [];
    } catch (error) {
      console.error('Error reading from blob:', error);
      return [];
    }
  }

  static async saveAllScores(scores) {
    try {
      const blob = await put(this.SCORES_FILE, JSON.stringify(scores), {
        access: 'public',
        contentType: 'application/json',
        allowOverwrite: true
      });
      
      console.log(`Scores saved to blob: ${blob.url}`);
      return true;
    } catch (error) {
      console.error('Error saving to blob:', error);
      return false;
    }
  }

  static async addScore(scoreData) {
    const allScores = await this.getAllScores();
    
    // Buscar score existente del mismo usuario
    const existingUserScoreIndex = allScores.findIndex(s => s.userUid === scoreData.userUid);
    
    if (existingUserScoreIndex >= 0) {
      const existingScore = allScores[existingUserScoreIndex];
      
      // Solo actualizar si el nuevo score es mejor
      if (scoreData.score > existingScore.score) {
        console.log(`Updating user score: ${existingScore.score} -> ${scoreData.score}`);
        allScores[existingUserScoreIndex] = scoreData;
      } else {
        console.log(`New score (${scoreData.score}) not better than existing (${existingScore.score}), keeping existing`);
        return existingScore; // Retornar el score existente sin cambios
      }
    } else {
      console.log('Adding new user score');
      allScores.push(scoreData);
    }

    await this.saveAllScores(allScores);
    console.log(`Score saved. Total users: ${allScores.length}`);
    return scoreData;
  }

  static async getScores(type = 'allTime', limit = 10) {
    const allScores = await this.getAllScores();
    let filtered = this.filterByPeriod(allScores, type);
    
    return filtered
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((score, index) => ({ ...score, rank: index + 1 }));
  }

  static filterByPeriod(scores, type) {
    if (type === 'allTime') return scores;
    
    const now = new Date();
    const cutoff = new Date(now);
    
    switch (type) {
      case 'daily': cutoff.setDate(cutoff.getDate() - 1); break;
      case 'weekly': cutoff.setDate(cutoff.getDate() - 7); break;
      case 'monthly': cutoff.setMonth(cutoff.getMonth() - 1); break;
      default: return scores;
    }
    
    return scores.filter(s => new Date(s.timestamp) > cutoff);
  }

  static async clearAll() {
    try {
      const blobs = await list({ prefix: this.SCORES_FILE });
      for (const blob of blobs.blobs) {
        await del(blob.url);
      }
      console.log('All blob data cleared');
    } catch (error) {
      console.error('Error clearing blob data:', error);
    }
  }
}

export default KVStorage;
