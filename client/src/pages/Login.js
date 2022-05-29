import React from 'react';
import { Link } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import { axiosPrivate } from '../api/axios';
import useRefreshToken from '../hooks/useRefreshToken';

const Login = () => {
	const { auth, setAuth } = useAuth();
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');
	const [success, setSuccess] = React.useState('');

	const refresh = useRefreshToken();

	const submitLogin = async e => {
		e.preventDefault();
		if (!email.trim() || !password.trim()) {
			setError('Fields must not be empty');
			return;
		}

		try {
			const response = await axiosPrivate.post(
				'/auth',
				{ email, password },
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);
			const accessToken = response?.data?.accessToken;
			setAuth({ email, accessToken });
			console.log(auth);
			setEmail('');
			setPassword('');
			setError('');
			setSuccess('Succesfully logged user');
		} catch (err) {
			if (!err?.response) {
				setError('No server Response');
			} else if (err.response?.status === 400) {
				setError('Missing Email or Password');
			} else if (err.repsonse?.status === 401) {
				setError('Unauthorized');
			} else {
				setError('Login Failed');
			}
			setSuccess('');
		}
	};

	return (
		<>
			<form className="Login" onSubmit={submitLogin}>
				<h1>Login</h1>
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
				{success && <div className="success">{success}</div>}
				<div>
					<input type="submit" value="Submit" />
				</div>
				<p>
					Need an acount? <br />
					<Link to="/register">Sign Up</Link>
				</p>
			</form>
			<button onClick={() => refresh()}>Refresh Token</button>
		</>
	);
};

export default Login;
