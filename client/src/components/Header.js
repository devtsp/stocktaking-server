import React from 'react';
import { Link } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

const Header = () => {
	const { auth } = useAuth();
	return (
		<header>
			<Link to="/dashboard">
				<h1>DASHBOARD</h1>
			</Link>
			<Link to="/operate">
				<h1>OPERATE</h1>
			</Link>
			<Link to="/login">
				<h1>LOGIN</h1>
			</Link>
			<span>({auth?.email || 'Logged Out'})</span>
		</header>
	);
};

export default Header;
