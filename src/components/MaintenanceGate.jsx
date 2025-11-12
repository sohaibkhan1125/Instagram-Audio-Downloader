import React, { useEffect, useState } from 'react';

export default function MaintenanceGate() {
	const [maintenance, setMaintenance] = useState(false);

	useEffect(() => {
		// initial read
		try {
			const stored = localStorage.getItem('maintenanceMode');
			if (stored != null) {
				setMaintenance(Boolean(JSON.parse(stored)));
			}
		} catch {}
		// listen to changes from other tabs or admin page
		const onStorage = (e) => {
			if (e.key === 'maintenanceMode') {
				try {
					setMaintenance(Boolean(JSON.parse(e.newValue)));
				} catch {
					setMaintenance(false);
				}
			}
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	}, []);

	if (!maintenance) return null;
	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 text-white text-2xl font-semibold">
			Website is currently under maintenance. Please check back later.
		</div>
	);
}


