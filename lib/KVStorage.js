// Vercel KV Storage for Pi Runner scores
import { Redis } from '@upstash/redis';

// Manual Redis configuration to fix SSL issues
const redis = new Redis({
  url: 'https://redis-18507.crce202.eu-west-3-1.ec2.redns.redis-cloud.com:18507',
  token: process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN,
});

class KVStorage {
  static SCORES_KEY = 'pi-runner:scores';
  static LEADERBOARD_KEY = 'pi-runner:leaderboard';

  static async addScore(scoreData) {
    try {
      console.log('Adding score to KV storage:', scoreData);
      
      // Get existing scores
      const existingScores = await redis.get(this.SCORES_KEY) || [];
      
      // Check for duplicates
      const existingIndex = existingScores.findIndex(s => s.paymentId === scoreData.paymentId);
      
      if (existingIndex >= 0) {
        console.log('Score already exists, updating...');
        existingScores[existingIndex] = scoreData;
      } else {
        console.log('Adding new score...');
        existingScores.push(scoreData);
      }
      
      // Save back to Redis
      await redis.set(this.SCORES_KEY, existingScores);
      
      // Update leaderboard cache
      await this.updateLeaderboardCache(existingScores);
      
      console.log(`Total scores in KV: ${existingScores.length}`);
      return scoreData;
      
    } catch (error) {
      console.error('Error adding score to KV:', error);
      throw error;
    }
  }

  static async getAllScores() {
    try {
      const scores = await redis.get(this.SCORES_KEY);
      return scores || [];
    } catch (error) {
      console.error('Error getting scores from Redis:', error);
      return [];
    }
  }

  static async getScores(type = 'allTime', limit = 10) {
    try {
      console.log(`Getting scores from KV: ${type}, limit: ${limit}`);
      
      const allScores = await this.getAllScores();
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
      console.error('Error getting scores from KV:', error);
      return [];
    }
  }

  static async updateLeaderboardCache(scores) {
    try {
      // Cache different leaderboard types for faster access
      const leaderboards = {
        allTime: this.processScores(scores, 'allTime', 20),
        daily: this.processScores(scores, 'daily', 20),
        weekly: this.processScores(scores, 'weekly', 20),
        monthly: this.processScores(scores, 'monthly', 20),
        lastUpdated: new Date().toISOString()
      };
      
      await redis.set(this.LEADERBOARD_KEY, leaderboards);
      console.log('Leaderboard cache updated');
      
    } catch (error) {
      console.error('Error updating leaderboard cache:', error);
    }
  }

  static processScores(scores, type, limit) {
    const now = new Date();
    let filteredScores = [...scores];
    
    if (type === 'daily') {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      filteredScores = scores.filter(s => new Date(s.timestamp) > yesterday);
    } else if (type === 'weekly') {
      const lastWeek = new Date(now);
      lastWeek.setDate(lastWeek.getDate() - 7);
      filteredScores = scores.filter(s => new Date(s.timestamp) > lastWeek);
    } else if (type === 'monthly') {
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filteredScores = scores.filter(s => new Date(s.timestamp) > lastMonth);
    }

    return filteredScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((score, index) => ({
        ...score,
        rank: index + 1
      }));
  }

  // Debug function to clear all data
  static async clearAll() {
    try {
      await redis.del(this.SCORES_KEY);
      await redis.del(this.LEADERBOARD_KEY);
      console.log('All Redis data cleared');
    } catch (error) {
      console.error('Error clearing KV data:', error);
    }
  }
}

export default KVStorage;