import type React from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import InventoryHeader from '@/components/app-header';
import { getAuthDataFromServer } from '@/lib/server-utils';
import { AuthStateSync } from '@/components/auth-state-sync';

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
			{/* 2. El componente de sincronización se renderiza pero no es visible.
			       Su única función es pasar el token al cliente para actualizar Zustand. */}
			<AuthStateSync accessToken={accessToken} />
			<AdminSidebar currentUser={{ username: currentUser.username, role: currentUser.role }} />
			
			<div className='flex flex-1 flex-col overflow-hidden'>
				<InventoryHeader currentUser={{ username: currentUser.username, role: currentUser.role }} />
					<main className='flex-1 overflow-y-auto p-6'>
						{children}
					</main>
			</div>
		</div>
	);
}
