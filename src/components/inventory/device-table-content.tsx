import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Device } from '@/types/devices'
import ClientActionsMenu from './client-action-menu'
import { Badge } from '../ui/badge'
import { WifiOff, Wifi } from 'lucide-react'


// Este componente recibe los datos directamente del Server Component Padre
export default function DeviceTableContent({ devices }: { devices: Device[] }) {
	
	if (devices.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-xl'>Inventario de Dispositivos</CardTitle>
					<CardDescription>Gestión y monitoreo de dispositivos en red</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-center text-sm text-muted-foreground'>No se encontraron dispositivos en el inventario.</p>
				</CardContent>
			</Card>
		);
	}
	
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-xl'>Inventario de Dispositivos (Cargado en Servidor)</CardTitle>
				<CardDescription>Gestión y monitoreo de dispositivos en red</CardDescription>
			</CardHeader>
			<CardContent>
				{/* *** NOTA: Filtros y Dropdowns se gestionan en el Cliente (Paso 3) ***
                  La tabla aquí es SÓLO el marcado HTML con los datos inyectados.
                */}
				<div className='rounded-md border border-border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Equipo</TableHead>
								<TableHead>Modelo</TableHead>
								<TableHead>Usuario</TableHead>
								<TableHead>Correo</TableHead>
								<TableHead>Alias</TableHead>
								<TableHead>IP</TableHead>
								<TableHead>Estado de Conexión</TableHead>

								<TableHead className='text-right'>Acciones</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{devices.map((device) => (
								<TableRow key={device.id}>
									<TableCell>{device.modelo}</TableCell>
									<TableCell>{device.equipo}</TableCell>
									<TableCell className='font-medium'>{device.usuario}</TableCell>
									<TableCell>{device.correo}</TableCell>
									<TableCell>{device.aliasUsuario}</TableCell>
									<TableCell>{device.ip}</TableCell>

									<TableCell>
										{device.isConnected === true ? (
											<Badge
												variant='outline'
												className='border-green-500 text-green-500'
											>
												<Wifi className='mr-1 h-3 w-3' />
												Conectado
											</Badge>
										) : (
											<Badge
												variant='outline'
												className='border-red-500 text-red-500'
											>
												<WifiOff className='mr-1 h-3 w-3' />
												Desconectado
											</Badge>
										)}
									</TableCell>

									<TableCell className='text-right'>
										<ClientActionsMenu device={device} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
