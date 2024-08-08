import express, { Request, Response } from 'express';
import initDb from './script/initDb';

const app = express();
const port = 3000;

const startServer = async () => {
  try {
    await initDb();
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); 

    // Use routes
    // app.use('/api/users', userRoutes);
    // app.use('/api/auth', authRoutes);
    // app.use('/api/profile', profileRoutes);

    // Root route
    app.get('/', (req: Request, res: Response) => {
      res.send('Hello, TypeScript with Express!');
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to initialize the database:', err);
    process.exit(1);
  }
};

startServer();
