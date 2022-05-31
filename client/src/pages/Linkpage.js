import React from 'react';
import { Link } from 'react-router-dom';

const Linkpage = () => {
	return (
		<section className="Linkpage">
			<p>
				<Link to="/operate">Operate</Link>
				<Link to="/dashboard">Dashboard</Link>
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
			</p>
		</section>
	);
};

export default Linkpage;
