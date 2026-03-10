const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { execCommand } = require('../utils/exec');

async function zipFiles(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);

    stream.on('close', () => resolve());
    archive.on('error', err => reject(err));

    archive.pipe(stream);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

// Ensure the db dump and zip go into a newly created folder format
async function backup(options = {}) {
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
  const folderName = `backup_${dbName}_${timestamp}`;
  const dirPath = path.resolve(process.cwd(), folderName);

  console.log(`Creating backup folder: ${folderName}`);
  fs.mkdirSync(dirPath, { recursive: true });

  const filename = `${folderName}.dump`;
  const dumpFilePath = path.join(dirPath, filename);

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
    '--file', dumpFilePath,
    dbName
  ];

  try {
    await execCommand(command, args, { PGPASSWORD: process.env.DATABASE_PASSWORD });
    console.log('Database backup completed successfully.');

    if (options.withFiles) {
      console.log('Starting files backup...');
      const filesPathStr = process.env.FILES_PATH || './public/uploads';
      const filesPath = path.resolve(process.cwd(), filesPathStr);
      
      if (fs.existsSync(filesPath)) {
        console.log(`Compressing files from: ${filesPath}`);
        const zipFile = path.join(dirPath, 'uploads.zip');
        await zipFiles(filesPath, zipFile);
        console.log('Files compressed successfully.');
      } else {
        console.log(`Files directory not found at: ${filesPath}. Skipping files backup.`);
      }
    }

    console.log('Backup completed successfully.');
  } catch (error) {
    console.error('Backup failed:');
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { backup };
