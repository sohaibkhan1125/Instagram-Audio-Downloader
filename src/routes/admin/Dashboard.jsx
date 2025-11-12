import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from './auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiHome, FiSettings, FiBarChart2, FiFileText, FiLogOut, FiType } from 'react-icons/fi';
import { getHeroSectionData, saveHeroSectionData } from '../../utils/localStorageManager';

const NAV_ITEMS = [
	{ key: 'home', label: 'Dashboard Home', icon: FiHome },
	{ key: 'general', label: 'General Settings', icon: FiSettings },
	{ key: 'hero', label: 'Hero Section Management', icon: FiType },
	{ key: 'seo', label: 'SEO Tools', icon: FiBarChart2 },
	{ key: 'reports', label: 'Reports', icon: FiFileText }
];

export default function AdminDashboard({ initialTab = 'general' }) {
	const { user, signOutUser } = useAuth();
	const navigate = useNavigate();
	const [activeKey, setActiveKey] = useState(initialTab || 'general');

	const [maintenanceMode, setMaintenanceMode] = useState(false);
	const [saving, setSaving] = useState(false);

	// Hero Section Management state
	const [heroTitle, setHeroTitle] = useState('');
	const [heroSubtitle, setHeroSubtitle] = useState('');
	const [heroButtonText, setHeroButtonText] = useState('');
	const [savingHero, setSavingHero] = useState(false);

	// Load maintenance mode from localStorage
	useEffect(() => {
		try {
			const stored = localStorage.getItem('maintenanceMode');
			if (stored != null) {
				setMaintenanceMode(Boolean(JSON.parse(stored)));
			}
		} catch {}
	}, []);

	// Load hero section data from localStorage
	useEffect(() => {
		const data = getHeroSectionData();
		if (data) {
			setHeroTitle(data.title || '');
			setHeroSubtitle(data.subtitle || '');
			setHeroButtonText(data.buttonText || '');
		} else {
			// Set default values if no data exists
			setHeroTitle('Download Instagram Audio Instantly');
			setHeroSubtitle('Paste your link and get high-quality audio in seconds.');
			setHeroButtonText('Download Now');
		}
	}, []);

	const handleSaveMaintenance = async () => {
		try {
			setSaving(true);
			localStorage.setItem('maintenanceMode', JSON.stringify(maintenanceMode));
			toast.success('✅ Maintenance mode updated successfully.');
		} catch {
			toast.error('Failed to save changes.');
		} finally {
			setSaving(false);
		}
	};

	const handleSaveHero = async () => {
		try {
			setSavingHero(true);
			saveHeroSectionData({
				title: heroTitle,
				subtitle: heroSubtitle,
				buttonText: heroButtonText
			});
			toast.success('✅ Hero section updated successfully!');
		} catch {
			toast.error('Failed to save changes.');
		} finally {
			setSavingHero(false);
		}
	};

	const handleLogout = async () => {
		await signOutUser();
		navigate('/admin/login', { replace: true });
	};

	const SidebarItem = ({ item, isActive, onClick }) => {
		const Icon = item.icon;
		return (
			<button
				onClick={onClick}
				className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${
					isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
				}`}
			>
				<Icon className="text-lg" />
				<span className="text-sm font-medium">{item.label}</span>
			</button>
		);
	};

	const RightContent = useMemo(() => {
		if (activeKey === 'general') {
			return (
				<div className="space-y-6">
					<header>
						<h1 className="text-2xl font-semibold">General Settings</h1>
						<p className="text-sm text-gray-600">Manage website maintenance and basic preferences.</p>
					</header>
					<section className="bg-white border rounded-xl shadow-sm p-6">
						<h2 className="text-lg font-medium mb-4">Website Maintenance Mode</h2>
						<div className="flex items-center gap-3">
							<span className="text-sm text-gray-600">Off</span>
							<button
								type="button"
								onClick={() => setMaintenanceMode((v) => !v)}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
									maintenanceMode ? 'bg-gray-900' : 'bg-gray-300'
								}`}
								aria-pressed={maintenanceMode}
								aria-label="Toggle maintenance mode"
							>
								<span
									className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
										maintenanceMode ? 'translate-x-5' : 'translate-x-1'
									}`}
								/>
							</button>
							<span className="text-sm text-gray-600">On</span>
						</div>
						<button
							onClick={handleSaveMaintenance}
							disabled={saving}
							className="mt-6 inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black transition disabled:opacity-60"
						>
							{saving ? (
								<span className="inline-flex items-center">
									<span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
									Saving…
								</span>
							) : (
								'Save Changes'
							)}
						</button>
					</section>
				</div>
			);
		}
		if (activeKey === 'home') {
			return (
				<div className="space-y-3">
					<h1 className="text-2xl font-semibold">Dashboard Home</h1>
					<p className="text-sm text-gray-600">Coming soon…</p>
				</div>
			);
		}
		if (activeKey === 'hero') {
			return (
				<div className="space-y-6">
					<header>
						<h1 className="text-2xl font-semibold">Hero Section Management</h1>
						<p className="text-sm text-gray-600">Manage the hero section content that appears on your website homepage.</p>
					</header>
					<section className="bg-white border rounded-xl shadow-sm p-6">
						<div className="space-y-6">
							<div>
								<label className="block mb-2 font-semibold text-gray-700">Hero Title</label>
								<input
									type="text"
									value={heroTitle}
									onChange={(e) => setHeroTitle(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
									placeholder="Enter hero section title"
								/>
							</div>

							<div>
								<label className="block mb-2 font-semibold text-gray-700">Hero Subtitle</label>
								<textarea
									value={heroSubtitle}
									onChange={(e) => setHeroSubtitle(e.target.value)}
									rows={3}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
									placeholder="Enter hero section subtitle"
								/>
							</div>

							<div>
								<label className="block mb-2 font-semibold text-gray-700">Button Text</label>
								<input
									type="text"
									value={heroButtonText}
									onChange={(e) => setHeroButtonText(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
									placeholder="Enter button text"
								/>
							</div>

							<button
								onClick={handleSaveHero}
								disabled={savingHero}
								className="w-full inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black transition disabled:opacity-60"
							>
								{savingHero ? (
									<span className="inline-flex items-center">
										<span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
										Saving…
									</span>
								) : (
									'Save Changes'
								)}
							</button>
						</div>
					</section>
				</div>
			);
		}
		if (activeKey === 'seo') {
			return (
				<div className="space-y-3">
					<h1 className="text-2xl font-semibold">SEO Tools</h1>
					<p className="text-sm text-gray-600">Coming soon…</p>
				</div>
			);
		}
		if (activeKey === 'reports') {
			return (
				<div className="space-y-3">
					<h1 className="text-2xl font-semibold">Reports</h1>
					<p className="text-sm text-gray-600">Coming soon…</p>
				</div>
			);
		}
		return null;
	}, [activeKey, maintenanceMode, saving, heroTitle, heroSubtitle, heroButtonText, savingHero]);

	return (
		<div className="flex flex-col md:flex-row w-full h-screen">
			<aside className="md:w-[30%] w-full bg-gray-900 text-white flex flex-col justify-between p-6 h-auto md:h-screen">
				<div>
					<h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
					<div className="mb-6">
						<p className="text-xs text-gray-400">Signed in as</p>
						<p className="text-sm font-medium">{user?.displayName || user?.email}</p>
					</div>
					<nav className="space-y-1">
						{NAV_ITEMS.map((item) => (
							<SidebarItem
								key={item.key}
								item={item}
								isActive={activeKey === item.key}
								onClick={() => setActiveKey(item.key)}
							/>
						))}
					</nav>
				</div>
				<button
					onClick={handleLogout}
					className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition text-gray-300 hover:bg-gray-800 hover:text-white"
				>
					<FiLogOut className="text-lg" />
					<span className="text-sm font-medium">Logout</span>
				</button>
			</aside>

			<main className="md:w-[70%] w-full h-screen bg-gray-100 p-8 overflow-y-auto">
				{RightContent}
			</main>
		</div>
	);
}
