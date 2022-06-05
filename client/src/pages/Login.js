import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import useAuth from '../hooks/useAuth';
import axios from '../api/axios';

const Login = () => {
	const navigate = useNavigate();
	const { auth, setAuth } = useAuth();

	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');

	const submitLogin = async e => {
		e.preventDefault();
		if (!email.trim() || !password.trim()) {
			setError('Fields must not be empty');
			return;
		}

		try {
			const response = await axios.post(
				'/auth',
				JSON.stringify({ email, password }),
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);
			const accessToken = response?.data?.accessToken;
			const user = jwtDecode(accessToken)?.UserInfo.user;
			setAuth({ user, accessToken });
			setEmail('');
			setPassword('');
			navigate('/');
		} catch (err) {
			if (!err?.response) {
				setError('No server Response');
			} else if (err.response?.status === 400) {
				setError('Missing Email or Password');
			} else if (err.response?.status === 401) {
				setError('Unauthorized');
			} else {
				setError('Login Failed');
			}
		}
	};

	return (
		<>
			{!auth.user ? (
				<form className="Login" onSubmit={submitLogin}>
					<h1>LOGIN</h1>
					<div>
						<label htmlFor="login-email">Email</label> <br />
						<input
							type="text"
							id="login-email"
							onChange={e => setEmail(e.target.value)}
							autoComplete="off"
							value={email}
							required
						/>
					</div>
					<div>
						<label htmlFor="login-password">Password</label> <br />
						<input
							type="password"
							id="login-password"
							onChange={e => setPassword(e.target.value)}
							autoComplete="off"
							value={password}
							required
						/>
					</div>
					{error && <div className="error">*{error}</div>}
					<div>
						<input type="submit" value="Submit" />
					</div>
					<p>
						Need an acount? <br />
						<Link to="/register">Sign Up</Link>
					</p>
				</form>
			) : (
				<Navigate to="/" />
			)}
		</>
	);
};

export default Login;
