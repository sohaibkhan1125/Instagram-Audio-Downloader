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
		<div className="w-full max-w-md bg-white border rounded-xl p-6 shadow-sm">
			<h1 className="text-2xl font-semibold mb-6 text-center">Create Admin Account</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">Full Name</label>
					<input
						type="text"
						className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
						placeholder="John Doe"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
					/>
				</div>
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
				<div>
					<label className="block text-sm font-medium mb-1">Confirm Password</label>
					<input
						type="password"
						className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
						placeholder="********"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
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
							Creating account…
						</span>
					) : (
						'Create Account'
					)}
				</button>
			</form>
			<p className="mt-4 text-sm text-center text-gray-600">
				Already have an account?{' '}
				<Link to="/admin/login" className="text-gray-900 font-medium hover:underline">
					Login
				</Link>
			</p>
		</div>
	);
}


