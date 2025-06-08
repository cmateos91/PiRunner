// Pi Network Backend Integration
// API Functions for Vercel Serverless

import KVStorage from '../lib/KVStorage.js';
import LeaderboardService from '../lib/LeaderboardService.js';

const PI_API_KEY = process.env.PI_API_KEY;
const PI_API_KEY_TESTNET = process.env.PI_API_KEY_TESTNET;
const PI_NETWORK_MODE = process.env.PI_NETWORK_MODE || 'mainnet';

// Detectar environment por URL y información del frontend
function getEnvironmentFromRequest(req, body = {}) {
  const host = req.headers.host || '';
  const referer = req.headers.referer || '';
  
  // Priorizar información del frontend
  if (body.environment) {
    const { isMainnet, mode, url } = body.environment;
    console.log(`🔍 Frontend environment info: ${mode} (${url})`);
    
    const forceTestnet = url.includes('testnet=true') || url.includes('sandbox=true') || !isMainnet;
    
    return {
      isMainnet: isMainnet && !forceTestnet,
      isTestnet: !isMainnet || forceTestnet,
      apiKey: (!isMainnet || forceTestnet) ? PI_API_KEY_TESTNET || PI_API_KEY : PI_API_KEY,
      mode: forceTestnet ? 'Testnet (frontend)' : isMainnet ? 'Mainnet (frontend)' : 'Testnet (frontend)'
    };
  }
  
  // Fallback: detección por headers
  const forceTestnet = referer.includes('testnet=true') || referer.includes('sandbox=true');
  const forceMainnet = referer.includes('mainnet=true');
  
  if (forceTestnet) {
    return {
      isMainnet: false,
      isTestnet: true,
      apiKey: PI_API_KEY_TESTNET || PI_API_KEY,
      mode: 'Testnet (URL param)'
    };
  }
  
  if (forceMainnet) {
    return {
      isMainnet: true,
      isTestnet: false,
      apiKey: PI_API_KEY,
      mode: 'Mainnet (URL param)'
    };
  }
  
  // Detección por dominio
  const isMainnet = host.includes('runnerpi.xyz');
  const isTestnet = host.includes('vercel.app');
  
  return {
    isMainnet,
    isTestnet,
    apiKey: isMainnet ? PI_API_KEY : PI_API_KEY_TESTNET || PI_API_KEY,
    mode: isMainnet ? 'Mainnet (domain)' : 'Testnet (domain)'
  };
}

const PI_API_BASE = 'https://api.minepi.com/v2';

// CORS headers for frontend requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper function to make Pi API requests
async function piApiRequest(endpoint, method = 'GET', body = null, apiKey = PI_API_KEY) {
  try {
    const options = {
      method,
      headers: {
        'Authorization': `Key ${apiKey}`,
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
    const { action, paymentId, txid, userInfo, environment } = req.body;
    const env = getEnvironmentFromRequest(req, req.body);
    
    console.log(`🔧 Processing ${action} for ${env.mode} (API: ${env.apiKey ? 'configured' : 'missing'})`);

    if (!action || !paymentId) {
      return res.status(400).json({
        error: 'Missing required parameters: action, paymentId'
      });
    }

    let result;

    switch (action) {
      case 'approve':
        console.log(`Approving payment: ${paymentId}`);
        result = await piApiRequest(`/payments/${paymentId}/approve`, 'POST', null, env.apiKey);
        
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
        
        // First, check payment status before trying to complete
        try {
          const paymentStatus = await piApiRequest(`/payments/${paymentId}`, 'GET', null, env.apiKey);
          console.log('Payment status before completion:', paymentStatus.status);
          
          if (paymentStatus.status.cancelled) {
            console.log('Payment was cancelled, cannot complete');
            
            // Even if cancelled, try to save score if transaction was verified
            if (paymentStatus.status.transaction_verified && paymentStatus.transaction?.txid) {
              console.log('Transaction was verified, saving score anyway...');
              await saveScoreToLeaderboard(paymentStatus, userInfo);
              
              return res.status(200).json({
                success: true,
                message: 'Payment was cancelled but score saved due to verified transaction',
                payment: paymentStatus
              });
            }
            
            return res.status(400).json({
              success: false,
              error: 'Payment was cancelled and cannot be completed',
              payment: paymentStatus
            });
          }
          
          if (paymentStatus.status.developer_completed) {
            console.log('Payment already completed');
            return res.status(200).json({
              success: true,
              message: 'Payment already completed',
              payment: paymentStatus
            });
          }
        } catch (statusError) {
          console.error('Error checking payment status:', statusError);
          // Continue with completion attempt if status check fails
        }

        // Attempt to complete the payment
        result = await piApiRequest(`/payments/${paymentId}/complete`, 'POST', { txid }, env.apiKey);

        // Guardar score en leaderboard después de completar pago
        const saveResult = await saveScoreToLeaderboard(result, userInfo);

        return res.status(200).json({
          success: true,
          message: 'Payment completed and score saved to leaderboard',
          payment: result,
          wasImprovement: saveResult?.wasImprovement
        });

      case 'cancel':
        console.log(`Cancelling payment: ${paymentId}`);
        result = await piApiRequest(`/payments/${paymentId}/cancel`, 'POST', null, env.apiKey);

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
async function saveScoreToLeaderboard(payment, userInfo = null) {
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

    // Use provided userInfo or get from getUserInfo function
    const finalUserInfo = userInfo || await getUserInfo(payment.user_uid);
    console.log('User info:', finalUserInfo);

    // Llamada directa a la función de leaderboard (interna)
    const saveResult = await saveScoreDirectly(payment, finalUserInfo);
    
    // Limpiar cache del leaderboard para que se reflejen los cambios
    LeaderboardService.cache.clear();
    console.log('Leaderboard cache cleared');
    
    console.log('Score saved to leaderboard successfully via direct call');
    
    return saveResult;
    
  } catch (error) {
    console.error('Error saving score to leaderboard:', error);
    // Don't throw error - payment should still complete even if leaderboard fails
    return null;
  }
}

// Función para guardar directamente sin HTTP
async function saveScoreDirectly(paymentData, userInfo) {
  try {
    console.log('Saving score directly to persistent storage...');
    
    const newScore = {
      id: generateScoreId(),
      paymentId: paymentData.identifier,
      userUid: paymentData.user_uid,
      username: userInfo.username ? `@${userInfo.username}` : `user_${paymentData.user_uid.substr(-8)}`,
      score: paymentData.metadata?.score || 0,
      coins: paymentData.metadata?.coins || 0,
      timestamp: new Date().toISOString(),
      txid: paymentData.transaction?.txid || null,
      verified: paymentData.status?.developer_completed || false,
      gameVersion: paymentData.metadata?.gameVersion || "1.0"
    };

    console.log('New score object:', newScore);

    // Guardar usando KVStorage (Blob)
    const savedScore = await KVStorage.addScore(newScore);
    
    // Verificar si fue una mejora
    const wasImprovement = savedScore.id === newScore.id; // Solo se guarda con nuevo ID si fue mejora
    console.log(`Score saved to KV storage successfully. Was improvement: ${wasImprovement}`);

    return {
      score: savedScore,
      wasImprovement
    };
  } catch (error) {
    console.error('Error in direct save:', error);
    throw error;
  }
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