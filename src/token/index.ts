import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'your_default_secret';

/**
 * Generate a JWT token
 * @param payload - The data to include in the token
 * @param expiresIn - Token expiration time (e.g., "1h", "7d")
 * @returns {string} The generated token
 */
export const generateToken = (
	payload: object,
	expiresIn: string = '1h'
): string => {
	return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

/**
 * Validate and decode a JWT token
 * @param token - The JWT token to validate
 * @returns {object | string} The decoded payload if valid
 * @throws {Error} If the token is invalid or expired
 */
export const validateToken = (token: string): object | string => {
	try {
		return jwt.verify(token, SECRET_KEY);
	} catch (err) {
		throw new Error('Invalid or expired token');
	}
};
