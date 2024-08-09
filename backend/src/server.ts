// src/server.ts

import http from 'http';
import app from './app';
import initDb from './script/initDb';

const port = 8000;

const startServer = async () => {
  try {
    await initDb();

    const server = http.createServer(app);

    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to initialize the database:', err);
    process.exit(1);
  }
};

startServer();
