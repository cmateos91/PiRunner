// Test API para Blob Storage
import KVStorage from '../lib/KVStorage.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    console.log('Testing Blob Storage...');

    if (req.method === 'GET') {
      const scores = await KVStorage.getAllScores();
      
      return res.status(200).json({
        success: true,
        message: 'Blob Storage working!',
        totalScores: scores.length,
        scores: scores.slice(0, 3),
        env: {
          hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN
        }
      });
    }

    if (req.method === 'POST') {
      const testScore = {
        id: `test_${Date.now()}`,
        paymentId: `test_payment_${Math.random()}`,
        userUid: 'test_user',
        username: 'TestUser',
        score: Math.floor(Math.random() * 1000),
        coins: 1,
        timestamp: new Date().toISOString(),
        txid: 'test_txid',
        verified: true,
        gameVersion: '1.0'
      };

      await KVStorage.addScore(testScore);

      return res.status(200).json({
        success: true,
        message: 'Test score saved!',
        testScore
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Blob test failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
