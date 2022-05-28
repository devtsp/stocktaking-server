import React from 'react';
import main from '../api/main';

const Register = () => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');

	const submitRegister = async e => {
		e.preventDefault();
		const body = { email, password };
		if (!email.trim() || !password.trim()) {
			setError('Fields must not be empty');
			return;
		}

		try {
			setError('');
			await main.post('/register', body);
			const { data } = await main.post('/auth', body);
			const { accessToken } = data;
			localStorage.setItem('accessToken', accessToken);
			console.log(accessToken);
		} catch (err) {
			setError(err.response.data.error);
		}
	};

	return (
		<form className="Register" onSubmit={submitRegister}>
			<h1>Register New Account</h1>
			<div>
				<label htmlFor="register-email">Email</label> <br />
				<input
					type="text"
					id="register-email"
					onChange={e => setEmail(e.target.value)}
					autoComplete="off"
					required
				/>
			</div>
			<div>
				<label htmlFor="register-password">Password</label> <br />
				<input
					type="password"
					id="register-password"
					onChange={e => setPassword(e.target.value)}
					autoComplete="off"
					required
				/>
			</div>
			{error && <div className="error">*{error}</div>}
			<div>
				<input type="submit" value="Submit" />
			</div>
		</form>
	);
};

export default Register;
