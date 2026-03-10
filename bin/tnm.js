#!/usr/bin/env node

const { program } = require('commander');
const { backup } = require('../src/commands/backup');
const { restore } = require('../src/commands/restore');
const { restoreLatest } = require('../src/commands/restoreLatest');
const { loadEnv } = require('../src/utils/env');

// Load and validate environment variables before running any command
loadEnv();

program
  .name('tnm')
  .description('PostgreSQL Backup and Restore CLI')
  .version('1.0.0');

program
  .command('backup')
  .description('Backup the PostgreSQL database using pg_dump')
  .option('--with-files', 'Backup uploads directory along with the database dump')
  .action((options) => {
    backup({ withFiles: options.withFiles });
  });

program
  .command('restore <folder>')
  .description('Restore a PostgreSQL database and files from a backup folder')
  .action((folder) => {
    restore(folder);
  });

program
  .command('restore-latest')
  .description('Restore the latest PostgreSQL database and files from the newest backup folder in the current directory')
  .action(() => {
    restoreLatest();
  });

program.parse(process.argv);
