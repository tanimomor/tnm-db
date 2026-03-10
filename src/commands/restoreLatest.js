const fs = require('fs');
const path = require('path');
const { restore } = require('./restore');

async function restoreLatest() {
  console.log('Searching for backup files...\n');

  const cwd = process.cwd();
  let files;
  try {
    files = fs.readdirSync(cwd);
  } catch (error) {
    console.error('Error reading directory:', error.message);
    process.exit(1);
  }

  // Find files matching backup_*.dump pattern
  const backupFiles = files.filter((file) => /^backup_.*\.dump$/.test(file));

  if (backupFiles.length === 0) {
    console.log('No backup files found in the current directory.');
    process.exit(0);
  }

  // Sort by file modified time (newest first)
  backupFiles.sort((a, b) => {
    const statA = fs.statSync(path.join(cwd, a));
    const statB = fs.statSync(path.join(cwd, b));
    return statB.mtimeMs - statA.mtimeMs;
  });

  const latestBackup = backupFiles[0];
  console.log('Latest backup found:');
  console.log(`${latestBackup}\n`);

  // Call the existing restore command
  await restore(latestBackup);
}

module.exports = { restoreLatest };
