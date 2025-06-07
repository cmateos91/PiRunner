// API para recuperar y procesar pagos incompletos
import KVStorage from '../lib/KVStorage.js';

const PI_API_KEY = 'odukea0zelpnbewox9feh6ovr3nti06egwfyzkkekhkyzbunamixhuibj0fers5k';
const PI_API_BASE = 'https://api.minepi.com/v2';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    console.log('=== PROCESSING INCOMPLETE PAYMENTS ===');
    
    // Get incomplete payments from Pi API
    const response = await fetch(`${PI_API_BASE}/payments/incomplete_server_payments`, {
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Pi API Error: ${response.status}`);
    }

    const data = await response.json();
    const incompletePayments = data.incomplete_server_payments || [];
    
    console.log(`Found ${incompletePayments.length} incomplete payments`);
    
    const processedPayments = [];
    
    for (const payment of incompletePayments) {
      try {
        console.log(`Processing payment: ${payment.identifier}`);
        
        // Check if transaction is verified and we can save the score
        if (payment.status.transaction_verified && payment.transaction?.txid) {
          console.log('Transaction verified, saving score...');
          
          // Save score even if payment completion fails
          await saveVerifiedScore(payment);
          
          processedPayments.push({
            paymentId: payment.identifier,
            status: 'score_saved',
            score: payment.metadata?.score
          });
        }
      } catch (error) {
        console.error(`Error processing payment ${payment.identifier}:`, error);
        processedPayments.push({
          paymentId: payment.identifier,
          status: 'error',
          error: error.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${incompletePayments.length} incomplete payments`,
      incomplete_payments: incompletePayments.length,
      processed: processedPayments
    });

  } catch (error) {
    console.error('Error processing incomplete payments:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process incomplete payments',
      details: error.message
    });
  }
}

async function saveVerifiedScore(payment) {
  try {
    const userInfo = {
      username: `user_${payment.user_uid.substr(-8)}`,
      uid: payment.user_uid
    };

    const newScore = {
      id: `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentId: payment.identifier,
      userUid: payment.user_uid,
      username: userInfo.username,
      score: payment.metadata?.score || 0,
      coins: payment.metadata?.coins || 0,
      timestamp: new Date().toISOString(),
      txid: payment.transaction?.txid || null,
      verified: payment.status.transaction_verified,
      gameVersion: payment.metadata?.gameVersion || "1.0",
      fromIncomplete: true // Flag to indicate this came from incomplete payment recovery
    };

    await KVStorage.addScore(newScore);
    console.log(`Score saved for incomplete payment: ${payment.identifier}`);
    
    return newScore;
  } catch (error) {
    console.error('Error saving verified score:', error);
    throw error;
  }
}