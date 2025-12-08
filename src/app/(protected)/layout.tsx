import type React from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import InventoryHeader from '@/components/app-header';
import { getAuthDataFromServer } from '@/lib/server-utils';
import { AuthStateSync } from '@/components/auth-state-sync';
import { SocketInitializer } from '@/components/socket-initializer';

export default async function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// 1. Obtenemos los datos de la sesión en el servidor.
	// El proxy ya ha garantizado que la sesión es válida en este punto.
	const { accessToken, currentUser } = await getAuthDataFromServer();

	return (
		<div className='flex h-screen'>
			<AuthStateSync accessToken={accessToken} />
			<SocketInitializer />
			<AdminSidebar currentUser={{ username: currentUser.username, role: currentUser.role }} />

			<div className='flex flex-1 flex-col overflow-hidden  lg:ml-64'>
				<InventoryHeader currentUser={{ username: currentUser.username, role: currentUser.role }} />
				<main className='flex-1 overflow-y-auto sm:p-6'>{children}</main>
			</div>
		</div>
	);
}
