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

    // Construir URL correcta para la API
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://pi-runner.vercel.app';
    
    const apiUrl = `${baseUrl}/api/leaderboard`;
    console.log('Calling leaderboard API:', apiUrl);

    // Call leaderboard API to save score
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentData: payment,
        userInfo: userInfo
      })
    });

    console.log('Leaderboard API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Leaderboard API error:', errorText);
      throw new Error(`Leaderboard API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Score saved to leaderboard successfully:', result);
    
  } catch (error) {
    console.error('Error saving score to leaderboard:', error);
    // Don't throw error - payment should still complete even if leaderboard fails
  }
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