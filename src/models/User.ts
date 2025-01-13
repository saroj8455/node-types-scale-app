import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';
interface IUser extends Document {
	name: string;
	email: string;
	password: string;
}

const UserSchema: Schema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	// password: { type: String, required: true, select: false },
	password: { type: String, required: true },
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
	// Check if the password field is modified
	if (!this.isModified('password')) {
		return next(); // Skip hashing if the password is not modified
	}

	try {
		const salt = await bcrypt.genSalt(10); // Generate salt
		this.password = await bcrypt.hash(this.password as string, salt); // Hash the password
		next(); // Continue the save process
	} catch (error) {
		if (error instanceof Error) {
			next(error as CallbackError);
		} else {
			next(
				new Error(
					'Unknown error occurred during password hashing'
				) as CallbackError
			);
		}
	}
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
