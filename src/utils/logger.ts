import fs from 'fs';
import path from 'path';

/**
 * Utility to create a log file stream for the current date.
 * Ensures the logs directory exists and returns a write stream for logging.
 * @returns {fs.WriteStream} The write stream for the current date's log file.
 */
export const createLogFile = (): fs.WriteStream => {
	// Get the current date in YYYY-MM-DD format
	const getCurrentDate = (): string => {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
		const day = String(now.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	// Define the logs directory and ensure it exists
	const logsDir = path.join(path.resolve(), 'logs');
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true }); // Recursive to handle nested folders if needed
	}

	// Create the log file name and path
	const logFileName = `${getCurrentDate()}.log`;
	const logFilePath = path.join(logsDir, logFileName);

	// Return a write stream for the log file
	return fs.createWriteStream(logFilePath, { flags: 'a' });
};
