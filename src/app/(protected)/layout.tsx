import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import AdminSidebar from '@/components/admin-sidebar';
import InventoryHeader from '@/components/app-header';
import { ScrollArea } from "@/components/ui/scroll-area"

export default function HomePageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='flex h-screen'>
			<AdminSidebar />
			<div className='flex flex-1 flex-col overflow-hidden'>
				<InventoryHeader currentUser={{ name: 'Admin', role: 'SUPER_ADMIN' }} />
				<ScrollArea className='flex-1 overflow-y-auto'>
					<main className='flex-1 overflow-y-auto p-6'>{children}</main>
				</ScrollArea>
			</div>
		</div>
	);
}
