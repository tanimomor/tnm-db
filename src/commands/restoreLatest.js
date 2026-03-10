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

  // Find files matching backup_YYYYMMDD_HHmmss.dump pattern
  const backupRegex = /^backup_\d{8}_\d{6}\.dump$/;
  const backupFiles = files.filter((file) => backupRegex.test(file));

  if (backupFiles.length === 0) {
    console.log('No backup files found in the current directory.');
    process.exit(0);
  }

  // Lexicographical sorting works perfectly since format is YYYYMMDD_HHmmss
  backupFiles.sort().reverse();

  const latestBackup = backupFiles[0];
  console.log('Latest backup found:');
  console.log(`${latestBackup}\n`);

  // Call the existing restore command
  await restore(latestBackup);
}

module.exports = { restoreLatest };
