import e from 'express';
import Joi from 'joi';

// Base schema for email validation
const baseEmailSchema = Joi.string().email().required().messages({
	'string.email': 'Please enter a valid email address.',
	'any.required': 'Email is required.',
});

// New password schema
const newPasswordSchema = Joi.object({
	password: Joi.string()
		.pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
		.required()
		.messages({
			'string.pattern.base':
				'Password must contain at least one uppercase letter, one number, and one special character.',
			'any.required': 'Password is required.',
		}),
});

// Updated email password schema
const emailPasswordSchema = Joi.object({
	email: baseEmailSchema,
	password: newPasswordSchema,
});

const emailSchema = Joi.object({
	email: baseEmailSchema,
});

const codeValidationSchema = Joi.object({
	code: Joi.string().required().messages({
		'any.required': 'Verification code is required.',
	}),
});

const tokenValidationSchema = Joi.object({
	token: Joi.string().required().messages({
		'any.required': 'Token is required.',
	}),
});

export {
	emailPasswordSchema,
	emailSchema,
	newPasswordSchema,
	codeValidationSchema,
	tokenValidationSchema,
};
