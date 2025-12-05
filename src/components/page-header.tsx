import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity, LogOut } from 'lucide-react';

export default function InventoryHeader({ currentUser }: { currentUser: { name: string; role: string } }) {
	return (
		<header className='flex h-16 items-center border-b border-border bg-card px-6'>
			<div className='flex items-center justify-between px-6 py-4 w-full max-w-7xl mx-auto'>
				<div className='flex items-center gap-3'>
					<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
						<Activity className='h-6 w-6 text-primary-foreground' />
					</div>
					<h1 className='text-2xl font-semibold text-foreground'>AlertScanner Control</h1>
				</div>

				<div className='flex items-center gap-4'>
					<div className='text-right'>
						<p className='text-sm text-muted-foreground'>Usuario</p>
						<p className='text-sm font-medium text-foreground'>
							{currentUser.name} · {currentUser.role}
						</p>
					</div>
					<Button
						variant='outline'
						size='sm'
					>
						<LogOut className='mr-2 h-4 w-4' />
						Cerrar Sesión
					</Button>
				</div>
			</div>
		</header>
	);
}
