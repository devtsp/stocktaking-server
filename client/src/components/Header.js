import React from 'react';
import { Link } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

const Header = () => {
	const { auth } = useAuth();

	return (
		<header>
			<Link to="/">
				<h1>HOME</h1>
			</Link>
			<Link to="/operations">
				<h1>OPERATIONS</h1>
			</Link>

			{auth?.user ? (
				<span>{auth.user}</span>
			) : (
				<Link to="/login">
					<h1>LOGIN</h1>
				</Link>
			)}
		</header>
	);
};

export default Header;
