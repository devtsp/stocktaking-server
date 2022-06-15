import React from 'react';
import { Outlet } from 'react-router-dom';
import { ImSpinner2 } from 'react-icons/im';

import useLoading from '../hooks/useLoading';

const Layout = () => {
	const { fetching } = useLoading();
	return (
		<>
			{fetching && (
				<div className="loading-screen">
					{' '}
					<ImSpinner2 />
				</div>
			)}
			<main className="Layout">
				<Outlet as="main" />
			</main>
		</>
	);
};

export default Layout;
