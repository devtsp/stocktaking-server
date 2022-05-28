import React from 'react';
import main from '../api/main';

const Register = () => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');
	const [success, setSuccess] = React.useState('');

	const submitRegister = async e => {
		e.preventDefault();
		const body = { email, password };
		try {
			const response = await main.post('/register', body);
			console.log(response.data);
			setSuccess('Succesfully registered user');
		} catch (err) {
			console.error(err.response.data);
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
				/>
			</div>
			<div>
				<label htmlFor="register-password">Password</label> <br />
				<input
					type="password"
					id="register-password"
					onChange={e => setPassword(e.target.value)}
				/>
			</div>
			{error && <div className="error">*{error}</div>}
			{success && <div className="success">{success}</div>}
			<div>
				<input type="submit" value="Submit" />
			</div>
		</form>
	);
};

export default Register;
