import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import AdminSidebar from '@/components/AdminSidebar';
import InventoryHeader from '@/components/AppHeader';
import { ScrollArea } from "@/components/ui/scroll-area"
// @ts-ignore
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
	// <CHANGE> Updated metadata for AlertScanner dashboard
	title: 'AlertScanner Control | Dashboard Operacional',
	description: 'Dashboard de control operacional para monitoreo y gestión de dispositivos de red',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='es'
			className='dark'
		>
			<body className={`font-sans antialiased`}>
				<div className='dark min-h-screen bg-background'>
					<div className='flex h-screen'>
						<AdminSidebar />
						<div className='flex flex-1 flex-col overflow-hidden'>
							<InventoryHeader currentUser={{ name: 'Admin', role: 'SUPER_ADMIN' }} />
							<ScrollArea className='flex-1 overflow-y-auto'>
								<main className='flex-1 overflow-y-auto p-6'>{children}</main>
							</ScrollArea>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
