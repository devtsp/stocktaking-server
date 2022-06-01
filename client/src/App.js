import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import PersistLogin from './components/PersistLogin';

import Nav from './components/Nav';
import Layout from './components/Layout';
import Home from './pages/Home';
import Operations from './pages/Operations';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
	return (
		<AuthProvider>
			<PersistLogin>
				<Router>
					<Nav />
					<Routes>
						<Route element={<Layout />}>
							<Route path="/" element={<Home />} />
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
