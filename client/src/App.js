import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Header from './components/Header';
import LinkPage from './pages/Linkpage.js';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Operations from './pages/Operations';

function App() {
	return (
		<div className="App">
			<Router>
				<Header />
				<Routes>
					<Route element={<Layout />}>
						<Route path="/" element={<LinkPage />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/operate" element={<Operations />} />
					</Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
