// Vercel KV Storage for Pi Runner scores with fallback
import { Redis } from '@upstash/redis';
import EnvStorage from './EnvStorage.js';

// REST API configuration for Upstash Redis
const redis = new Redis({
  url: 'https://redis-18507.crce202.eu-west-3-1.ec2.redns.redis-cloud.com',
  token: process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN,
});

class KVStorage {
  static SCORES_KEY = 'pi-runner:scores';
  static LEADERBOARD_KEY = 'pi-runner:leaderboard';

  static async addScore(scoreData) {
    try {
      console.log('Adding score to Redis storage:', scoreData);
      
      // Get existing scores with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis timeout')), 3000)
      );
      
      const existingScores = await Promise.race([
        redis.get(this.SCORES_KEY),
        timeoutPromise
      ]) || [];
      
      // Check for duplicates
      const existingIndex = existingScores.findIndex(s => s.paymentId === scoreData.paymentId);
      
      if (existingIndex >= 0) {
        console.log('Score already exists, updating...');
        existingScores[existingIndex] = scoreData;
      } else {
        console.log('Adding new score...');
        existingScores.push(scoreData);
      }
      
      // Save back to Redis with timeout
      await Promise.race([
        redis.set(this.SCORES_KEY, existingScores),
        timeoutPromise
      ]);
      
      console.log(`Total scores in Redis: ${existingScores.length}`);
      return scoreData;
      
    } catch (error) {
      console.error('Redis failed, using fallback env storage:', error);
      // Fallback to env storage if Redis fails
      return await EnvStorage.addScore(scoreData);
    }
  }

  static async getAllScores() {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis timeout')), 3000)
      );
      
      const scores = await Promise.race([
        redis.get(this.SCORES_KEY),
        timeoutPromise
      ]);
      
      return scores || [];
    } catch (error) {
      console.error('Redis failed for getAllScores, using fallback env storage:', error);
      // Fallback to env storage if Redis fails
      return EnvStorage.getScoresFromEnv();
    }
  }

  static async getScores(type = 'allTime', limit = 10) {
    try {
      console.log(`Getting scores from Redis: ${type}, limit: ${limit}`);
      
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
      console.error('Redis failed for getScores, using fallback env storage:', error);
      // Fallback to env storage if Redis fails
      return await EnvStorage.getScores(type, limit);
    }
  }

  // Debug function to clear all data
  static async clearAll() {
    try {
      await redis.del(this.SCORES_KEY);
      await redis.del(this.LEADERBOARD_KEY);
      console.log('All Redis data cleared');
    } catch (error) {
      console.error('Error clearing Redis data:', error);
    }
  }
}

export default KVStorage;