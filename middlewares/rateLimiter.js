const limit = require('express-rate-limit');

const rateLimiter = limit({
  windowsMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = rateLimiter;
