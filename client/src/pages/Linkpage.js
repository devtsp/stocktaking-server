import React from 'react';
import { Link } from 'react-router-dom';

const Linkpage = () => {
	return (
		<section className="Linkpage">
			<h1>LINKPAGE</h1>
			<p>
				<Link to="/dashboard">Go to Dashboard</Link>
				<Link to="/login">Go to Login Page</Link>
				<Link to="/register">Go to Register Page</Link>
			</p>
		</section>
	);
};

export default Linkpage;
