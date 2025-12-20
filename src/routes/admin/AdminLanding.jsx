import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminLanding() {
    return (
        <div className="w-full flex flex-col items-center text-center space-y-12 py-12 md:py-24">

            {/* Hero Section */}
            <div className="space-y-6 max-w-2xl px-4 animate-fadeIn">
                <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-indigo-50 mb-4 ring-1 ring-indigo-100">
                    <span className="px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 uppercase">Admin Portal</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                    Manage Your Content <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                        With Confidence
                    </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed mx-auto max-w-xl">
                    Welcome to the Instagram Audio Downloader admin panel. Access tools to manage homepage content, hero sections, and view analytics securely.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        to="/admin/login"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/25 active:scale-95"
                    >
                        Login to Dashboard
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    </Link>
                    <Link
                        to="/admin/signup"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 active:scale-95"
                    >
                        Create Account
                    </Link>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-4 w-full">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Management</h3>
                    <p className="text-gray-600 text-sm">Rich text editor to update your homepage content instantly without touching code.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Site Settings</h3>
                    <p className="text-gray-600 text-sm">Control maintenance modes, SEO settings, and general site configuration.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Supabase Powered</h3>
                    <p className="text-gray-600 text-sm">Secure, real-time data storage ensures your updates are live instantly.</p>
                </div>
            </div>

        </div>
    );
}
