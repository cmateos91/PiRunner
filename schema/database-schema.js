// Database schema para almacenar scores
// Usando Vercel KV (Redis) o cualquier base de datos

const scores = [
  {
    id: "unique-score-id",
    paymentId: "payment-identifier-from-pi",
    userUid: "user-app-specific-id",
    username: "player-username", 
    score: 1250,
    coins: 15,
    timestamp: "2025-06-07T14:30:00Z",
    txid: "blockchain-transaction-id",
    verified: true,
    gameVersion: "1.0"
  }
];

// Estructura para leaderboard
const leaderboard = {
  allTime: [], // Mejores scores de todos los tiempos
  daily: [],   // Mejores del día
  weekly: [],  // Mejores de la semana
  monthly: []  // Mejores del mes
};