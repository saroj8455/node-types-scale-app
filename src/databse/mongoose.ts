import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connectToDatabase = async (): Promise<void> => {
	try {
		const mongoURI =
			process.env.MONGO_URI || 'mongodb://localhost:27017/my_database';
		await mongoose.connect(mongoURI, {
			maxPoolSize: 10,
		});
		console.log(
			'Connected to MongoDB successfully: ',
			mongoose.connection.host
		);
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		process.exit(1); // Exit the process with failure
	}
};

export default connectToDatabase;
