// Test local del storage
import KVStorage from './lib/KVStorage.js';
import LeaderboardService from './lib/LeaderboardService.js';

async function testStorage() {
  console.log('🧪 Testing storage system...');
  
  try {
    // Test health check
    console.log('\n📊 Health check:');
    const health = await LeaderboardService.healthCheck();
    console.log(JSON.stringify(health, null, 2));
    
    // Test add score
    console.log('\n💾 Testing score save:');
    const testScore = {
      id: 'test_' + Date.now(),
      paymentId: 'test_payment_' + Math.random(),
      userUid: 'test_user',
      username: 'TestUser',
      score: 1000,
      coins: 5,
      timestamp: new Date().toISOString(),
      txid: 'test_txid',
      verified: true,
      gameVersion: '1.0'
    };
    
    await LeaderboardService.saveScore(testScore);
    console.log('✅ Score saved successfully');
    
    // Test get scores
    console.log('\n📋 Testing score retrieval:');
    const scores = await LeaderboardService.getScores('allTime', 10);
    console.log(`Found ${scores.length} scores`);
    console.log(JSON.stringify(scores.slice(0, 3), null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testStorage();
