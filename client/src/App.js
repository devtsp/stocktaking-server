import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
	return (
		<div className="App">
			<Router>
				<header>
					<h1>STOCKTAKING APP</h1>
				</header>
				<Routes>
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="register" element={<Register />} />
					<Route path="login" element={<Login />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
