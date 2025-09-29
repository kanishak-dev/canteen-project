// backend/hash-password.js
const bcrypt = require('bcrypt');
const password = process.argv[2]; // Get password from command line

if (!password) {
  console.log('Please provide a password. Usage: node hash-password.js <your-password>');
  process.exit(1);
}

const saltRounds = 10;
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Your Hashed Password Is:');
  console.log(hash);
});