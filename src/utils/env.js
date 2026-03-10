const dotenv = require('dotenv');

function loadEnv() {
  // Load variables from .env file into process.env
  dotenv.config();

  const requiredVars = [
    'DATABASE_CLIENT',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_NAME',
    'DATABASE_USERNAME',
    'DATABASE_PASSWORD'
  ];

  const missingVars = [];

  requiredVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  });

  if (process.env.DATABASE_CLIENT !== 'postgres') {
    console.error('Error: DATABASE_CLIENT must be set to "postgres".');
    process.exit(1);
  }

  if (missingVars.length > 0) {
    console.error('Error: Missing required environment variables:');
    missingVars.forEach((envVar) => console.error(` - ${envVar}`));
    process.exit(1);
  }
}

module.exports = { loadEnv };
