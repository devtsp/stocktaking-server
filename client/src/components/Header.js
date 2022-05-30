import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<header>
			<Link to="/dashboard">
				<h1> DASHBOARD</h1>
			</Link>
		</header>
	);
};

export default Header;
