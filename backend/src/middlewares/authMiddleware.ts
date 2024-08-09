// // src/middlewares/authMiddleware.ts

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import { Pool } from 'pg'; // Import your database client
// import { JwtPayload } from 'jsonwebtoken';

// // Load environment variables from .env file
// dotenv.config();

// // Get the secret key from environment variables
// const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// // Initialize database client (replace with your actual database setup)
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// // Middleware to check for a valid JWT token
// const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//   // Extract token from Authorization header
//   const authHeader = req.headers.authorization;
  
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Authorization token is required' });
//   }

//   const token = authHeader.split(' ')[1]; // Extract the token part

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

//     // Check if the user exists in the database
//     const { rows } = await pool.query('SELECT id FROM users WHERE id = $1', [decoded.userId]);

//     if (rows.length === 0) {
//       return res.status(403).json({ message: 'User does not exist' });
//     }

//     // Attach decoded user information to the request object
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(403).json({ message: 'Invalid or expired token' });
//   }
// };

// export default authMiddleware;
