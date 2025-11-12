import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
	const location = useLocation();
	const isDashboard = location.pathname.startsWith('/admin/dashboard');
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<header className="border-b bg-white">
				<div className="mx-auto w-full max-w-6xl px-4 py-4 flex items-center justify-between">
					<Link to="/" className="text-lg font-semibold">Instagram Audio Downloader</Link>
					<nav className="text-sm text-gray-600">
						<Link to="/admin/login" className="hover:text-black mr-4">Login</Link>
						<Link to="/admin/signup" className="hover:text-black">Signup</Link>
					</nav>
				</div>
			</header>
			{isDashboard ? (
				<main className="flex-1 p-0">
					<Outlet />
				</main>
			) : (
				<main className="flex-1 flex items-center justify-center p-4">
					<Outlet />
				</main>
			)}
			<footer className="border-t bg-white">
				<div className="mx-auto w-full max-w-6xl px-4 py-4 text-center text-xs text-gray-500">
					© {new Date().getFullYear()} Instagram Audio Downloader
				</div>
			</footer>
		</div>
	);
}


