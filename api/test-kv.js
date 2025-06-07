// Debug API to test KV connection
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    console.log('Testing KV connection...');
    
    // Test write
    await kv.set('test-key', { message: 'KV is working!', timestamp: new Date().toISOString() });
    
    // Test read
    const result = await kv.get('test-key');
    
    return res.status(200).json({
      success: true,
      message: 'KV connection working',
      data: result,
      env: {
        hasStorageUrl: !!process.env.STORAGE_URL,
        hasStorageToken: !!process.env.STORAGE_TOKEN
      }
    });
    
  } catch (error) {
    console.error('KV test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      env: {
        hasStorageUrl: !!process.env.STORAGE_URL,
        hasStorageToken: !!process.env.STORAGE_TOKEN
      }
    });
  }
}