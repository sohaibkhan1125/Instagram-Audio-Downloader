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
		<div className="w-full max-w-md bg-white border rounded-xl p-6 shadow-sm">
			<h1 className="text-2xl font-semibold mb-6 text-center">Admin Login</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">Email</label>
					<input
						type="email"
						className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Password</label>
					<input
						type="password"
						className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
						placeholder="********"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button
					type="submit"
					disabled={loading}
					className="w-full flex items-center justify-center rounded-md bg-gray-900 text-white py-2 font-medium hover:bg-black transition disabled:opacity-60"
				>
					{loading ? (
						<span className="inline-flex items-center">
							<span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
							Signing in…
						</span>
					) : (
						'Sign In'
					)}
				</button>
			</form>
			<p className="mt-4 text-sm text-center text-gray-600">
				Don&apos;t have an account?{' '}
				<Link to="/admin/signup" className="text-gray-900 font-medium hover:underline">
					Sign up
				</Link>
			</p>
		</div>
	);
}


