import React from 'react';
import { Link } from 'react-router-dom';

import main from '../api/main';

const Login = () => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');
	const [success, setSuccess] = React.useState('');

	const submitLogin = async e => {
		e.preventDefault();
		const body = { email, password };
		if (!email.trim() || !password.trim()) {
			setError('Fields must not be empty');
			return;
		}

		try {
			const response = await main.post('/auth', body);
			console.log(response.data);
			setError('');
			setSuccess('Succesfully logged user');
		} catch (err) {
			console.error(err.response.data);
			setSuccess('');
			setError(err.response.data?.error);
		}
	};

	return (
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
	);
};

export default Login;
