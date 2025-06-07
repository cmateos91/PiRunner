// Test Vercel KV simple
export default async function handler(req, res) {
  try {
    console.log('Testing Vercel KV...');
    
    // Import Vercel KV
    const { kv } = await import('@vercel/kv');
    
    // Test write
    await kv.set('test-key', { 
      message: 'Hello from Vercel KV',
      timestamp: new Date().toISOString()
    });
    
    // Test read
    const result = await kv.get('test-key');
    
    return res.status(200).json({
      success: true,
      message: 'Vercel KV working!',
      data: result,
      env: {
        hasKvUrl: !!process.env.KV_URL,
        hasKvRestUrl: !!process.env.KV_REST_API_URL,
        hasKvToken: !!process.env.KV_REST_API_TOKEN
      }
    });
    
  } catch (error) {
    console.error('KV Test failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
