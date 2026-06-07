import React from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
    HomeIcon,
    PencilSquareIcon,
    ClockIcon,
    DocumentDuplicateIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, path: '/' },
        { id: 'generator', label: 'Generator', icon: PencilSquareIcon, path: '/generator' },
        { id: 'history', label: 'History', icon: ClockIcon, path: '/history' },
        { id: 'templates', label: 'Templates', icon: DocumentDuplicateIcon, path: '/templates' },
        { id: 'settings', label: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col fixed h-full bg-bg-primary/50 backdrop-blur-md z-10">
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center font-bold text-white">
                        AI
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Post Auto</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <a
                            key={item.id}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${location.pathname === item.path
                                ? 'bg-white/10 text-white font-medium'
                                : 'text-text-secondary hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-white/5">
                        <p className="text-xs text-text-secondary mb-1">Credits used</p>
                        <div className="flex justify-between items-end">
                            <span className="text-lg font-bold text-white">Free</span>
                            <span className="text-xs text-accent-primary">Unlimited</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#1a1a1a',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                    },
                }}
            />
        </div>
    );
};

export default Layout;
