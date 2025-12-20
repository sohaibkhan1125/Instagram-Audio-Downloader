import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminLogin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email || !password) {
			toast.error('Please enter email and password.');
			return;
		}
		try {
			setLoading(true);
			await signInWithEmailAndPassword(auth, email, password);
			toast.success('Logged in successfully!');
			const redirectTo = location.state?.from?.pathname || '/admin/dashboard';
			navigate(redirectTo, { replace: true });
		} catch (err) {
			const message = err?.message || 'Login failed';
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
				<div className="p-8">
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
						<h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
						<p className="text-sm text-gray-500 mt-2">Sign in to access your admin dashboard</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
							<input
								type="email"
								className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-gray-50 focus:bg-white"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<div className="flex items-center justify-between mb-2">
								<label className="block text-sm font-semibold text-gray-700">Password</label>
							</div>
							<input
								type="password"
								className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-gray-50 focus:bg-white"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{loading ? (
								<span className="inline-flex items-center justify-center">
									<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Signing in...
								</span>
							) : (
								'Sign In'
							)}
						</button>
					</form>

					<div className="mt-8 text-center text-sm text-gray-500">
						Don't have an account?{' '}
						<Link to="/admin/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
							Create Account
						</Link>
					</div>
				</div>
				<div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
					<Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
						Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}


