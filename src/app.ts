import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { createLogFile } from './utils/logger';

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later.',
});

const app = express();

// Enable cookie parser
app.use(cookieParser());
// Enable CSRF protection
const csrfProtection = csrf({ cookie: true });

// Use the utility to create a log file stream
const accessLogStream = createLogFile();

// Middleware
app.use(helmet());
app.use(csrfProtection);
app.use(express.json());
app.use(limiter);
app.use(
	morgan('combined', {
		stream: accessLogStream, // Write logs to file
	})
); // Log all HTTP requests

// Route to send the CSRF token
app.get('/csrf-token', (req, res) => {
	res.json({ csrfToken: req.csrfToken() });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
	res.status(200).json({
		status: 'UP',
		message: 'Service is healthy',
		timestamp: new Date().toISOString(),
	});
});

// Routes
app.use('/api/v1/users', userRoutes);

// Global error handler
app.use(errorHandler);

export default app;
