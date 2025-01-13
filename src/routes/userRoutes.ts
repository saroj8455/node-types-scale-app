import { Router } from 'express';
import {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	loginUser,
} from '../controllers/userController';
import { body } from 'express-validator';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post(
	'/',
	[
		body('email').isEmail().withMessage('Invalid email').trim().escape(), // Sanitize input,
		body('password')
			.isLength({ min: 6 })
			.withMessage('Password must be at least 6 characters'),
	],
	createUser
);
router.post(
	'/login',
	body('email').isEmail().withMessage('Invalid email'),
	loginUser
);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
