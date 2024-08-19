// src/types/express.d.ts

import { User } from '../models/UserModel';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
