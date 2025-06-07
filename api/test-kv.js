// Debug API to test Redis connection
import { Redis } from '@upstash/redis';

// Manual Redis configuration
const redis = new Redis({
  url: 'https://redis-18507.crce202.eu-west-3-1.ec2.redns.redis-cloud.com:18507',
  token: process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN,
});

export default async function handler(req, res) {
  try {
    console.log('Testing Redis connection...');
    
    // Test write
    const testData = { 
      message: 'Redis is working!', 
      timestamp: new Date().toISOString(),
      test: true 
    };
    
    await redis.set('test-key', JSON.stringify(testData));
    
    // Test read
    const result = await redis.get('test-key');
    const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
    
    return res.status(200).json({
      success: true,
      message: 'Redis connection working perfectly!',
      data: parsedResult,
      env: {
        hasKvToken: !!process.env.KV_REST_API_TOKEN,
        hasStorageToken: !!process.env.STORAGE_REST_API_TOKEN,
        tokenUsed: process.env.KV_REST_API_TOKEN ? 'KV_REST_API_TOKEN' : 'STORAGE_REST_API_TOKEN'
      }
    });
    
  } catch (error) {
    console.error('Redis test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      env: {
        hasKvToken: !!process.env.KV_REST_API_TOKEN,
        hasStorageToken: !!process.env.STORAGE_REST_API_TOKEN
      }
    });
  }
}