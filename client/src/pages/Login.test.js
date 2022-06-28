import {
	render,
	screen,
	cleanup,
	fireEvent,
	waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

import React from 'react';
import Login from './Login';
import LoadingProvider from '../context/LoadingProvider';
import { AuthProvider } from '../context/AuthProvider';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import axios from '../api/axios';
import * as useAuth_module from '../hooks/useAuth';

const axios_post = jest.fn();
axios.post = axios_post;
const useAuth = jest.spyOn(useAuth_module, 'default');

afterEach(cleanup);

describe('Routing', () => {
	test('Login automatically redirects to "/" if auth.accessToken present', () => {
		useAuth.mockReturnValueOnce({
			auth: { accessToken: 'user123' },
		});

		render(
			<AuthProvider>
				<LoadingProvider>
					<MemoryRouter initialEntries={['/login']}>
						<Routes>
							<Route path="/" element={<p>HOME</p>} />
							<Route path="/login" element={<Login />} />
						</Routes>
					</MemoryRouter>
				</LoadingProvider>
			</AuthProvider>
		);

		expect(screen.getByText('HOME')).toBeInTheDocument();
		expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
		useAuth.mockRestore();
	});

	test('Login does not redirect if auth.accessToken undefined', async () => {
		render(
			<AuthProvider>
				<LoadingProvider>
					<MemoryRouter initialEntries={['/login']}>
						<Routes>
							<Route path="/" element={<p>HOME</p>} />
							<Route path="/login" element={<Login />} />
						</Routes>
					</MemoryRouter>
				</LoadingProvider>
			</AuthProvider>
		);

		expect(screen.getByTestId('login-form')).toBeInTheDocument();
		expect(screen.queryByText('HOME')).not.toBeInTheDocument();
	});

	test('Link to "/register" redirects properly', () => {
		render(
			<AuthProvider>
				<LoadingProvider>
					<MemoryRouter initialEntries={['/login']}>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<p>REGISTER</p>} />
						</Routes>
					</MemoryRouter>
				</LoadingProvider>
			</AuthProvider>
		);

		fireEvent.click(screen.getByText('Sign Up'));

		expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
		expect(screen.getByText('REGISTER')).toBeInTheDocument();
	});
});

describe('Submittting login', () => {
	test('Correct data is sent through submit handler to axios after submitting', async () => {
		render(
			<AuthProvider>
				<LoadingProvider>
					<MemoryRouter initialEntries={['/login']}>
						<Routes>
							<Route path="/login" element={<Login />} />
						</Routes>
					</MemoryRouter>
				</LoadingProvider>
			</AuthProvider>
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

	test('Correct redirect to home when response provides accessToken', async () => {
		axios_post.mockResolvedValueOnce({ data: { accessToken: 'user123' } });

		render(
			<AuthProvider>
				<LoadingProvider>
					<MemoryRouter initialEntries={['/login']}>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/" element={<p>HOME</p>} />
						</Routes>
					</MemoryRouter>
				</LoadingProvider>
			</AuthProvider>
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

	test('Submission to remote is not triggered if empty fields', async () => {
		render(
			<AuthProvider>
				<LoadingProvider>
					<MemoryRouter>
						<Login />
					</MemoryRouter>
				</LoadingProvider>
			</AuthProvider>
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
});