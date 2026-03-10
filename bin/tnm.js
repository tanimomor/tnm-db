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
  .action(() => {
    backup();
  });

program
  .command('restore <file>')
  .description('Restore a PostgreSQL database from a dump file using pg_restore')
  .action((file) => {
    restore(file);
  });

program
  .command('restore-latest')
  .description('Restore the latest PostgreSQL database dump file in the current directory')
  .action(() => {
    restoreLatest();
  });

program.parse(process.argv);
