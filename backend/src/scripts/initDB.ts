import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Load DB config from .env with fallback defaults
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = parseInt(process.env.DB_PORT || '5432');
const DB_NAME = process.env.DB_NAME || 'todos';
const DB_TEST_NAME = process.env.DB_TEST_NAME || 'todos_test';

// List of databases to set up (main and test)
const databases = [DB_NAME, DB_TEST_NAME];

// Create a pool to the default postgres DB (needed to create others)
const bootstrapPool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: 'postgres', // connect to an always-existing DB
  password: DB_PASSWORD,
  port: DB_PORT,
});

/**
 * Creates a database if it doesn't already exist.
 */
async function ensureDatabaseExists(dbName: string) {
  const result = await bootstrapPool.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName]
  );
  if (result.rowCount === 0) {
    await bootstrapPool.query(`CREATE DATABASE ${dbName}`);
    console.log(`✅ Database "${dbName}" created.`);
  } else {
    console.log(`✅ Database "${dbName}" already exists.`);
  }
}

/**
 * Ensures that the duties table exists in a specific database.
 */
async function ensureTableExistsInDatabase(dbName: string) {
  const dbPool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: dbName,
    password: DB_PASSWORD,
    port: DB_PORT,
  });

  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS duties (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT FALSE
    );
  `);

  console.log(`✅ Table "duties" is ready in "${dbName}".`);
  await dbPool.end();
}

/**
 * Main function that initializes all required databases and tables.
 */
export async function initDB() {
  try {
    for (const dbName of databases) {
      await ensureDatabaseExists(dbName);
      await ensureTableExistsInDatabase(dbName);
    }
  } catch (error) {
    console.error('❌ Error during DB initialization:', error);
    process.exit(1);
  } finally {
    await bootstrapPool.end();
  }
}
