import React from 'react';
import Navbar from './components/Navbar';
import DownloaderTool from './components/DownloaderTool';
import HowToUse from './components/HowToUse';
import KeyFeatures from './components/KeyFeatures';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import './App.css';
import { Link } from 'react-router-dom';
import { useAuth } from './routes/admin/auth/AuthContext';
import MaintenanceGate from './components/MaintenanceGate';
import HomeContent from './components/HomeContent';
import SEO from './components/SEO';

function App() {
	const { user } = useAuth();
	return (
		<div className="App">
			<SEO />
			<MaintenanceGate />

			<Navbar />
			<div className="max-w-6xl mx-auto px-4 mt-6">
				<div className="rounded-lg bg-gray-50 border p-4 text-sm flex items-center justify-between">
					<span>
						Admin panel:{' '}
						<Link to="/admin/login" className="underline font-medium">
							Login
						</Link>{' '}
						or{' '}
						<Link to="/admin/signup" className="underline font-medium">
							Signup
						</Link>{' '}
						{user ? <span className="ml-2 text-gray-600">({user.email})</span> : null}
					</span>
					<Link to="/admin/dashboard" className="text-white bg-gray-900 px-3 py-1.5 rounded-md">
						Go to Dashboard
					</Link>
				</div>
			</div>
			<main>
				<DownloaderTool />
				<HomeContent />
				<HowToUse />
				<KeyFeatures />
				<FAQ />
			</main>
			<Footer />
		</div>
	);
}

export default App;
