import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import {
	AiOutlineCheckCircle,
	AiOutlineCloseCircle,
	AiOutlineInfoCircle,
} from 'react-icons/ai';

import axios from '../api/axios';

const Register = () => {
	const navigate = useNavigate();

	const emailRef = React.useRef();
	const errRef = React.useRef();

	const [email, setEmail] = React.useState('');
	const [validEmail, setValidEmail] = React.useState(false);
	const [emailFocus, setEmailFocus] = React.useState(false);

	const [password, setPassword] = React.useState('');
	const [validPassword, setValidPassword] = React.useState(false);
	const [passwordFocus, setPasswordFocus] = React.useState(false);

	const [repeatPassword, setRepeatPassword] = React.useState('');
	const [validRepeatPassword, setValidRepeatPassword] = React.useState(false);
	const [repeatPasswordFocus, setRepeatPasswordFocus] = React.useState(false);

	const [error, setError] = React.useState('');
	const [success, setSuccess] = React.useState(false);

	React.useEffect(() => {
		emailRef.current.focus();
	}, []);

	React.useEffect(() => {
		const result = EMAIL_REGEX.test(email);
		setValidEmail(result);
	}, [email]);

	React.useEffect(() => {
		const result = PASSWORD_REGEX.test(password);
		setValidPassword(result);

		const passwordsMatch = password === repeatPassword;
		setValidRepeatPassword(passwordsMatch);
	}, [password, repeatPassword]);

	React.useEffect(() => {
		setError('');
	}, [email, password, repeatPassword]);

	const submitRegister = async e => {
		e.preventDefault();
		const body = { email, password };

		if (!email.trim() || !password.trim()) {
			setError('Fields must not be empty');
			return;
		}

		try {
			const response = await axios.post('/register', body);
			console.log(response.data);
			setEmail('');
			setPassword('');
			setError('');
			navigate('/login');
		} catch (err) {
			console.error(err.message);
			setError(err.response.data.error);
		}
	};

	return (
		<form className="Register" onSubmit={submitRegister}>
			<h1>REGISTER</h1>
			<div>
				<label htmlFor="register-email" className="login-label">
					Email{' '}
					{email ? (
						validEmail ? (
							<AiOutlineCheckCircle className="valid" />
						) : (
							<AiOutlineCloseCircle className="invalid" />
						)
					) : (
						''
					)}
				</label>
				<input
					type="text"
					id="register-email"
					onChange={e => setEmail(e.target.value)}
					autoComplete="off"
					required
					aria-invalid={validEmail ? 'false' : 'true'}
					aria-describedby="uidnote"
					onFocus={() => setEmailFocus(true)}
					onBlur={() => setEmailFocus(false)}
					ref={emailRef}
				/>
				<div>
					<p
						id="uidnote"
						className={
							emailFocus && email && !validEmail ? 'instructions' : 'offscreen'
						}
					>
						{' '}
						<AiOutlineInfoCircle />{' '}
						<span>Enter a valid email format, ex: NewUser@gmail.com</span>
					</p>
				</div>
			</div>
			<div>
				<label htmlFor="register-password">Password</label> <br />
				<input
					type="password"
					id="register-password"
					onChange={e => setPassword(e.target.value)}
					autoComplete="off"
					value={password}
					required
				/>
			</div>
			<p
				ref={errRef}
				className={error ? 'error' : 'offscreen'}
				aria-live="assertive"
			></p>
			<div>
				<input type="submit" value="Submit" />
			</div>
			<p>
				Already have an account? <br />
				<Link to="/login">Go to login Page</Link>
			</p>
		</form>
	);
};

const EMAIL_REGEX =
	/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

const PASSWORD_REGEX =
	/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}$/gm;

export default Register;
