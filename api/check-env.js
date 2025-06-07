// Debug API para verificar variables de entorno
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    return res.status(200).json({
      success: true,
      env: {
        hasPiApiKey: !!process.env.PI_API_KEY,
        piApiKeyLength: process.env.PI_API_KEY?.length || 0,
        piApiKeyFirst10: process.env.PI_API_KEY?.substring(0, 10) || 'NOT_SET',
        hasPiWallet: !!process.env.PI_WALLET_ADDRESS,
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
