// Leaderboard API - Simplificado
import LeaderboardService from '../lib/LeaderboardService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      // Health check
      if (req.query.health === 'true') {
        const health = await LeaderboardService.healthCheck();
        return res.status(200).json(health);
      }
      
      const { type = 'allTime', limit = 10 } = req.query;
      const scores = await LeaderboardService.getScores(type, parseInt(limit));
      
      return res.status(200).json({
        success: true,
        leaderboard: scores,
        type,
        total: scores.length
      });
    }

    if (req.method === 'POST') {
      const { paymentData, userInfo } = req.body;
      
      if (!paymentData || !userInfo) {
        return res.status(400).json({
          success: false,
          error: 'Missing paymentData or userInfo'
        });
      }

      const newScore = {
        id: `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentId: paymentData.identifier,
        userUid: paymentData.user_uid,
        username: userInfo.username,
        score: paymentData.metadata?.score || 0,
        coins: paymentData.metadata?.coins || 0,
        timestamp: new Date().toISOString(),
        txid: paymentData.transaction?.txid || null,
        verified: paymentData.status?.developer_completed || false,
        gameVersion: paymentData.metadata?.gameVersion || "1.0"
      };

      await LeaderboardService.saveScore(newScore);

      return res.status(200).json({
        success: true,
        message: 'Score saved successfully',
        score: newScore
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process leaderboard request',
      details: error.message
    });
  }
}
