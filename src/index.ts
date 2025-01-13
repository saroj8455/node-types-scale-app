import app from './app';
import connectToDatabase from './databse/mongoose';

const port = process.env.PORT || 3000;

// Connect to MongoDB
connectToDatabase().then(() => {
	app.listen(port, () => {
		console.log(`Server is running at http://localhost:${port}`);
	});
});

// export const add = (a: number, b: number): number => a + b;
// export const subtract = (a: number, b: number): number => a - b;
