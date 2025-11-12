import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import AdminLayout from './routes/admin/AdminLayout';
import AdminLogin from './routes/admin/Login';
import AdminSignup from './routes/admin/Signup';
import AdminDashboard from './routes/admin/Dashboard';
import { AuthProvider } from './routes/admin/auth/AuthContext';
import { ProtectedRoute, RedirectIfAuthed } from './routes/admin/auth/RouteGuards';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
	{
		path: '/',
		element: <App />
	},
	{
		path: '/admin',
		element: <AdminLayout />,
		children: [
			{
				path: 'login',
				element: (
					<RedirectIfAuthed>
						<AdminLogin />
					</RedirectIfAuthed>
				)
			},
			{
				path: 'signup',
				element: (
					<RedirectIfAuthed>
						<AdminSignup />
					</RedirectIfAuthed>
				)
			},
			{
				path: 'dashboard',
				element: (
					<ProtectedRoute>
						<AdminDashboard />
					</ProtectedRoute>
				)
			},
			{
				path: 'dashboard/hero-section',
				element: (
					<ProtectedRoute>
						<AdminDashboard initialTab="hero" />
					</ProtectedRoute>
				)
			}
		]
	}
]);

root.render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
			<Toaster position="top-right" />
		</AuthProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
