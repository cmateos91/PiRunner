// Fallback storage using environment variables (temporary)
// This will work as a backup until Redis is properly configured

class EnvStorage {
  static STORAGE_KEY = 'PI_RUNNER_SCORES';
  
  static async addScore(scoreData) {
    try {
      console.log('Adding score to environment storage:', scoreData);
      
      // Get existing scores from process.env (hacky but works)
      const existingScores = this.getScoresFromEnv();
      
      // Check for duplicates
      const existingIndex = existingScores.findIndex(s => s.paymentId === scoreData.paymentId);
      
      if (existingIndex >= 0) {
        console.log('Score already exists, updating...');
        existingScores[existingIndex] = scoreData;
      } else {
        console.log('Adding new score...');
        existingScores.push(scoreData);
      }
      
      // Save back to env (temporary storage)
      this.saveScoresToEnv(existingScores);
      
      console.log(`Total scores in env storage: ${existingScores.length}`);
      return scoreData;
      
    } catch (error) {
      console.error('Error adding score to env storage:', error);
      throw error;
    }
  }

  static async getScores(type = 'allTime', limit = 10) {
    try {
      console.log(`Getting scores from env storage: ${type}, limit: ${limit}`);
      
      const allScores = this.getScoresFromEnv();
      console.log(`Total scores available: ${allScores.length}`);
      
      // Filter by time period
      let filteredScores = [...allScores];
      const now = new Date();
      
      if (type === 'daily') {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        filteredScores = allScores.filter(s => new Date(s.timestamp) > yesterday);
      } else if (type === 'weekly') {
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        filteredScores = allScores.filter(s => new Date(s.timestamp) > lastWeek);
      } else if (type === 'monthly') {
        const lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filteredScores = allScores.filter(s => new Date(s.timestamp) > lastMonth);
      }

      // Sort by score descending and limit
      const result = filteredScores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((score, index) => ({
          ...score,
          rank: index + 1
        }));

      console.log(`Returning ${result.length} scores for ${type}`);
      return result;
      
    } catch (error) {
      console.error('Error getting scores from env storage:', error);
      return [];
    }
  }

  static getScoresFromEnv() {
    try {
      const scoresJson = process.env[this.STORAGE_KEY];
      return scoresJson ? JSON.parse(scoresJson) : [];
    } catch (error) {
      console.error('Error parsing scores from env:', error);
      return [];
    }
  }

  static saveScoresToEnv(scores) {
    try {
      // Limit to last 100 scores to avoid env size limits
      const limitedScores = scores.slice(-100);
      process.env[this.STORAGE_KEY] = JSON.stringify(limitedScores);
      console.log(`Saved ${limitedScores.length} scores to env`);
    } catch (error) {
      console.error('Error saving scores to env:', error);
    }
  }

  static async clearAll() {
    try {
      delete process.env[this.STORAGE_KEY];
      console.log('All env data cleared');
    } catch (error) {
      console.error('Error clearing env data:', error);
    }
  }
}

export default EnvStorage;