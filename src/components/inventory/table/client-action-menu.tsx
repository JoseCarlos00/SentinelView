'use client'

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {  MoreVertical, } from 'lucide-react';

import { Device } from '@/types/devices';

interface ClientActionsMenuProps {
  device: Device;
}

export default function ClientActionsMenu ({ device }: ClientActionsMenuProps) {
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
				<DropdownMenuItem onClick={() => alert(`Enviando PING a ${device.usuario}`)}>Enviar PING</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
