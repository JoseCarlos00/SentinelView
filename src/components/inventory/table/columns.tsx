'use client';

import { Device } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

import DataTableColumnHeader from '@/components/inventory/table/data-table-header';
import ActionsMenu from './action-menu'

export const columns: ColumnDef<Device>[] = [
	{
		id: 'actions',
		cell: ({ row }) => <ActionsMenu row={row} />,
    enableHiding: false,
	},
	{
		accessorKey: 'isConnected',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Estatus' />
		),
		cell: ({ row }) => {
			const isConnected = row.original.isConnected;

			return isConnected === true ? (
				<Badge variant='outline' className='border-green-500 text-green-500'>
					<Wifi className='mr-1 h-3 w-3' />
				</Badge>
			) : (
				<Badge variant='outline' className='border-red-500 text-red-500 opacity-60'>
					<WifiOff className='mr-1 h-3 w-3' />
				</Badge>
			);
		},
		 enableHiding: false,
	},
	{
		accessorKey: 'equipo',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Equipo' />
		),
	},
	{
		accessorKey: 'modelo',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Modelo' />
		),
	},
	{
		accessorKey: 'usuario',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Usuario' />
		),
		cell: (props) => (
			<span className='font-medium'>{props.row.original.usuario}</span>
		)
	},
	{
		accessorKey: 'correo',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Correo' />
		),
	},
	{
		accessorKey: 'aliasUsuario',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Alias Usuario' />
		),
	},
	{
		accessorKey: 'ip',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='IP' />
		),
	},
];
