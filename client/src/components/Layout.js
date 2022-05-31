import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
	return (
		<main className="Layout">
			<Outlet as="main" />
		</main>
	);
};

export default Layout;
