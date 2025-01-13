import { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { validationResult } from 'express-validator';

// Get all users
export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await User.find().select('password'); // Exclude password
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

// Get user by ID
export const getUserById = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const user = await User.findById(req.params.id).select('-password');
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return; // Ensure no further execution
		}
		res.status(200).json(user);
	} catch (error) {
		next(error); // Pass the error to the global error handler
	}
};

// Create new user
export const createUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	try {
		if (!errors.isEmpty()) {
			// Access the first validation error
			// console.log(errors.array()[0]);
			res.status(400).jsonp({
				message: 'Invalid email address. Please try again.',
				errors: errors.array(),
			});
			return;
		}
		const { name, email, password } = req.body;
		const newUser = new User({ name, email, password });
		const savedUser = await newUser.save();
		res.status(201).json({
			message: 'User created successfully',
			user: {
				id: savedUser._id,
				name: savedUser.name,
				email: savedUser.email,
			}, // Exclude password in response
		});
	} catch (error) {
		next(error);
	}
};

// Update user
export const updateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		}).select('-password');
		if (!updatedUser) {
			res.status(404).json({ message: 'User not found' });
			return;
		}
	} catch (error) {
		next(error);
	}
};

// Delete user
export const deleteUser = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.params.id);
		if (!deletedUser) {
			res.status(404).json({ message: 'User not found' });
			return;
		}
		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		next(error);
	}
};

export const loginUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			// Access the first validation error
			// console.log(errors.array()[0]);
			res.status(400).jsonp({
				message: 'Invalid email address. Please try again.',
				errors: errors.array(),
			});
			return;
		}
		const { email, password } = req.body;

		// Find the user by email
		const user = await User.findOne({ email }).select('+password'); // Explicitly select password
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		}

		// Compare the password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}

		res.status(200).json({
			message: 'Login successful',
			user: { id: user._id, email: user.email },
		});
	} catch (error) {
		next(error);
	}
};
