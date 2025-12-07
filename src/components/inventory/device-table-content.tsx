'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Device } from '@/types/devices'

import { columns, DeviceTable } from '@/components/inventory/table/columns';
import { DataTable } from '@/components/inventory/table/data-table';


// Este componente recibe los datos directamente del Server Component Padre
export default function DeviceTableContent({ devices }: { devices: Device[] }) {
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');

	// Filter devices
	const filteredDevices = devices.filter((device) => {
		const lowerCaseSearchTerm = searchTerm.toLowerCase();
		const matchesSearch =
			device.usuario.toLowerCase().includes(lowerCaseSearchTerm) ||
			device.ip.includes(searchTerm) ||
			(device.aliasUsuario && device.aliasUsuario.toLowerCase().includes(lowerCaseSearchTerm)) ||
			device.equipo.toLowerCase().includes(lowerCaseSearchTerm);
		const status = device.isConnected ? 'connected' : 'disconnected';
		const matchesStatus = statusFilter === 'all' || status === statusFilter;
		return matchesSearch && matchesStatus;
	});

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
				<CardDescription>Gestión y monitoreo de dispositivos en red</CardDescription>
				{/* Filters and Search */}
				<div className='mb-4 flex gap-4'>
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							placeholder='Buscar por nombre o IP...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='pl-10'
						/>
					</div>

					<Select
						value={statusFilter}
						onValueChange={setStatusFilter}
					>
						<SelectTrigger className='w-48'>
							<SelectValue placeholder='Filtrar por estado' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Todos los estados</SelectItem>
							<SelectItem value='connected'>Conectados</SelectItem>
							<SelectItem value='disconnected'>Desconectados</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				{/* Device Table */}
				<div className='rounded-md border border-border max-h-[60vh] overflow-x-hidden overflow-y-auto'>
					<DataTable columns={columns} data={filteredDevices} />
				</div>
			</CardContent>
		</Card>
	);
}
