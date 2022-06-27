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
import axios from '../api/axios';
import LoadingProvider from '../context/LoadingProvider';
import { AuthProvider } from '../context/AuthProvider';

jest.mock('react-router-dom');

afterEach(cleanup);

const postMock = jest.fn();
axios.post = postMock;

describe('Login', () => {
	test('Correct data is sent through submit handler to axios after submitting', async () => {
		postMock.mockImplementationOnce(async () => ({
			response: { data: { accessToken: 'test' } },
		}));

		render(
			<AuthProvider>
				<LoadingProvider>
					<Login />
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

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith(
				'/auth',
				{ email: 'unexisting-user', password: 'test' },
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);
		});
	});
});
