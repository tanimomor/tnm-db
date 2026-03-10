const path = require('path');
const fs = require('fs');
const { execCommand } = require('../utils/exec');

async function restore(file) {
  const filepath = path.resolve(process.cwd(), file);

  if (!fs.existsSync(filepath)) {
    console.error(`Error: Dump file not found at ${filepath}`);
    process.exit(1);
  }

  console.log(`Starting restore from ${file}...`);
  console.log('Running pg_restore...');

  const command = 'pg_restore';
  const args = [
    '--host', process.env.DATABASE_HOST,
    '--port', process.env.DATABASE_PORT,
    '--username', process.env.DATABASE_USERNAME,
    '--dbname', process.env.DATABASE_NAME,
    '--verbose',
    filepath
  ];

  try {
    await execCommand(command, args, { PGPASSWORD: process.env.DATABASE_PASSWORD });
    console.log('Restore completed successfully.');
  } catch (error) {
    console.error('Restore failed:');
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { restore };
