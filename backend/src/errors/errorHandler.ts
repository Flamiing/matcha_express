import { ServiceError } from './customErrors';
import { Response } from 'express';

export const serviceErrorHandler = (err: any, res: Response) => {
    console.log(err);
    if (err instanceof ServiceError) {
        return res.status(err.status).json({ message: err.message });
    } else {
        return res.status(500).json({ message: err.message });
    }
};
