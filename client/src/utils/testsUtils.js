import { AuthProvider } from '../context/AuthProvider';
import LoadingProvider from '../context/LoadingProvider';
import { MemoryRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';

export const TestContext = ({ path, children }) => {
	return (
		<AuthProvider>
			<LoadingProvider>
				<MemoryRouter initialEntries={[path || '/']}>
					<Routes>{children}</Routes>
				</MemoryRouter>
			</LoadingProvider>
		</AuthProvider>
	);
};
