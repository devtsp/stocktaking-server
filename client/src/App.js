import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import PersistLogin from './components/PersistLogin';

import Header from './components/Header';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Operations from './pages/Operations';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
	return (
		<AuthProvider>
			<PersistLogin>
				<Router>
					<Header />
					<Routes>
						<Route element={<Layout />}>
							<Route path="/" element={<Dashboard />} />
							<Route path="/operations" element={<Operations />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
						</Route>
					</Routes>
				</Router>
			</PersistLogin>
		</AuthProvider>
	);
}

export default App;
