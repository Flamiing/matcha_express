import { ServiceError } from './customErrors';

export const serviceErrorHandler = (err: any) => {
    console.log(err);
    if (err instanceof ServiceError) {
        return {
            status: err.status,
            message: err.message,
        };
    } else {
        return {
            status: 500,
            message: 'An unexpected error occurred.',
        };
    }
};
