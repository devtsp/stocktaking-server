import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaRegUserCircle } from 'react-icons/fa';

import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Nav = () => {
	const { auth, setAuth } = useAuth();
	const axiosPrivate = useAxiosPrivate();

	const handleLogout = async () => {
		try {
			await axiosPrivate.post('/logout');
			setAuth({ user: null, accessToken: null });
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<>
			{auth?.user && (
				<nav>
					<NavLink
						to="/"
						style={({ isActive }) => (isActive ? activeTabStyle : {})}
					>
						<h1>HOME</h1>
					</NavLink>
					<NavLink
						to="/operations"
						style={({ isActive }) => (isActive ? activeTabStyle : {})}
					>
						<h1>OPERATIONS</h1>
					</NavLink>
					<div className="user-menu-button">
						<span>{auth.user}</span>
						<FaRegUserCircle />
					</div>
					<div className="logout">
						<span onClick={e => handleLogout()}>logout</span>
					</div>
				</nav>
			)}
		</>
	);
};

const activeTabStyle = {
	color: 'deepskyblue',
	borderBottom: '2px solid deepskyblue',
};

export default Nav;
