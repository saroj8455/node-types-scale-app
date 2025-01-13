import { add, subtract } from '../src/index';

describe('Math functions', () => {
	test('adds two numbers', () => {
		expect(add(2, 3)).toBe(5);
	});

	test('subtracts two numbers', () => {
		expect(subtract(5, 3)).toBe(2);
	});
});
