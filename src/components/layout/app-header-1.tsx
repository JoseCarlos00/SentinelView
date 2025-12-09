'use client';

import { Button } from '@/components/ui/button';
import { Activity, LogOut } from 'lucide-react';
import { logout } from '@/lib/auth/logout';
import { useRouter } from 'next/navigation';

export default function InventoryHeader({ currentUser }: { currentUser: { username: string; role: string } }) {
	const router = useRouter();

	const handleClickLogout = async () => {
		// 1. Llama a la función centralizada de logout.
		await logout();

		// 2. Redirige al usuario a la página de login con un mensaje de éxito.
		router.push('/login?message=logout_success');
		router.refresh();
	};


	return (
		<header className='flex h-16 items-center border-b border-border bg-card pl-12 px-6'>
			<div className='flex items-center justify-between max-sm:px-6 py-4 w-full max-w-7xl mx-auto'>
				<div className='flex items-center gap-3'>
					<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
						<Activity className='h-6 w-6 text-primary-foreground' />
					</div>
					<h1 className='text-2xl font-semibold text-foreground hidden sm:block'>AlertScanner Control</h1>
				</div>

				<div className='flex items-center gap-4'>
					<div className='text-right'>
						<p className='text-sm text-muted-foreground'>Usuario</p>
						<p className='text-sm font-medium text-foreground'>
							{currentUser.username} <span className='hidden sm:inline'>· {currentUser.role}</span>
						</p>
					</div>
					<Button
						onClick={handleClickLogout}
						variant='outline'
						size='sm'
						className='cursor-pointer'
					>
						<LogOut className='mr-2 h-4 w-4' />
						<span className='hidden sm:inline'>Cerrar Sesión</span>
					</Button>
				</div>
			</div>
		</header>
	);
}
