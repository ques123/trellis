// Usage: node scripts/hash-password.js 'your password here'
// Prints AUTH_PASSWORD_HASH=<salt>:<hash> to paste into .env
const crypto = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(crypto.scrypt);

(async () => {
  const password = process.argv[2];
  if (!password) {
    console.error("Usage: node scripts/hash-password.js 'your password'");
    process.exit(1);
  }
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  console.log(`AUTH_PASSWORD_HASH=${salt.toString('hex')}:${hash.toString('hex')}`);
})();
