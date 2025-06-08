// Test endpoint simple
export default function handler(req, res) {
  console.log('Validation key endpoint called');
  
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const key = 'eaec0411ee44fc993c3a0308e91893512f418c9429dd84e45650896102c2caa7b3ca72971347f5f5ca83ccad915835d4a1cd810cea8541cc9cf543e876bd8f7c';
  
  return res.status(200).end(key);
}