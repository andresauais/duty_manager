import app from './app';
import { initDB } from './scripts/initDB';

const port = 3001;

async function start() {
  await initDB(); // ensure DB and tables exist

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Startup error:', err);
  process.exit(1);
});
