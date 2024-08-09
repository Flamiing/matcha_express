// src/app.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import corsOptions from './config/corsOptions';
// Routers
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import morgan from 'morgan';
import helmet from 'helmet';

// Initialize the Express app
const app = express();

// Apply middleware
app.use(cors(corsOptions));                         // Apply CORS middleware with configuration
app.use(helmet());                                  // Apply Helmet for security headers
app.use(morgan('combined'));                        // Log HTTP requests
app.use(express.json());                            // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true }));    // Middleware to parse URL-encoded bodies

// Define routes
app.get('/', (req: Request, res: Response) => {
    // res.send('Hello, TypeScript with Express!');
    res.status(200).json({ message: 'Hello, TypeScript with Express!' });
});

// Use routers for API endpoints
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Error Handling Middleware
// 404 Not Found
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: '404: Page not found' });
});

// 500 Internal Server Error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Export the app
export default app;
