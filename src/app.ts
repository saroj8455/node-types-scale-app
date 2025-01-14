import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { createLogFile } from './utils/logger';
import { generateToken, validateToken } from './token';

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later.',
});

// Configure cors
// Define CORS options based on the environment
// Define CORS options based on the environment
const isProduction = process.env.NODE_ENV === 'production';
const corsOptions = isProduction
	? {
			origin: ['https://yourdomain.com'], // Restrict to specific domains in production
			methods: ['GET', 'POST', 'PUT', 'DELETE'], // Restrict methods in production
	  }
	: {}; // Allow all origins and methods in development

const app = express();

// Enable cookie parser
app.use(cookieParser());
// Enable CSRF protection
const csrfProtection = csrf({ cookie: true });
// Use the utility to create a log file stream
const accessLogStream = createLogFile();
// Middleware
app.use(helmet());
app.use(cors(corsOptions));
// app.use(csrfProtection);
app.use(express.json());

// Apply CORS middleware
if (corsOptions) {
	app.use(cors(corsOptions)); // Restrictive CORS in production
} else {
	app.use(cors()); // Open CORS in development
}

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

// Generate a token
app.post('/generate-token', (req: Request, res: Response) => {
	const { userId, username } = req.body;
	if (!userId || !username) {
		res.status(400).json({ error: 'userId and username are required' });
		return;
	}

	const token = generateToken({ userId, username }, '1h'); // Expires in 1 hour
	res.status(200).json({ token });
});

// Example: Validate a token
app.post('/validate-token', (req: Request, res: Response) => {
	const { token } = req.body;

	if (!token) {
		res.status(400).json({ error: 'Token is required' });
		return;
	}

	try {
		const decoded = validateToken(token);
		res.status(200).json({ valid: true, data: decoded });
	} catch (error) {
		// Safely handle and log the error
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred';
		res.status(401).json({ valid: false, error: errorMessage });
	}
});

// Routes
app.use('/api/v1/users', userRoutes);

// Global error handler
app.use(errorHandler);

export default app;
