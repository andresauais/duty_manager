import { Pool } from 'pg';

export const testPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todos_test',
  password: 'password',
  port: 5432,
});
