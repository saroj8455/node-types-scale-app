import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const status = err.status || 500;
	const isDev = process.env.NODE_ENV === 'development';
	res.status(status).json({
		error: {
			message: err.message || 'Internal Server Error',
			...(isDev && { stack: err.stack }), // Include stack trace only in development
		},
	});
};
