import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children }) {
	const { user, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<div className="w-full max-w-sm mx-auto bg-white border rounded-xl p-6 shadow-sm text-center">
				<div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full" />
				<p className="mt-2 text-sm text-gray-600">Checking authentication…</p>
			</div>
		);
	}
	if (!user) {
		return <Navigate to="/admin/login" replace state={{ from: location }} />;
	}
	return children;
}

export function RedirectIfAuthed({ children }) {
	const { user, loading } = useAuth();
	if (loading) {
		return (
			<div className="w-full max-w-sm mx-auto bg-white border rounded-xl p-6 shadow-sm text-center">
				<div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full" />
				<p className="mt-2 text-sm text-gray-600">Preparing…</p>
			</div>
		);
	}
	if (user) {
		return <Navigate to="/admin/dashboard" replace />;
	}
	return children;
}


