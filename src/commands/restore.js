const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const { execCommand } = require('../utils/exec');

async function emptyDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

async function restore(folder, options = {}) {
  const baseBackupsDir = path.resolve(process.cwd(), 'private/backups');
  const dirPath = path.isAbsolute(folder) || folder.startsWith('private') ? path.resolve(process.cwd(), folder) : path.join(baseBackupsDir, folder);

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

  console.log(`Starting restore...`);
  console.log('Restoring database...');

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
    console.log('Database restored successfully.');

    if (options.withFiles) {
      const zipFile = files.find(f => f.endsWith('.zip'));
      if (zipFile) {
        console.log('Restoring uploaded files...');
        const zipFilePath = path.join(dirPath, zipFile);
        const targetFilesPathStr = process.env.FILES_PATH || './public/uploads';
        const targetFilesPath = path.resolve(process.cwd(), targetFilesPathStr);

        await emptyDir(targetFilesPath);
        console.log('Uploads directory cleaned.');

        const readStream = fs.createReadStream(zipFilePath);
        await new Promise((resolve, reject) => {
          readStream.pipe(unzipper.Extract({ path: targetFilesPath }))
            .on('close', resolve)
            .on('error', reject);
        });
        console.log('Files extracted successfully.');
      } else {
        console.log('No files archive found in the backup folder.');
      }
    }

    console.log('Restore completed.');
  } catch (error) {
    console.error('Restore failed:');
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { restore };
