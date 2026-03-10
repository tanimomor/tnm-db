const fs = require('fs');
const path = require('path');
const { restore } = require('./restore');

async function restoreLatest() {
  console.log('Searching for backup folders...\n');

  const cwd = process.cwd();
  let items;
  try {
    items = fs.readdirSync(cwd);
  } catch (error) {
    console.error('Error reading directory:', error.message);
    process.exit(1);
  }

  // Find directories matching backup_*.
  const backupFolders = items.filter((item) => {
    const itemPath = path.join(cwd, item);
    return fs.statSync(itemPath).isDirectory() && /^backup_.*$/.test(item);
  });

  if (backupFolders.length === 0) {
    console.log('No backup folders found in the current directory.');
    process.exit(0);
  }

  // Sort by folder modified time (newest first)
  backupFolders.sort((a, b) => {
    const statA = fs.statSync(path.join(cwd, a));
    const statB = fs.statSync(path.join(cwd, b));
    return statB.mtimeMs - statA.mtimeMs;
  });

  const latestBackupFolder = backupFolders[0];
  console.log('Latest backup folder found:');
  console.log(`${latestBackupFolder}\n`);

  // Call the existing restore command
  await restore(latestBackupFolder);
}

module.exports = { restoreLatest };
