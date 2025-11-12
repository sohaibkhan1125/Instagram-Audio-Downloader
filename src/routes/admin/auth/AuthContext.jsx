import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebaseConfig';

const AuthContext = createContext({
	user: null,
	loading: true,
	signOutUser: async () => {}
});

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (fbUser) => {
			setUser(fbUser);
			// Maintain a simple session flag for route guards and middleware-like redirects
			if (fbUser) {
				localStorage.setItem('admin_authed', '1');
			} else {
				localStorage.removeItem('admin_authed');
			}
			setLoading(false);
		});
		return () => unsub();
	}, []);

	const signOutUser = async () => {
		await signOut(auth);
	};

	const value = useMemo(() => ({ user, loading, signOutUser }), [user, loading]);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	return useContext(AuthContext);
}


