'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Search, WifiIcon, WifiOffIcon } from 'lucide-react';

import { Device } from '@/types/devices'
import { columns as deviceColumns } from '@/components/inventory/table/columns';
import  DataTable  from '@/components/inventory/table/data-table';
import DataTableViewOptions from '@/components/inventory/table/data-table-view-options';



// Este componente recibe los datos directamente del Server Component Padre
export default function DeviceTableContent({ devices }: { devices: Device[] }) {
		const [sorting, setSorting] = useState<SortingState>([]);
		const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
		const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
		const [globalFilter, setGlobalFilter] = useState('');
		
		const columns = useMemo<ColumnDef<Device>[]>(() => deviceColumns, []);

		const table = useReactTable({
			data: devices,
			columns,
			onSortingChange: setSorting,
			onColumnFiltersChange: setColumnFilters,
			onColumnVisibilityChange: setColumnVisibility,
			onGlobalFilterChange: setGlobalFilter,
			getCoreRowModel: getCoreRowModel(),
			getSortedRowModel: getSortedRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			state: { sorting, columnFilters, columnVisibility, globalFilter },
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

				<div className='mb-4 flex gap-4'>
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							placeholder='Filtrar tabla...'
							value={globalFilter ?? ''}
							onChange={(event) => setGlobalFilter(event.target.value)}
							className='pl-10'
						/>
					</div>

					<Select
						value={
							// Mapeamos el valor booleano del filtro de vuelta a un string para el Select
							(table.getColumn('isConnected')?.getFilterValue() === true && 'Conectado') ||
							(table.getColumn('isConnected')?.getFilterValue() === false && 'Desconectado') ||
							'all'
						}
						onValueChange={(value) => {
							const filterValue = value === 'Conectado' ? true : value === 'Desconectado' ? false : null;
							table.getColumn('isConnected')?.setFilterValue(filterValue);
						}}
					>
						<SelectTrigger className='w-48'>
							<SelectValue placeholder='Filtrar por estado' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>
								<WifiIcon />
								Todos 
							</SelectItem>
							<SelectItem value='Conectado'>
								<WifiIcon />
								Conectados
								</SelectItem>
							<SelectItem value='Desconectado'>
								<WifiOffIcon />
								Desconectados
								</SelectItem>
						</SelectContent>
					</Select>
					
					<DataTableViewOptions table={table} />
				</div>
			</CardHeader>
			<CardContent>
				<div className='rounded-md border border-border max-h-[60vh] overflow-x-hidden overflow-y-auto'>
					<DataTable
						columns={columns}
						table={table}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
