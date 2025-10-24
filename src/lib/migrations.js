import { query, getClient } from './db.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Migration System for Sunshare Database
 * આ system તમને database changes track કરવા અને manage કરવા માટે મદદ કરશે
 */

// Migration table to track applied migrations
const MIGRATION_TABLE = 'migrations';

/**
 * Initialize migration system - create migrations table
 */
export const initMigrations = async () => {
  try {
    // Check if environment variables are set
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      throw new Error(`
          ❌ Database environment variables not configured!

          Please create a .env.local file with:
          DB_HOST=localhost
          DB_PORT=5432
          DB_USER=postgres
          DB_PASSWORD=Admin@123
          DB_NAME=sunshare_db

          Copy from env.template and update with your actual PostgreSQL credentials.
      `);
    }
    await query(`
      CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE} (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT NOW(),
        checksum VARCHAR(64)
      )
    `);
    console.log('✅ Migration system initialized');
  } catch (error) {
    console.error('❌ Failed to initialize migration system:', error);
    throw error;
  }
};

/**
 * Get list of applied migrations
 */
export const getAppliedMigrations = async () => {
  try {
    const result = await query(`SELECT filename FROM ${MIGRATION_TABLE} ORDER BY applied_at`);
    return result.rows.map(row => row.filename);
  } catch (error) {
    console.error('❌ Failed to get applied migrations:', error);
    throw error;
  }
};

/**
 * Get list of migration files from migrations directory
 */
export const getMigrationFiles = () => {
  const migrationsDir = path.join(process.cwd(), 'src', 'migrations');

  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
    return [];
  }

  return fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
};

/**
 * Calculate checksum of migration file
 */
export const calculateChecksum = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
};

/**
 * Apply a single migration
 */
export const applyMigration = async (filename) => {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Check if migration already applied
    const existing = await client.query(
      `SELECT id FROM ${MIGRATION_TABLE} WHERE filename = $1`,
      [filename]
    );

    if (existing.rows.length > 0) {
      console.log(`⏭️  Migration ${filename} already applied, skipping`);
      return;
    }

    // Read migration file
    const migrationPath = path.join(process.cwd(), 'src', 'migrations', filename);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    const checksum = calculateChecksum(migrationPath);

    // Execute migration SQL
    await client.query(migrationSQL);

    // Record migration as applied
    await client.query(
      `INSERT INTO ${MIGRATION_TABLE} (filename, checksum) VALUES ($1, $2)`,
      [filename, checksum]
    );

    await client.query('COMMIT');
    console.log(`✅ Applied migration: ${filename}`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Failed to apply migration ${filename}:`, error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Rollback a single migration
 */
export const rollbackMigration = async (filename) => {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Check if migration was applied
    const existing = await client.query(
      `SELECT id FROM ${MIGRATION_TABLE} WHERE filename = $1`,
      [filename]
    );

    if (existing.rows.length === 0) {
      console.log(`⏭️  Migration ${filename} not found in applied migrations`);
      return;
    }

    // Read rollback SQL (if exists)
    const rollbackPath = path.join(process.cwd(), 'src', 'migrations', filename.replace('.sql', '.rollback.sql'));

    if (fs.existsSync(rollbackPath)) {
      const rollbackSQL = fs.readFileSync(rollbackPath, 'utf8');
      await client.query(rollbackSQL);
    } else {
      console.log(`⚠️  No rollback file found for ${filename}`);
    }

    // Remove migration record
    await client.query(
      `DELETE FROM ${MIGRATION_TABLE} WHERE filename = $1`,
      [filename]
    );

    await client.query('COMMIT');
    console.log(`✅ Rolled back migration: ${filename}`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Failed to rollback migration ${filename}:`, error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Run all pending migrations
 */
export const runMigrations = async () => {
  try {
    await initMigrations();

    const appliedMigrations = await getAppliedMigrations();
    const migrationFiles = getMigrationFiles();

    const pendingMigrations = migrationFiles.filter(file => !appliedMigrations.includes(file));

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    console.log(`🔄 Running ${pendingMigrations.length} pending migrations...`);

    for (const migration of pendingMigrations) {
      await applyMigration(migration);
    }

    console.log('✅ All migrations completed successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

/**
 * Create a new migration file
 */
export const createMigration = async (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `${timestamp}_${name}.sql`;
  const filepath = path.join(process.cwd(), 'src', 'migrations', filename);

  const template = `-- Migration: ${name}
    -- Created: ${new Date().toISOString()}
    -- Description: Add your migration description here

    -- Add your SQL statements here
    -- Example:
    -- ALTER TABLE users ADD COLUMN new_field VARCHAR(255);
    -- CREATE INDEX idx_users_new_field ON users(new_field);

    -- Success message
    SELECT 'Migration ${name} completed successfully! ✅' AS message;
`;

  fs.writeFileSync(filepath, template);
  console.log(`✅ Created migration: ${filename}`);
  console.log(`📁 Location: ${filepath}`);

  return filename;
};

/**
 * Show migration status
 */
export const showStatus = async () => {
  try {
    await initMigrations();

    const appliedMigrations = await getAppliedMigrations();
    const migrationFiles = getMigrationFiles();

    console.log('\n📊 Migration Status:');
    console.log('==================');

    console.log('\n✅ Applied Migrations:');
    appliedMigrations.forEach(migration => {
      console.log(`  - ${migration}`);
    });

    console.log('\n⏳ Pending Migrations:');
    const pendingMigrations = migrationFiles.filter(file => !appliedMigrations.includes(file));
    if (pendingMigrations.length === 0) {
      console.log('  No pending migrations');
    } else {
      pendingMigrations.forEach(migration => {
        console.log(`  - ${migration}`);
      });
    }

    console.log(`\n📈 Total: ${appliedMigrations.length} applied, ${pendingMigrations.length} pending`);

  } catch (error) {
    console.error('❌ Failed to show migration status:', error);
    throw error;
  }
};

/**
 * Reset all migrations (DANGEROUS!)
 */
export const resetMigrations = async () => {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Get all applied migrations
    const appliedMigrations = await getAppliedMigrations();

    // Rollback in reverse order
    for (let i = appliedMigrations.length - 1; i >= 0; i--) {
      await rollbackMigration(appliedMigrations[i]);
    }

    await client.query('COMMIT');
    console.log('✅ All migrations reset successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to reset migrations:', error);
    throw error;
  } finally {
    client.release();
  }
};
