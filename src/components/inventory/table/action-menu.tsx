'use client';

import { HTMLAttributes } from 'react';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Ellipsis } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Device } from '@/types/devices';

interface ActionsMenuProps<TValue> extends HTMLAttributes<HTMLDivElement> {
	row: Row<TValue>;
}

export default function ActionsMenu<TValue>({ row }: ActionsMenuProps<TValue>) {
	const currentUser = row.original as Device;
	
	if (!currentUser.androidId) {
		return (
			<span className='inline-flex items-center justify-center size-8 opacity-50'>
				<Ellipsis className='size-4' />
			</span>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='h-8 w-8 p-0'
				>
					<span className='sr-only'></span>
					<MoreHorizontal className='h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			
			<DropdownMenuContent align='end'>
				<DropdownMenuItem>Ping</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Alerta</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Mensaje</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
