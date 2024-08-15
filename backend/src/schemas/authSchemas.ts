// src/schemas/authSchemas.ts

import Joi from 'joi';

// Base schema for email validation
export const baseEmailSchema = Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address.',
    'any.required': 'Email is required.',
});

// Base schema for password validation
// (at least 8 characters, 1 uppercase, 1 number, 1 special character)
export const basePasswordSchema = Joi.string()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
    .required()
    .messages({
        'string.pattern.base':
            'Password must contain at least one uppercase letter, one number, and one special character.',
        'any.required': 'Password is required.',
    });

// New password schema
export const newPasswordSchema = Joi.object({
    password: basePasswordSchema,
});

// Email and password schema
export const emailPasswordSchema = Joi.object({
    email: baseEmailSchema,
    password: basePasswordSchema,
});

// Email schema
export const emailSchema = Joi.object({
    email: baseEmailSchema,
});

// Code validation schema
export const codeValidationSchema = Joi.object({
    code: Joi.string().required().messages({
        'any.required': 'Verification code is required.',
    }),
});

// Token validation schema
export const tokenValidationSchema = Joi.object({
    token: Joi.string().required().messages({
        'any.required': 'Token is required.',
    }),
});
