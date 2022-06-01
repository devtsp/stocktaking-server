import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegUserCircle } from 'react-icons/fa';

import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Nav = () => {
	const { auth, setAuth } = useAuth();
	const axiosPrivate = useAxiosPrivate();

	const handleLogout = async () => {
		try {
			await axiosPrivate.post('/logout');
			setAuth({});
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<>
			{auth?.user && (
				<nav>
					<Link to="/">
						<h1>HOME</h1>
					</Link>
					<Link to="/operations">
						<h1>OPERATIONS</h1>
					</Link>
					<span className="user-menu-button">
						{auth.user}
						<FaRegUserCircle />
					</span>
					<div className="logout">
						<span onClick={e => handleLogout()}>logout</span>
					</div>
				</nav>
			)}
		</>
	);
};

export default Nav;
