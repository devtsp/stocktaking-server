import React from 'react';
import { Link, Navigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import useLoading from '../hooks/useLoading';

const Login = () => {
	const { setIsFetching } = useLoading();
	const { auth, setAuth } = useAuth();

	const emailRef = React.useRef();
	const errorRef = React.useRef();

	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');

	React.useEffect(() => {
		!auth?.accessToken && emailRef.current.focus();
	}, [auth?.accessToken]);

	React.useEffect(() => {
		setError('');
	}, [email, password]);

	const submitLogin = async e => {
		e.preventDefault();

		if (!email.trim() || !password.trim()) {
			setError('Fields must not be empty');
			return;
		}

		try {
			setIsFetching(true);
			const response = await axios.post(
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
			setAuth({ accessToken });
			setEmail('');
			setPassword('');
		} catch (err) {
			console.error(err.response.data);
			setError(err.response.data);
			errorRef.current.focus();
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<>
			{!auth?.accessToken ? (
				<form className="Login" data-testid="login-form" onSubmit={submitLogin}>
					<h1>LOGIN</h1>
					<div>
						<label htmlFor="login-email">Email</label> <br />
						<input
							type="text"
							id="login-email"
							onChange={e => setEmail(e.target.value)}
							autoComplete="off"
							value={email}
							ref={emailRef}
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
					<p
						ref={errorRef}
						aria-live="assertive"
						className={error ? 'error' : 'offscreen'}
					>
						{error}
					</p>
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
