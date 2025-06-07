// Debug API to test KV connection
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    console.log('Testing KV connection...');
    
    // Test write
    const testData = { 
      message: 'KV is working!', 
      timestamp: new Date().toISOString(),
      test: true 
    };
    
    await kv.set('test-key', testData);
    
    // Test read
    const result = await kv.get('test-key');
    
    return res.status(200).json({
      success: true,
      message: 'KV connection working perfectly!',
      data: result,
      env: {
        hasKvUrl: !!process.env.KV_REST_API_URL,
        hasKvToken: !!process.env.KV_REST_API_TOKEN,
        hasStorageUrl: !!process.env.STORAGE_REST_API_URL,
        hasStorageToken: !!process.env.STORAGE_REST_API_TOKEN
      }
    });
    
  } catch (error) {
    console.error('KV test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      env: {
        hasKvUrl: !!process.env.KV_REST_API_URL,
        hasKvToken: !!process.env.KV_REST_API_TOKEN,
        hasStorageUrl: !!process.env.STORAGE_REST_API_URL,
        hasStorageToken: !!process.env.STORAGE_REST_API_TOKEN
      }
    });
  }
}