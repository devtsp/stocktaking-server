import React from 'react';
import { Link } from 'react-router-dom';
import {
	AiOutlineCheckCircle,
	AiOutlineCloseCircle,
	AiOutlineInfoCircle,
} from 'react-icons/ai';

import axios from '../api/axios';
import useLoading from '../hooks/useLoading';

const Register = () => {
	const emailRef = React.useRef();
	const errorRef = React.useRef();

	const [email, setEmail] = React.useState('');
	const [validEmail, setValidEmail] = React.useState();
	const [emailFocus, setEmailFocus] = React.useState(false);

	const [password, setPassword] = React.useState('');
	const [validPassword, setValidPassword] = React.useState(false);
	const [passwordFocus, setPasswordFocus] = React.useState(false);

	const [repeatPassword, setRepeatPassword] = React.useState('');
	const [validRepeatPassword, setValidRepeatPassword] = React.useState(false);
	const [repeatPasswordFocus, setRepeatPasswordFocus] = React.useState(false);

	const [error, setError] = React.useState('');
	const [success, setSuccess] = React.useState(false);

	const { setIsFetching } = useLoading();

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
	}, [password]);

	React.useEffect(() => {
		const passwordsMatch = password === repeatPassword;
		setValidRepeatPassword(passwordsMatch);
	}, [password, repeatPassword]);

	React.useEffect(() => {
		setError('');
	}, [email, password, repeatPassword]);

	const submitRegister = async e => {
		e.preventDefault();

		const validEmail = EMAIL_REGEX.test(email);
		const validPassword = PASSWORD_REGEX.test(password);

		if (!validEmail || !validPassword) {
			setError('Invalid Entry');
			return;
		}

		const body = { email, password };

		if (!email.trim() || !password.trim()) {
			setError('Fields must not be empty');
			return;
		}

		try {
			setIsFetching(true);
			const response = await axios.post('/register', body);
			setEmail('');
			setPassword('');
			setRepeatPassword('');
			setError('');
			setSuccess('Registered new user Successfully');
		} catch (err) {
			console.error(err.message);
			setError(err.response.data);
			errorRef.current.focus();
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<form
			className="Register"
			data-testid="register-form"
			onSubmit={submitRegister}
		>
			<h1>REGISTER</h1>
			<div>
				<label htmlFor="register-email" className="login-label">
					Email{' '}
					{email ? (
						validEmail ? (
							<AiOutlineCheckCircle
								data-testid="correct-register-email"
								className="valid"
							/>
						) : (
							<AiOutlineCloseCircle
								data-testid="wrong-register-email"
								className="invalid"
							/>
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
					aria-describedby="email-note"
					onFocus={() => setEmailFocus(true)}
					onBlur={() => setEmailFocus(false)}
					ref={emailRef}
					value={email}
				/>
				<div>
					<p
						data-testid="email-info"
						className={
							emailFocus && email && !validEmail ? 'instructions' : 'offscreen'
						}
					>
						<AiOutlineInfoCircle />
						<span id="email-note">
							Enter a valid email format, ex: NewUser@gmail.com
						</span>
					</p>
				</div>
			</div>
			<div>
				<label htmlFor="register-password" className="login-label">
					Password
					{password ? (
						validPassword ? (
							<AiOutlineCheckCircle
								data-testid="correct-register-password"
								className="valid"
							/>
						) : (
							<AiOutlineCloseCircle
								data-testid="wrong-register-password"
								className="invalid"
							/>
						)
					) : (
						''
					)}
				</label>
				<input
					type="password"
					id="register-password"
					onChange={e => setPassword(e.target.value)}
					autoComplete="off"
					required
					aria-invalid={validPassword ? 'false' : 'true'}
					aria-describedby="password-note"
					onFocus={() => setPasswordFocus(true)}
					onBlur={() => setPasswordFocus(false)}
					value={password}
				/>
				<div>
					<p
						data-testid="password-info"
						className={
							passwordFocus && !validPassword ? 'instructions' : 'offscreen'
						}
					>
						<AiOutlineInfoCircle />
						<span id="password-note">
							Password must have 8 to 30 characters, contain at least one
							uppercase letter, one lowercase letter and a digit
						</span>
					</p>
				</div>
			</div>
			<div>
				<label htmlFor="register-repeat-password" className="login-label">
					Confirm Password{' '}
					{repeatPassword ? (
						validRepeatPassword ? (
							<AiOutlineCheckCircle
								data-testid="correct-register-confirm-password"
								className="valid"
							/>
						) : (
							<AiOutlineCloseCircle
								data-testid="wrong-register-confirm-password"
								className="invalid"
							/>
						)
					) : (
						''
					)}
				</label>
				<input
					type="password"
					id="register-repeat-password"
					onChange={e => setRepeatPassword(e.target.value)}
					autoComplete="off"
					required
					aria-invalid={validPassword ? 'false' : 'true'}
					aria-describedby="confirm-password-note"
					onFocus={() => setRepeatPasswordFocus(true)}
					onBlur={() => setRepeatPasswordFocus(false)}
					value={repeatPassword}
				/>
				<div>
					<p
						data-testid="confirm-password-info"
						className={
							repeatPassword && repeatPasswordFocus && !validRepeatPassword
								? 'instructions'
								: 'offscreen'
						}
					>
						<AiOutlineInfoCircle />
						<span id="confirm-password-note">Passwords must match</span>
					</p>
				</div>
			</div>
			<div>
				<input
					type="submit"
					value="Submit"
					disabled={
						!validEmail || !validPassword || !validRepeatPassword ? true : false
					}
				/>
			</div>
			{success && (
				<div>
					<p data-testid="success-message" className="success">
						{success} <br /> <Link to="/login">Go to login Page</Link>
					</p>
				</div>
			)}
			<p
				data-testid="error-message"
				ref={errorRef}
				aria-live="assertive"
				className={error ? 'error' : 'offscreen'}
			>
				{error}
			</p>
			{!success && (
				<p>
					Already have an account? <br />
					<Link to="/login">Go to login Page</Link>
				</p>
			)}
		</form>
	);
};

const EMAIL_REGEX =
	/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/;

export default Register;
