// src/app.ts

import express, { Request, Response, NextFunction } from 'express';
// Middleware
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import authMiddleware from './middlewares/authMiddleware';
import limiter from './config/rateLimitConfigure';
// Import options
import corsOptions from './config/corsOptions';
// Routers
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';

// Initialize the Express app
const app = express();

// Apply middleware
app.use(limiter); // Apply rate limiting middleware
app.use(cors(corsOptions)); // Apply CORS middleware with configuration
app.use(helmet()); // Apply Helmet for security headers
app.use(morgan('combined')); // Log HTTP requests
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies

// (landing page we will handle later)
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello, TypeScript with Express!' });
});

// Use routers for API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/test', userRoutes); // REMOVE ME
app.use('/api/profile', authMiddleware, profileRoutes);

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
