import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminSignup() {
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!fullName || !email || !password || !confirmPassword) {
			toast.error('Please fill in all fields.');
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			toast.error('Please enter a valid email.');
			return;
		}
		if (password.length < 6) {
			toast.error('Password must be at least 6 characters.');
			return;
		}
		if (password !== confirmPassword) {
			toast.error('Passwords do not match.');
			return;
		}

		try {
			setLoading(true);
			const cred = await createUserWithEmailAndPassword(auth, email, password);
			if (cred?.user) {
				await updateProfile(cred.user, { displayName: fullName });
			}
			toast.success('Account created successfully! Please log in.');
			navigate('/admin/login', { replace: true });
		} catch (err) {
			const message = err?.message || 'Signup failed';
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
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
							</svg>
						</div>
						<h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
						<p className="text-sm text-gray-500 mt-2">Join us and start managing audio content</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
							<input
								type="text"
								className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-gray-50 focus:bg-white"
								placeholder="John Doe"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
							/>
						</div>
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
							<label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
							<input
								type="password"
								className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-gray-50 focus:bg-white"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
							<input
								type="password"
								className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-gray-50 focus:bg-white"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
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
									Creating account...
								</span>
							) : (
								'Create Account'
							)}
						</button>
					</form>

					<div className="mt-8 text-center text-sm text-gray-500">
						Already have an account?{' '}
						<Link to="/admin/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
							Sign In
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


