// Debug API para verificar el estado del storage
import KVStorage from '../lib/KVStorage.js';
import LeaderboardService from '../lib/LeaderboardService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { action } = req.query;

      if (action === 'raw') {
        // Obtener datos directamente de KVStorage sin cache
        const rawScores = await KVStorage.getAllScores();
        return res.status(200).json({
          success: true,
          message: 'Raw data from storage',
          scores: rawScores,
          total: rawScores.length
        });
      }

      if (action === 'cache') {
        // Obtener datos via LeaderboardService (con cache)
        const cachedScores = await LeaderboardService.getScores('allTime', 20);
        return res.status(200).json({
          success: true,
          message: 'Data via LeaderboardService (cached)',
          scores: cachedScores,
          total: cachedScores.length
        });
      }

      return res.status(200).json({
        message: 'Debug API - use ?action=raw or ?action=cache',
        endpoints: {
          raw: '/api/debug?action=raw',
          cache: '/api/debug?action=cache',
          clearCache: 'DELETE /api/debug',
          clearAll: 'DELETE /api/debug?action=all'
        }
      });
    }

    if (req.method === 'DELETE') {
      const { action } = req.query;

      if (action === 'all') {
        // Limpiar todos los datos
        await KVStorage.clearAll();
        LeaderboardService.cache.clear();
        return res.status(200).json({
          success: true,
          message: 'All data cleared'
        });
      }

      // Solo limpiar cache
      LeaderboardService.cache.clear();
      return res.status(200).json({
        success: true,
        message: 'Cache cleared'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Debug API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
