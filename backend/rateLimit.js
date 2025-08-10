const rateLimit = require('express-rate-limit');

// Limite: 100 requisições por 15 minutos por IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: {
    error: 'Muitas requisições, tente novamente mais tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
