// Leaderboard API - Get scores
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Obtener leaderboard
      const { type = 'allTime', limit = 10 } = req.query;
      
      const scores = await getScores(type, parseInt(limit));
      
      return res.status(200).json({
        success: true,
        leaderboard: scores,
        type: type,
        total: scores.length
      });
    }

    if (req.method === 'POST') {
      // Agregar nuevo score (solo desde backend internal)
      const { paymentData, userInfo } = req.body;
      
      const newScore = {
        id: generateScoreId(),
        paymentId: paymentData.identifier,
        userUid: paymentData.user_uid,
        username: userInfo.username,
        score: paymentData.metadata.score,
        coins: paymentData.metadata.coins,
        timestamp: new Date().toISOString(),
        txid: paymentData.transaction?.txid || null,
        verified: paymentData.status.developer_completed,
        gameVersion: paymentData.metadata.gameVersion || "1.0"
      };

      await saveScore(newScore);
      await updateLeaderboards(newScore);

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

// Simple file-based storage (for testing)
// TODO: Replace with real database
let scoresStorage = [];

async function getScores(type = 'allTime', limit = 10) {
  // Filter by time period
  let filteredScores = scoresStorage;
  
  if (type === 'daily') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    filteredScores = scoresStorage.filter(s => new Date(s.timestamp) > yesterday);
  } else if (type === 'weekly') {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    filteredScores = scoresStorage.filter(s => new Date(s.timestamp) > lastWeek);
  } else if (type === 'monthly') {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    filteredScores = scoresStorage.filter(s => new Date(s.timestamp) > lastMonth);
  }

  // Sort by score descending and limit
  return filteredScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((score, index) => ({
      ...score,
      rank: index + 1
    }));
}

async function saveScore(scoreData) {
  // Add to in-memory storage
  scoresStorage.push(scoreData);
  
  // TODO: Save to real database
  console.log('Score saved:', scoreData);
}

async function updateLeaderboards(newScore) {
  // TODO: Update cached leaderboards efficiently
  console.log('Leaderboards updated with new score:', newScore.score);
}

function generateScoreId() {
  return 'score_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}