import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import Register from './Register';

test('ROUTING: link to "/login"', () => {
	render(
		<MemoryRouter initialEntries={['/register']}>
			<Routes>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<p>LOGIN</p>} />
			</Routes>
		</MemoryRouter>
	);

	expect(screen.queryByText('LOGIN')).not.toBeInTheDocument();

	fireEvent.click(screen.getByText('Go to login Page'));

	expect(screen.getByText('LOGIN')).toBeInTheDocument();
});

test('EMAIL: show error icon if invalid -- show info message if invalid on focus', () => {
	render(<Register />, { wrapper: MemoryRouter });

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

test('EMAIL: hide info message -- show success icon if valid', () => {
	render(<Register />, { wrapper: MemoryRouter });

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

test('PASSWORD: show info message on focus', () => {
	render(<Register />, { wrapper: MemoryRouter });

	expect(screen.queryByTestId('password-info')).toHaveClass('offscreen');

	act(() => {
		screen.queryByLabelText('Password').focus();
	});

	expect(screen.queryByTestId('password-info')).toHaveClass('instructions');
});

test('PASSWORD: show error icon -- show info message if invalid on focus', () => {
	render(<Register />, { wrapper: MemoryRouter });

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

test('PASSWORD: show success icon -- hide info message if valid', () => {
	render(<Register />, { wrapper: MemoryRouter });

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

test('CONFIRM PASSWORD: show error icon -- show info message if unmatched password on focus', () => {
	render(<Register />, { wrapper: MemoryRouter });

	expect(screen.queryByTestId('wrong-register-confirm-password')).toBeNull();
	expect(screen.queryByTestId('correct-register-confirm-password')).toBeNull();
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
	expect(screen.queryByTestId('correct-register-confirm-password')).toBeNull();
	expect(screen.getByTestId('wrong-register-confirm-password')).not.toBeNull();

	act(() => screen.getByLabelText('Confirm Password').blur());
	expect(screen.queryByTestId('confirm-password-info')).toHaveClass(
		'offscreen'
	);
});

test('CONFIRM PASSWORD: show success icon -- hide info message if passwords match', () => {
	render(<Register />, { wrapper: MemoryRouter });

	expect(screen.queryByTestId('wrong-register-confirm-password')).toBeNull();
	expect(screen.queryByTestId('correct-register-confirm-password')).toBeNull();
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

	expect(screen.getByTestId('confirm-password-info')).toHaveClass('offscreen');
	expect(
		screen.getByTestId('correct-register-confirm-password')
	).not.toBeNull();
	expect(screen.queryByTestId('wrong-register-confirm-password')).toBeNull();
});

test('SUBMIT BUTTON: disabled if empty fields', () => {
	render(<Register />, { wrapper: MemoryRouter });

	expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
});

test('SUBMIT BUTTON: enabled oif valid fields -- disabled if invalid fields', () => {
	render(<Register />, { wrapper: MemoryRouter });

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
