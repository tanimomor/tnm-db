const fs = require('fs');
const path = require('path');
const extract = require('extract-zip');
const { execCommand } = require('../utils/exec');

async function emptyDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

async function restore(folder) {
  const dirPath = path.resolve(process.cwd(), folder);

  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    console.error(`Error: Backup folder not found at ${dirPath}`);
    process.exit(1);
  }

  // Find the dump file in the folder
  const files = fs.readdirSync(dirPath);
  const dumpFile = files.find(f => f.endsWith('.dump'));
  
  if (!dumpFile) {
    console.error(`Error: No .dump file found in ${dirPath}`);
    process.exit(1);
  }

  const dumpFilePath = path.join(dirPath, dumpFile);

  console.log(`Starting restore from folder ${folder}...`);
  console.log('Running pg_restore...');

  const command = 'pg_restore';
  const args = [
    '--host', process.env.DATABASE_HOST,
    '--port', process.env.DATABASE_PORT,
    '--username', process.env.DATABASE_USERNAME,
    '--dbname', process.env.DATABASE_NAME,
    '--verbose',
    dumpFilePath
  ];

  try {
    await execCommand(command, args, { PGPASSWORD: process.env.DATABASE_PASSWORD });
    console.log('Database restore completed successfully.');

    const zipFile = files.find(f => f.endsWith('.zip'));
    if (zipFile) {
      console.log('Found files backup. Starting files restore...');
      const zipFilePath = path.join(dirPath, zipFile);
      const targetFilesPathStr = process.env.FILES_PATH || './public/uploads';
      const targetFilesPath = path.resolve(process.cwd(), targetFilesPathStr);

      console.log(`Preparing target directory: ${targetFilesPath}`);
      await emptyDir(targetFilesPath);

      console.log(`Extracting files to: ${targetFilesPath}`);
      await extract(zipFilePath, { dir: targetFilesPath });
      console.log('Files restore completed successfully.');
    }

    console.log('Restore completed successfully.');
  } catch (error) {
    console.error('Restore failed:');
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { restore };
