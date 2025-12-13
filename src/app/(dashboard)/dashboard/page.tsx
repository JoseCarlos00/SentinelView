import { cookies } from 'next/headers';
import { ProtectedContent } from '@/components/auth/protected-content';
import { UserRole } from '@/lib/auth/roles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Device } from '@/types'

import ReportsSection from '@/components/dashboard/reports-section';
import UserManagementSection from '@/components/dashboard/user-management-section'
import SystemConfigSection from '@/components/dashboard/system-config-section'


const devicesMock = [
	{
		id: 'Android Id',
		androidId: 'Android Id',
		equipo: 'FM00001',
		modelo: 'MEMOR10',
		usuario: 'DavidGordillo',
		correo: 'david.gordillo@fantasiasmiguel.com.mx',
		aliasUsuario: 'Alias Usuario',
		ip: '192.168.15.173',
		macAddress: 'D0:4E:50:F8:50:11',
		isConnected: false,
	},
	{
		id: 'index-3',
		androidId: null,
		equipo: 'FM00002',
		modelo: 'MEMOR10',
		usuario: 'Mariano03',
		correo: 'mariano03@fantasiasmiguel.com.mx',
		aliasUsuario: 'Edith Ortega',
		ip: '192.168.15.174',
		macAddress: 'D0:4E:50:F8:5F:28',
		isConnected: true,
	},
	{
		id: 'index-4',
		androidId: null,
		equipo: 'FM00003',
		modelo: 'MEMOR10',
		usuario: 'Mariano04',
		correo: 'mariano04@fantasiasmiguel.com.mx',
		aliasUsuario: 'Jorgue Ezpinoza Martinez',
		ip: '192.168.15.175',
		macAddress: 'D0:4E:50:F8:5F:62',
		isConnected: true,
	},
	{
		id: 'index-5',
		androidId: null,
		equipo: 'FM00004',
		modelo: 'MEMOR10',
		usuario: 'Mariano05',
		correo: 'mariano05@fantasiasmiguel.com.mx',
		aliasUsuario: 'Diana Castillo',
		ip: '192.168.15.176',
		macAddress: 'D0:4E:50:F8:4D:07',
		isConnected: false,
	},
	{
		id: 'index-6',
		androidId: 'rfhfh-3',
		equipo: 'FM00005',
		modelo: 'MEMOR10',
		usuario: '',
		correo: '',
		aliasUsuario: '',
		ip: '192.168.15.177',
		macAddress: 'D0:4E:50:F8:63:46',
		isConnected: true,
	}
]

async function getInitialDevices(): Promise<Device[]> {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('access_token')?.value;

	if (!accessToken) {
		console.warn('[Dashboard] No access token found');
		return [];
	}

	try {
		// Llamada al backend Node.js desde servidor Next.js
		const response = await fetch('http://localhost:3000/api/devices', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			cache: 'no-store', // No cachear (datos en tiempo real)
		});

		if (!response.ok) {
			console.error('[Dashboard] Error fetching devices:', response.status);
			return [];
		}

		// const devices: Device[] = await response.json();
		const devices: Device[] = devicesMock;
		console.log(`[Dashboard] Loaded ${devices.length} devices`);

		return devices;
	} catch (error) {
		console.error('[Dashboard] Error fetching devices:', error);
		return [];
	}
}



export default async function DashboardPage() {
	
	const initialDevices = devicesMock;

	return (
		<div className='min-h-screen bg-background'>

			{/* Contenido Principal */}
			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='space-y-8'>
					{/* Alerta de Bienvenida */}
					<Alert>
						<InfoIcon className='h-4 w-4' />
						<AlertTitle>Sistema Activo</AlertTitle>
						<AlertDescription>
							Los dispositivos se actualizan en tiempo real a través de WebSocket.
							{initialDevices.length === 0 && ' No hay dispositivos registrados actualmente.'}
						</AlertDescription>
					</Alert>


					{/* Sección de Reportes (solo ADMIN y SUPER_ADMIN) */}
					<ProtectedContent
						requiredRole={UserRole.ADMIN}
						fallback={
							<Card>
								<CardHeader>
									<CardTitle>📊 Reportes y Análisis</CardTitle>
									<CardDescription>Sección Restringida</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='flex items-center justify-center py-8 text-muted-foreground'>
										<div className='text-center'>
											<p className='text-sm'>🔒 Requiere rol de Administrador o superior</p>
											<p className='text-xs mt-2'>Contacta a tu supervisor para obtener acceso</p>
										</div>
									</div>
								</CardContent>
							</Card>
						}
					>
						<ReportsSection />
					</ProtectedContent>

					{/* Sección de Gestión de Usuarios (solo SUPER_ADMIN) */}
					<ProtectedContent requiredRole={UserRole.SUPER_ADMIN}>
						<UserManagementSection />
					</ProtectedContent>

					{/* Sección de Configuración del Sistema (solo SUPER_ADMIN) */}
					<ProtectedContent requiredRole={UserRole.SUPER_ADMIN}>
						<SystemConfigSection />
					</ProtectedContent>
				</div>
			</main>
		</div>
	);
}
