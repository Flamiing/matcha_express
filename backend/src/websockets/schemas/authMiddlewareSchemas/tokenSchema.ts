// src/websockets/schemas/authMiddlewareSchemas/tokenSchema.ts

import { z } from 'zod';

// Regex pattern for validating JWTs
// - JWTs are composed of three parts separated by dots (.)
// - Each part should contain only base64url characters: A-Z, a-z, 0-9, -, _
// - This pattern ensures that the token follows the basic JWT structure
const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export const tokenSchema = z
    .string({
        // Custom error message if the token is missing
        required_error: 'Token is required',
        // Custom error message if the token is not a string
        invalid_type_error: 'Token must be a string',
    })
    // Validate the token format using the regex pattern
    .regex(jwtPattern, 'Invalid JWT format');
