'use client'

import { useState } from 'react';
import AppHeader from '@/components/layout/app-header';
import AdminSidebar from '@/components/admin-sidebar';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	return (
		<div className='flex min-h-screen w-full flex-col bg-muted/40'>
			{/* Sidebar para móviles (overlay) y para desktop (fijo) */}
			<AdminSidebar
				onMenuClick={toggleSidebar}
				className={cn(
					'fixed inset-y-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			/>

			<div className='flex flex-col lg:pl-64'>
				<AppHeader onMenuClick={toggleSidebar} />
				<main className='flex-1 p-4 sm:px-6 sm:py-0'>{children}</main>
			</div>
			{/* Overlay para cerrar el menú en móvil */}
			{isSidebarOpen && (
				<div
					onClick={toggleSidebar}
					className='fixed inset-0 z-40 bg-black/50 lg:hidden'
				/>
			)}
		</div>
	);
}
