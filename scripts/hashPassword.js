// Usage: node scripts/hashPassword.js <yourPassword>
const bcrypt = require("bcrypt");

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hashPassword.js <yourPassword>");
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log("Hashed password:", hash);
});
