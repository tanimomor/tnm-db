const fs = require('fs');
const path = require('path');
const { restore } = require('./restore');

async function restoreLatest(options = {}) {
  console.log('Searching for backup folders...\n');

  const backupsDir = path.resolve(process.cwd(), 'private/backups');
  if (!fs.existsSync(backupsDir)) {
    console.log(`No backup folders found. Directory ${backupsDir} does not exist.`);
    process.exit(0);
  }

  let items;
  try {
    items = fs.readdirSync(backupsDir);
  } catch (error) {
    console.error('Error reading directory:', error.message);
    process.exit(1);
  }

  // Find directories matching backup_*.
  const backupFolders = items.filter((item) => {
    const itemPath = path.join(backupsDir, item);
    return fs.statSync(itemPath).isDirectory() && /^backup_.*$/.test(item);
  });

  if (backupFolders.length === 0) {
    console.log(`No backup folders found in ${backupsDir}.`);
    process.exit(0);
  }

  // Sort by folder modified time (newest first)
  backupFolders.sort((a, b) => {
    const statA = fs.statSync(path.join(backupsDir, a));
    const statB = fs.statSync(path.join(backupsDir, b));
    return statB.mtimeMs - statA.mtimeMs;
  });

  const latestBackupFolder = backupFolders[0];
  console.log('Latest backup folder found:');
  console.log(`${latestBackupFolder}\n`);

  // Call the existing restore command
  await restore(latestBackupFolder, options);
}

module.exports = { restoreLatest };
