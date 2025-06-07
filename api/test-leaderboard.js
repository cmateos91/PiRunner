// Test endpoint para verificar datos
import KVStorage from '../lib/KVStorage.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    console.log('=== LEADERBOARD TEST API ===');
    
    // Obtener datos raw
    const allScores = await KVStorage.getAllScores();
    console.log('Raw scores from storage:', allScores);
    
    // Aplicar filtrado y ordenamiento manualmente
    const filtered = allScores.filter(s => s && s.score != null);
    const sorted = filtered.sort((a, b) => b.score - a.score);
    const limited = sorted.slice(0, 10);
    const withRanks = limited.map((score, index) => ({
      ...score,
      rank: index + 1
    }));

    console.log('Processed scores:', withRanks);

    return res.status(200).json({
      success: true,
      raw: allScores,
      processed: withRanks,
      debug: {
        totalRaw: allScores.length,
        afterFilter: filtered.length,
        afterSort: sorted.length,
        afterLimit: limited.length,
        withRanks: withRanks.length
      }
    });

  } catch (error) {
    console.error('Test API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
