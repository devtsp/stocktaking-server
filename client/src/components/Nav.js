import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaRegUserCircle } from 'react-icons/fa';
import jwt_decode from 'jwt-decode';

import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useLoading from '../hooks/useLoading';

const Nav = () => {
	const { auth, setAuth } = useAuth();
	const axiosPrivate = useAxiosPrivate();
	const { setIsFetching } = useLoading();

	const handleLogout = async () => {
		try {
			setIsFetching(true);
			await axiosPrivate.post('/logout');
			setAuth({ accessToken: null });
		} catch (err) {
			console.error(err.message);
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<>
			{auth?.accessToken && (
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
						<span>
							{jwt_decode(auth.accessToken).UserInfo.email.split('@')[0]}
						</span>
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
