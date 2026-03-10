const path = require('path');
const { execCommand } = require('../utils/exec');

async function backup() {
  console.log('Starting backup...');

  const dbName = process.env.DATABASE_NAME;
  
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  const filename = `backup_${dbName}_${timestamp}.dump`;
  const filepath = path.resolve(process.cwd(), filename);

  console.log(`Backup file: ${filename}`);
  console.log('Running pg_dump...');

  const command = 'pg_dump';
  const args = [
    '--host', process.env.DATABASE_HOST,
    '--port', process.env.DATABASE_PORT,
    '--username', process.env.DATABASE_USERNAME,
    '--format=c',
    '--large-objects',
    '--verbose',
    '--file', filepath,
    dbName
  ];

  try {
    await execCommand(command, args, { PGPASSWORD: process.env.DATABASE_PASSWORD });
    console.log('Backup completed successfully.');
  } catch (error) {
    console.error('Backup failed:');
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { backup };
