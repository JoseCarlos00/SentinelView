'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Device } from '@/types/devices';

export type DeviceTable = Omit<Device, 'id' | 'macAddress' | 'androidId'>;

export const columns: ColumnDef<DeviceTable>[] = [
	{
		accessorKey: 'isConnected',
		header: 'Conectado',
	},
	{
		accessorKey: 'equipo',
		header: 'Equipo',
	},
	{
		accessorKey: 'modelo',
		header: 'Modelo',
	},
	{
		accessorKey: 'usuario',
		header: 'Usuario',
	},
	{
		accessorKey: 'correo',
		header: 'Correo',
	},
	{
		accessorKey: 'aliasUsuario',
		header: 'Alias Usuario',
	},
	{
		accessorKey: 'ip',
		header: 'IP',
	},
];
