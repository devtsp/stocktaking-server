import React from 'react';
import { Link } from 'react-router-dom';

import main from '../api/main';
import AuthContext from '../context/AuthProvider';

const Login = () => {
	const { setAuth } = React.useContext(AuthContext);
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');
	const [success, setSuccess] = React.useState('');

	const submitLogin = async e => {
		e.preventDefault();
		if (!email.trim() || !password.trim()) {
			setError('Fields must not be empty');
			return;
		}

		try {
			const response = await main.post('/auth', { email, password });
			console.log(response.data);
			const accessToken = response?.data?.accessToken;
			setAuth({ email, password, accessToken });
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
