// Test endpoint simple
export default function handler(req, res) {
  console.log('Validation key endpoint called');
  
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const key = 'd000122b5060bd592f959c1f505c2066418e2660e8ebc2835db71cc0ce6c767edf28caab8796cdd2e9bc869819e998e59ab581dedb2fbc6b6d3215243a93396e';
  
  return res.status(200).end(key);
}