require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set. Copy .env.example to .env first.');
    process.exit(1);
  }
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})();
