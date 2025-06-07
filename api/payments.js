// Pi Network Backend Integration
// API Functions for Vercel Serverless

const PI_API_KEY = 'odukea0zelpnbewox9feh6ovr3nti06egwfyzkkekhkyzbunamixhuibj0fers5k';
const PI_API_BASE = 'https://api.minepi.com/v2';

// CORS headers for frontend requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper function to make Pi API requests
async function piApiRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${PI_API_BASE}${endpoint}`, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Pi API Error: ${response.status} - ${errorText}`);
      throw new Error(`Pi API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Pi API Request failed:', error);
    throw error;
  }
}

// Approve payment (Server-Side Approval)
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Add CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const { action, paymentId, txid } = req.body;

    if (!action || !paymentId) {
      return res.status(400).json({
        error: 'Missing required parameters: action, paymentId'
      });
    }

    let result;

    switch (action) {
      case 'approve':
        console.log(`Approving payment: ${paymentId}`);
        result = await piApiRequest(`/payments/${paymentId}/approve`, 'POST');
        
        return res.status(200).json({
          success: true,
          message: 'Payment approved successfully',
          payment: result
        });

      case 'complete':
        if (!txid) {
          return res.status(400).json({
            error: 'Missing txid for completion'
          });
        }

        console.log(`Completing payment: ${paymentId} with txid: ${txid}`);
        result = await piApiRequest(`/payments/${paymentId}/complete`, 'POST', { txid });

        // Guardar score en leaderboard después de completar pago
        await saveScoreToLeaderboard(result);

        return res.status(200).json({
          success: true,
          message: 'Payment completed and score saved to leaderboard',
          payment: result
        });

      case 'cancel':
        console.log(`Cancelling payment: ${paymentId}`);
        result = await piApiRequest(`/payments/${paymentId}/cancel`, 'POST');

        return res.status(200).json({
          success: true,
          message: 'Payment cancelled',
          payment: result
        });

      default:
        return res.status(400).json({
          error: 'Invalid action. Use: approve, complete, or cancel'
        });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Payment processing failed',
      details: error.message
    });
  }
}

// Save score to leaderboard after successful payment
async function saveScoreToLeaderboard(payment) {
  try {
    console.log('=== SAVING SCORE TO LEADERBOARD ===');
    console.log('Payment data:', JSON.stringify(payment, null, 2));

    const scoreData = {
      paymentId: payment.identifier,
      userUid: payment.user_uid,
      score: payment.metadata?.score,
      coins: payment.metadata?.coins,
      timestamp: payment.metadata?.timestamp,
      txid: payment.transaction?.txid
    };

    console.log('Score data to save:', scoreData);

    // Get user info
    const userInfo = await getUserInfo(payment.user_uid);
    console.log('User info:', userInfo);

    // Llamada directa a la función de leaderboard (interna)
    await saveScoreDirectly(payment, userInfo);
    console.log('Score saved to leaderboard successfully via direct call');
    
  } catch (error) {
    console.error('Error saving score to leaderboard:', error);
    // Don't throw error - payment should still complete even if leaderboard fails
  }
}

// Función para guardar directamente sin HTTP
async function saveScoreDirectly(paymentData, userInfo) {
  try {
    console.log('Saving score directly...');
    
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

    // Guardar en storage global
    await saveScoreToGlobalStorage(newScore);
    console.log('Score saved to global storage successfully');

    return newScore;
  } catch (error) {
    console.error('Error in direct save:', error);
    throw error;
  }
}

// Storage global compartido entre funciones
global.globalScoresStorage = global.globalScoresStorage || [];

async function saveScoreToGlobalStorage(scoreData) {
  console.log('Saving to global storage:', scoreData);
  
  // Check if score already exists (prevent duplicates)
  const existingIndex = global.globalScoresStorage.findIndex(s => s.paymentId === scoreData.paymentId);
  
  if (existingIndex >= 0) {
    console.log('Score already exists, updating...');
    global.globalScoresStorage[existingIndex] = scoreData;
  } else {
    console.log('Adding new score...');
    global.globalScoresStorage.push(scoreData);
  }
  
  console.log(`Global storage now has ${global.globalScoresStorage.length} total scores`);
  return scoreData;
}

function generateScoreId() {
  return 'score_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get user info for leaderboard
async function getUserInfo(userUid) {
  try {
    // For now, return basic info
    // TODO: Get actual user info from Pi API if available
    return {
      username: `user_${userUid.substr(-8)}`, // Use last 8 chars of UID as temp username
      uid: userUid
    };
  } catch (error) {
    console.error('Error getting user info:', error);
    return {
      username: `user_${userUid.substr(-8)}`,
      uid: userUid
    };
  }
}