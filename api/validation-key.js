// Endpoint alternativo para servir validation key
export default function handler(req, res) {
  // Solo permitir GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Headers correctos para texto plano
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  
  // La validation key de Pi Network
  const validationKey = 'eaec0411ee44fc993c3a0308e91893512f418c9429dd84e45650896102c2caa7b3ca72971347f5f5ca83ccad915835d4a1cd810cea8541cc9cf543e876bd8f7c';
  
  // Retornar solo la key sin espacios ni saltos de línea extra
  res.status(200).send(validationKey);
}