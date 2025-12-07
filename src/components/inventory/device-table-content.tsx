'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {  MoreVertical, } from 'lucide-react';
import { Device } from '@/types/devices'


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
						<TableHeader>{/* ... (TableHead con tus encabezados) ... */}</TableHeader>
						<TableBody>
							{devices.map((device) => (
								<TableRow key={device.id}>
									<TableCell className='font-medium'>{device.alias}</TableCell>
									{/* ... (Otras celdas) ... */}
									<TableCell className='text-right'>
										{/* !!! EXCEPCIÓN IMPORTANTE !!!
                                            Los botones interactivos deben ser Client Components.
                                            Pasa funciones o callbacks si necesitas disparar una acción.
                                        */}
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

// Para que las acciones del menú funcionen (Ping/Alarma), estas deben ser
// *otro* Client Component anidado, importado en el Server Component.
// Este pequeño componente manejará el estado y las llamadas de acción.
const ClientActionsMenu = ({ device }: { device: Device }) => {
	// ESTE COMPONENTE DEBE TENER 'use client' si manejas el click o el estado del Dropdown
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='sm'
				>
					<MoreVertical className='h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => alert(`Enviando PING a ${device.alias}`)}>Enviar PING</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

// Si ClientActionsMenu es un componente aparte, debe tener su propio 'use client'
