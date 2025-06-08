// Validation key endpoint for Pi Network domain verification
export default function handler(req, res) {
  // Return the validation key as plain text
  const validationKey = 'pi-apps-domain-verification=2d9b2dac652d45b1d00ee1bee5ef2b5d05c2a3be0fef8e59f7ffd2024e9de725';
  
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(validationKey);
}