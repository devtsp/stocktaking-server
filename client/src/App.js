import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import PersistLogin from './components/PersistLogin';
import LoadingProvider from './context/LoadingProvider';

import Nav from './components/Nav';
import Layout from './components/Layout';
import Home from './pages/Home';
import Operations from './pages/Operations';
import Login from './pages/Login';
import Register from './pages/Register';
import TransactionProvider from './context/TransactionProvider';

function App() {
	return (
		<AuthProvider>
			<LoadingProvider>
				<PersistLogin>
					<Router>
						<Nav />
						<Routes>
							<Route element={<Layout />}>
								<Route element={<TransactionProvider />}>
									<Route path="/" element={<Home />} />
									<Route path="/operations" element={<Operations />} />
								</Route>
								<Route path="/login" element={<Login />} />
								<Route path="/register" element={<Register />} />
							</Route>
						</Routes>
					</Router>
				</PersistLogin>
			</LoadingProvider>
		</AuthProvider>
	);
}

export default App;
