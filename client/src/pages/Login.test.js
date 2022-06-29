import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

import React from 'react';
import { TestContext } from '../utils/testsUtils';
import Login from './Login';
import LoadingProvider from '../context/LoadingProvider';
import { AuthProvider } from '../context/AuthProvider';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import axios from '../api/axios';
import * as useAuth_module from '../hooks/useAuth';

const axios_post = jest.fn();
axios.post = axios_post;
const useAuth = jest.spyOn(useAuth_module, 'default');

const TestContext = ({ path, children }) => {
	return (
		<AuthProvider>
			<LoadingProvider>
				<MemoryRouter initialEntries={[path]}>
					<Routes>{children}</Routes>
				</MemoryRouter>
			</LoadingProvider>
		</AuthProvider>
	);
};

test('ROUTING: redirect to "/" if auth.accessToken', () => {
	useAuth.mockReturnValueOnce({
		auth: { accessToken: 'user123' },
	});

	render(
		<TestContext path="/login">
			<Route path="/" element={<p>HOME</p>} />
			<Route path="/login" element={<Login />} />
		</TestContext>
	);

	expect(screen.getByText('HOME')).toBeInTheDocument();
	expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
	useAuth.mockRestore();
});

test('ROUTING: not redirect if !auth.accessToken', async () => {
	render(
		<TestContext path="/login">
			<Route path="/" element={<p>HOME</p>} />
			<Route path="/login" element={<Login />} />
		</TestContext>
	);

	expect(screen.getByTestId('login-form')).toBeInTheDocument();
	expect(screen.queryByText('HOME')).not.toBeInTheDocument();
});

test('ROUTING: Link to "/register"', () => {
	render(
		<TestContext path="/login">
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<p>REGISTER</p>} />
		</TestContext>
	);

	fireEvent.click(screen.getByText('Sign Up'));

	expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
	expect(screen.getByText('REGISTER')).toBeInTheDocument();
});

test('SUBMIT: Correct data sent to axios', async () => {
	render(
		<TestContext path="/login">
			<Route path="/login" element={<Login />} />
		</TestContext>
	);

	fireEvent.change(screen.getByLabelText('Email'), {
		target: { value: 'unexisting-user' },
	});

	fireEvent.change(screen.getByLabelText('Password'), {
		target: { value: 'test' },
	});

	fireEvent.submit(screen.getByTestId('login-form'));

	await waitFor(() =>
		expect(axios_post).toHaveBeenCalledWith(
			'/auth',
			{ email: 'unexisting-user', password: 'test' },
			{
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			}
		)
	);
});

test('SUBMIT: redirect to home on resolved response', async () => {
	axios_post.mockResolvedValueOnce({ data: { accessToken: 'user123' } });

	render(
		<TestContext path="/login">
			<Route path="/login" element={<Login />} />
			<Route path="/" element={<p>HOME</p>} />
		</TestContext>
	);

	fireEvent.change(screen.getByLabelText('Email'), {
		target: { value: 'unexisting-user' },
	});

	fireEvent.change(screen.getByLabelText('Password'), {
		target: { value: 'test' },
	});

	fireEvent.submit(screen.getByTestId('login-form'));

	expect(await screen.findByText('HOME')).toBeInTheDocument();
});

test('SUBMIT: not triggered if empty fields', async () => {
	render(
		<TestContext>
			<Route path="/" element={<Login />} />
		</TestContext>
	);

	fireEvent.change(screen.getByLabelText('Email'), {
		target: { value: '' },
	});

	fireEvent.change(screen.getByLabelText('Password'), {
		target: { value: '' },
	});

	fireEvent.submit(screen.getByTestId('login-form'));
	expect(axios_post).not.toHaveBeenCalled();
});
