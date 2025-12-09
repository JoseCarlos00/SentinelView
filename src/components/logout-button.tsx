'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth/logout';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutButton() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleLogout = async () => {
		setIsLoading(true);

		try {
			await logout();
			router.push('/login?message=logout_success');
			router.refresh();
		} catch (error) {
			console.error('Error en logout:', error);
			// Redirigir de todos modos
			router.push('/login?message=logout_success');
			router.refresh();
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant='ghost'
					size='sm'
					className='cursor-pointer'
				>
					<LogOut className='mr-2 h-4 w-4' />
					Cerrar Sesión
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
					<AlertDialogDescription>
						¿Estás seguro que deseas cerrar tu sesión? Tendrás que volver a iniciar sesión para acceder al sistema.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className='cursor-pointer' disabled={isLoading}>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleLogout}
						disabled={isLoading}
						className='cursor-pointer'
					>
						{isLoading ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Cerrando...
							</>
						) : (
							'Cerrar Sesión'
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
