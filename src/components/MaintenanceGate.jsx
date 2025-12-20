import React, { useEffect, useState } from 'react';
import { fetchMaintenanceMode, subscribeToMaintenanceMode } from '../utils/supabaseService';

export default function MaintenanceGate() {
	const [maintenance, setMaintenance] = useState(false);

	useEffect(() => {
		let unsubscribe = null;

		const init = async () => {
			// Initial fetch
			const mode = await fetchMaintenanceMode();
			setMaintenance(mode);

			// Subscribe to real-time updates
			unsubscribe = subscribeToMaintenanceMode((newMode) => {
				setMaintenance(newMode);
			});
		};

		init();

		return () => {
			if (unsubscribe) unsubscribe();
		};
	}, []);

	if (!maintenance) return null;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 text-white text-2xl font-semibold">
			Website is currently under maintenance. Please check back later.
		</div>
	);
}


