import React from 'react';
import { HashRouter } from 'react-router-dom';
import {
	render,
	screen,
	cleanup,
	fireEvent,
	act,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import Register from './Register';

afterEach(() => cleanup());

describe('Email field', () => {
	test('Error icon are displayed when wrong email format / info message visible if invalid format when focused', () => {
		render(<Register />, { wrapper: HashRouter });

		expect(screen.queryByTestId('wrong-register-email')).toBeNull();
		expect(screen.queryByTestId('correct-register-email')).toBeNull();
		expect(screen.queryByTestId('email-info')).toHaveClass('offscreen');

		fireEvent.change(screen.queryByLabelText('Email'), {
			target: { value: 'invalidemail123' },
		});

		expect(screen.getByTestId('wrong-register-email')).not.toBeNull();
		expect(screen.queryByTestId('correct-register-email')).toBeNull();
		expect(screen.queryByTestId('email-info')).toHaveClass('instructions');

		act(() => screen.getByLabelText('Email').blur());
		expect(screen.getByTestId('email-info')).toHaveClass('offscreen');
	});

	test('Info message not visible, success icon visible on valid email', () => {
		render(<Register />, { wrapper: HashRouter });

		expect(screen.queryByTestId('correct-register-email')).toBeNull();
		expect(screen.queryByTestId('wrong-register-email')).toBeNull();
		expect(screen.queryByTestId('email-info')).toHaveClass('offscreen');

		fireEvent.change(screen.queryByLabelText('Email'), {
			target: { value: 'validemail@gmail.com' },
		});

		expect(screen.getByTestId('correct-register-email')).not.toBeNull();
		expect(screen.queryByTestId('wrong-register-email')).toBeNull();
		expect(screen.queryByTestId('email-info')).toHaveClass('offscreen');
	});
});

describe('Password field', () => {
	test('Info message is displayed when focus on password input', () => {
		render(<Register />, { wrapper: HashRouter });

		expect(screen.queryByTestId('password-info')).toHaveClass('offscreen');

		act(() => {
			screen.queryByLabelText('Password').focus();
		});

		expect(screen.queryByTestId('password-info')).toHaveClass('instructions');
	});

	test('Error icon is displayed / info message visible if invalid format when focused', () => {
		render(<Register />, { wrapper: HashRouter });

		expect(screen.queryByTestId('wrong-register-password')).toBeNull();
		expect(screen.queryByTestId('correct-register-password')).toBeNull();
		expect(screen.queryByTestId('password-info')).toHaveClass('offscreen');

		act(() => screen.getByLabelText('Password').focus());

		fireEvent.change(screen.getByLabelText('Password'), {
			target: { value: 'wrongpassword' },
		});

		expect(screen.getByTestId('password-info')).toHaveClass('instructions');
		expect(screen.queryByTestId('correct-register-password')).toBeNull();
		expect(screen.getByTestId('wrong-register-password')).not.toBeNull();

		act(() => screen.getByLabelText('Password').blur());
		expect(screen.getByTestId('password-info')).toHaveClass('offscreen');
	});

	test('Success icon displayed / info message not visible on valid format', () => {
		render(<Register />, { wrapper: HashRouter });

		expect(screen.queryByTestId('wrong-register-password')).toBeNull();
		expect(screen.queryByTestId('correct-register-password')).toBeNull();
		expect(screen.queryByTestId('password-info')).toHaveClass('offscreen');

		act(() => screen.getByLabelText('Password').focus());

		fireEvent.change(screen.getByLabelText('Password'), {
			target: { value: 'CorrectPassword123' },
		});

		expect(screen.getByTestId('password-info')).toHaveClass('offscreen');
		expect(screen.getByTestId('correct-register-password')).not.toBeNull();
		expect(screen.queryByTestId('wrong-register-password')).toBeNull();
	});
});

describe('Confirm Password field', () => {
	test('Error icon displayed / info message visible on unmatched password when focused', () => {
		render(<Register />, { wrapper: HashRouter });

		expect(screen.queryByTestId('wrong-register-confirm-password')).toBeNull();
		expect(
			screen.queryByTestId('correct-register-confirm-password')
		).toBeNull();
		expect(screen.queryByTestId('confirm-password-info')).toHaveClass(
			'offscreen'
		);

		fireEvent.change(screen.getByLabelText('Password'), {
			target: { value: 'CorrectPassword123' },
		});

		act(() => screen.getByLabelText('Confirm Password').focus());

		fireEvent.change(screen.getByLabelText('Confirm Password'), {
			target: { value: 'NoMatchPassword' },
		});

		expect(screen.getByTestId('confirm-password-info')).toHaveClass(
			'instructions'
		);
		expect(
			screen.queryByTestId('correct-register-confirm-password')
		).toBeNull();
		expect(
			screen.getByTestId('wrong-register-confirm-password')
		).not.toBeNull();

		act(() => screen.getByLabelText('Confirm Password').blur());
		expect(screen.queryByTestId('confirm-password-info')).toHaveClass(
			'offscreen'
		);
	});

	test('Success icon displayed / info message not visible on password match', () => {
		render(<Register />, { wrapper: HashRouter });

		expect(screen.queryByTestId('wrong-register-confirm-password')).toBeNull();
		expect(
			screen.queryByTestId('correct-register-confirm-password')
		).toBeNull();
		expect(screen.queryByTestId('confirm-password-info')).toHaveClass(
			'offscreen'
		);

		fireEvent.change(screen.getByLabelText('Password'), {
			target: { value: 'CorrectPassword123' },
		});

		act(() => screen.getByLabelText('Confirm Password').focus());

		fireEvent.change(screen.getByLabelText('Confirm Password'), {
			target: { value: 'CorrectPassword123' },
		});

		expect(screen.getByTestId('confirm-password-info')).toHaveClass(
			'offscreen'
		);
		expect(
			screen.getByTestId('correct-register-confirm-password')
		).not.toBeNull();
		expect(screen.queryByTestId('wrong-register-confirm-password')).toBeNull();
	});
});

describe('Submit button', () => {
	test('Submit button is disabled on empty fields', () => {
		render(<Register />, { wrapper: HashRouter });

		expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
	});

	test('Submit button is enabled on valid fields / disabled if invalid fields', () => {
		render(<Register />, { wrapper: HashRouter });

		fireEvent.change(screen.queryByLabelText('Email'), {
			target: { value: 'validemail@gmail.com' },
		});

		fireEvent.change(screen.queryByLabelText('Password'), {
			target: { value: 'Password1' },
		});

		fireEvent.change(screen.queryByLabelText('Confirm Password'), {
			target: { value: 'Password123' },
		});

		expect(screen.getByRole('button', { name: /submit/i })).not.toBeEnabled();

		fireEvent.change(screen.queryByLabelText('Confirm Password'), {
			target: { value: 'Password1' },
		});

		expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
	});
});
