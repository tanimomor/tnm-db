# tnm-db

A Node.js CLI tool to backup and restore PostgreSQL databases.

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

## Usage

### Backup

Create a backup of your database. The backup will be saved in the current directory with a timestamped filename (e.g., `backup_YYYYMMDD_HHmmss.dump`).

```bash
tnm backup
```

### Restore

Restore a database from a dump file. Pass the filename as an argument.

```bash
tnm restore backup_20260311_031000.dump
```
