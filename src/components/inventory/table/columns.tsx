'use client';

import { Device } from '@/types/devices';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import DataTableColumnHeader from '@/components/inventory/table/data-table-header';

export const columns: ColumnDef<Device>[] = [
	{
		id: 'actions',
		cell: ({ row }) => {
			const currentUser = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							className='h-8 w-8 p-0'
						>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(currentUser.macAddress)}>
							Copy MAC
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View customer</DropdownMenuItem>
						<DropdownMenuItem>View payment details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
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
