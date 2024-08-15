import rateLimit from 'express-rate-limit';
import { parseDuration } from '../utils/dateParsing';
import dotenv from 'dotenv';

dotenv.config();

const limiter = rateLimit({
    // 1 hour period by IP
    windowMs: parseDuration(process.env.RATE_LIMIT_WINDOW || '1h'),
    // limit each IP to 1000 requests per windowMs
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    message: 'Too many requests from this IP, please try again later.',
    headers: true,
});

export default limiter;
