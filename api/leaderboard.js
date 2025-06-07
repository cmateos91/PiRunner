// Leaderboard API - Get scores with Vercel KV storage
import KVStorage from '../lib/KVStorage.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log(`=== LEADERBOARD API ${req.method} ===`);
    
    if (req.method === 'GET') {
      console.log('Getting leaderboard scores...');
      const { type = 'allTime', limit = 10 } = req.query;
      console.log('Query params:', { type, limit });
      
      const scores = await KVStorage.getScores(type, parseInt(limit));
      console.log(`Found ${scores.length} scores`);
      
      return res.status(200).json({
        success: true,
        leaderboard: scores,
        type: type,
        total: scores.length
      });
    }

    if (req.method === 'POST') {
      console.log('Saving new score...');
      const { paymentData, userInfo } = req.body;
      console.log('Received data:', { paymentData: !!paymentData, userInfo: !!userInfo });
      
      if (!paymentData || !userInfo) {
        console.error('Missing required data');
        return res.status(400).json({
          success: false,
          error: 'Missing paymentData or userInfo'
        });
      }

      const newScore = {
        id: generateScoreId(),
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

      console.log('New score object:', newScore);

      await KVStorage.addScore(newScore);
      console.log('Score saved successfully');

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

function generateScoreId() {
  return 'score_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}