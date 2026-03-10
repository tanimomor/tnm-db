# tnm-db

A Node.js CLI tool to backup and restore PostgreSQL databases and upload files.

## Installation

1. Clone or download this project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Link the package globally to use the `tnm` command:
   ```bash
   npm link
   ```

## Environment Setup

1. Copy the example `.env` file to your working directory:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your database credentials. Make sure `DATABASE_CLIENT` is set to `postgres`.

You can also specify the directory to compress or extract with the `FILES_PATH` option (defaults to `./public/uploads`):
```env
FILES_PATH=./public/uploads
```

## Usage

### Backup

Create a backup folder with your database dump under `private/backups/`. The folder is named using `backup_<dbname>_<YYYY-MM-DD>_<HH-mm-ss>`.

```bash
tnm backup
```

### Backup Directory with Database Dump
You can optionally compress the current files uploads path along with the SQL database backup. The zip will be inside `private/backups/backup_...`.

```bash
tnm backup --with-files
```

### Restore

Restore a database from a backup directory. Pass the directory name.

```bash
tnm restore backup_strapi_2026-03-11_04-32-15
```

If the backup contains zipped files (e.g. from `--with-files` on backup), you can restore them via:

```bash
tnm restore backup_strapi_2026-03-11_04-32-15 --with-files
```

### Restore Latest

Restore latest backup folder database automatically under `private/backups/`:

```bash
tnm restore-latest
```

To restore the latest backup folder along with its zipped uploaded files, use:

```bash
tnm restore-latest --with-files
```
