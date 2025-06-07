// Leaderboard API - Get scores with persistent storage
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
      
      const scores = await getScores(type, parseInt(limit));
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

      await saveScore(newScore);
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

// Simple persistent storage using global variable + file simulation
// For production, replace with real database (Vercel KV, MongoDB, etc.)

async function initializeStorage() {
  if (!global.globalScoresStorage) {
    console.log('Initializing global scores storage...');
    global.globalScoresStorage = [];
    console.log('Global storage initialized');
  }
  return global.globalScoresStorage;
}

async function getScores(type = 'allTime', limit = 10) {
  console.log(`Getting scores for type: ${type}, limit: ${limit}`);
  
  const storage = await initializeStorage();
  console.log(`Total scores in global storage: ${storage.length}`);
  
  // Filter by time period
  let filteredScores = [...storage];
  
  const now = new Date();
  
  if (type === 'daily') {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    filteredScores = storage.filter(s => new Date(s.timestamp) > yesterday);
    console.log(`Daily scores: ${filteredScores.length}`);
  } else if (type === 'weekly') {
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    filteredScores = storage.filter(s => new Date(s.timestamp) > lastWeek);
    console.log(`Weekly scores: ${filteredScores.length}`);
  } else if (type === 'monthly') {
    const lastMonth = new Date(now);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    filteredScores = storage.filter(s => new Date(s.timestamp) > lastMonth);
    console.log(`Monthly scores: ${filteredScores.length}`);
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

async function saveScore(scoreData) {
  console.log('Saving score to global storage:', scoreData);
  
  const storage = await initializeStorage();
  
  // Check if score already exists (prevent duplicates)
  const existingIndex = storage.findIndex(s => s.paymentId === scoreData.paymentId);
  
  if (existingIndex >= 0) {
    console.log('Score already exists, updating...');
    storage[existingIndex] = scoreData;
  } else {
    console.log('Adding new score...');
    storage.push(scoreData);
  }
  
  console.log(`Global storage now has ${storage.length} total scores`);
  return scoreData;
}

function generateScoreId() {
  return 'score_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}