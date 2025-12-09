import { cookies } from 'next/headers';
import DeviceList from '@/components/dashboard/device-list';
import { ProtectedContent } from '@/components/auth/protected-content';
import { UserRole } from '@/lib/auth/roles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Device } from '@/types'

// ============================================
// TIPOS
// ============================================



// ============================================
// SERVER FUNCTION: Obtener dispositivos iniciales
// ============================================

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
		// const response = await fetch('http://localhost:3000/api/devices', {
		// 	headers: {
		// 		Authorization: `Bearer ${accessToken}`,
		// 	},
		// 	cache: 'no-store', // No cachear (datos en tiempo real)
		// });

		// if (!response.ok) {
		// 	console.error('[Dashboard] Error fetching devices:', response.status);
		// 	return [];
		// }

		const devices: Device[] = await response.json();
		console.log(`[Dashboard] Loaded ${devices.length} devices`);

		return devices;
	} catch (error) {
		console.error('[Dashboard] Error fetching devices:', error);
		return [];
	}
}

// ============================================
// SERVER COMPONENT: Dashboard Page
// ============================================

export default async function DashboardPage() {
	
	// ⭐ Cargar datos en el servidor ANTES de renderizar
	const initialDevices = await getInitialDevices();

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

					{/* Lista de Dispositivos (visible para todos los usuarios autenticados) */}
					<section>
						<DeviceList initialDevices={initialDevices} />
					</section>

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

// ============================================
// COMPONENTES DE SECCIONES
// ============================================

function ReportsSection() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>📊 Reportes y Análisis</CardTitle>
				<CardDescription>Estadísticas de uso y rendimiento</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<div className='p-4 border rounded-lg bg-muted/50'>
						<h3 className='text-sm font-medium text-muted-foreground'>Dispositivos Localizados (Hoy)</h3>
						<p className='text-3xl font-bold mt-2'>42</p>
						<p className='text-xs text-muted-foreground mt-1'>+12% vs ayer</p>
					</div>

					<div className='p-4 border rounded-lg bg-muted/50'>
						<h3 className='text-sm font-medium text-muted-foreground'>Tiempo Promedio de Localización</h3>
						<p className='text-3xl font-bold mt-2'>2.3m</p>
						<p className='text-xs text-muted-foreground mt-1'>-8% vs semana pasada</p>
					</div>

					<div className='p-4 border rounded-lg bg-muted/50'>
						<h3 className='text-sm font-medium text-muted-foreground'>Equipos con Batería Baja</h3>
						<p className='text-3xl font-bold mt-2 text-yellow-600 dark:text-yellow-400'>7</p>
						<p className='text-xs text-muted-foreground mt-1'>Requieren carga</p>
					</div>
				</div>

				<div className='mt-6'>
					<h3 className='text-sm font-semibold mb-3'>Actividad Reciente</h3>
					<div className='space-y-2'>
						{[
							{ time: '10:23', action: 'Dispositivo Zebra-045 localizado', user: 'Juan P.' },
							{ time: '10:15', action: 'Alarma activada en Datalogic-012', user: 'María G.' },
							{ time: '09:58', action: 'Dispositivo UROBO-087 conectado', user: 'Sistema' },
						].map((activity, i) => (
							<div
								key={i}
								className='flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm'
							>
								<div className='flex items-center gap-3'>
									<span className='text-xs text-muted-foreground font-mono'>{activity.time}</span>
									<span>{activity.action}</span>
								</div>
								<span className='text-xs text-muted-foreground'>{activity.user}</span>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function UserManagementSection() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>👥 Gestión de Usuarios</CardTitle>
				<CardDescription>Administrar usuarios y permisos del sistema</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div className='flex items-center justify-between p-4 border rounded-lg'>
						<div>
							<p className='font-medium'>Total de Usuarios</p>
							<p className='text-2xl font-bold mt-1'>24</p>
						</div>
						<Button>+ Nuevo Usuario</Button>
					</div>

					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						<div className='p-4 border rounded-lg text-center'>
							<p className='text-sm text-muted-foreground'>Super Admins</p>
							<p className='text-2xl font-bold mt-1'>2</p>
						</div>
						<div className='p-4 border rounded-lg text-center'>
							<p className='text-sm text-muted-foreground'>Admins</p>
							<p className='text-2xl font-bold mt-1'>5</p>
						</div>
						<div className='p-4 border rounded-lg text-center'>
							<p className='text-sm text-muted-foreground'>Operadores</p>
							<p className='text-2xl font-bold mt-1'>12</p>
						</div>
						<div className='p-4 border rounded-lg text-center'>
							<p className='text-sm text-muted-foreground'>Usuarios</p>
							<p className='text-2xl font-bold mt-1'>5</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function SystemConfigSection() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>⚙️ Configuración del Sistema</CardTitle>
				<CardDescription>Ajustes avanzados y mantenimiento</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-3'>
					<div className='flex items-center justify-between p-3 border rounded-lg'>
						<div>
							<p className='font-medium'>Modo de Alarma</p>
							<p className='text-sm text-muted-foreground'>Volumen máximo y vibración</p>
						</div>
						<Button variant='outline' size='sm'>Configurar</Button>
					</div>

					<div className='flex items-center justify-between p-3 border rounded-lg'>
						<div>
							<p className='font-medium'>Intervalo de Sincronización</p>
							<p className='text-sm text-muted-foreground'>Actualización cada 30 segundos</p>
						</div>
						<Button variant='outline' size='sm'>Configurar</Button>
					</div>

					<div className='flex items-center justify-between p-3 border rounded-lg'>
						<div>
							<p className='font-medium'>Backup de Base de Datos</p>
							<p className='text-sm text-muted-foreground'>Último backup: Hoy 02:00 AM</p>
						</div>
						<Button variant='outline' size='sm'>Crear Backup</Button>
					</div>

					<div className='flex items-center justify-between p-3 border rounded-lg'>
						<div>
							<p className='font-medium'>Logs del Sistema</p>
							<p className='text-sm text-muted-foreground'>Ver registro de eventos</p>
						</div>
						<Button variant='outline' size='sm'>Ver Logs</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
