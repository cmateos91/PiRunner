// Simple file-based storage for scores
// Since Vercel functions are stateless, we need persistent storage

import { promises as fs } from 'fs';
import path from 'path';

const SCORES_FILE = '/tmp/scores.json';

class ScoreStorage {
  static async loadScores() {
    try {
      const data = await fs.readFile(SCORES_FILE, 'utf8');
      const scores = JSON.parse(data);
      console.log(`Loaded ${scores.length} scores from file`);
      return scores;
    } catch (error) {
      console.log('No existing scores file, starting fresh');
      return [];
    }
  }

  static async saveScores(scores) {
    try {
      await fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2));
      console.log(`Saved ${scores.length} scores to file`);
    } catch (error) {
      console.error('Error saving scores to file:', error);
    }
  }

  static async addScore(scoreData) {
    const scores = await this.loadScores();
    
    // Check for duplicates
    const existingIndex = scores.findIndex(s => s.paymentId === scoreData.paymentId);
    
    if (existingIndex >= 0) {
      console.log('Score already exists, updating...');
      scores[existingIndex] = scoreData;
    } else {
      console.log('Adding new score...');
      scores.push(scoreData);
    }
    
    await this.saveScores(scores);
    console.log(`Total scores: ${scores.length}`);
    return scoreData;
  }

  static async getScores(type = 'allTime', limit = 10) {
    const scores = await this.loadScores();
    console.log(`Getting scores: ${type}, total available: ${scores.length}`);
    
    // Filter by time period
    let filteredScores = [...scores];
    const now = new Date();
    
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
  }
}

export default ScoreStorage;