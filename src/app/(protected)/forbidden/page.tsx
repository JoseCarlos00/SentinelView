import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function ForbiddenPage() {
	return (
		<div className='flex h-full flex-col items-center justify-center space-y-4 text-center'>
			<AlertTriangle className='h-16 w-16 text-yellow-500' />
			<h1 className='text-3xl font-bold text-foreground'>Acceso Denegado</h1>
			<p className='text-muted-foreground'>No tienes los permisos necesarios para ver esta página.</p>
			<Link href='/' className='text-sm text-primary hover:underline'>
				Volver al Dashboard
			</Link>
		</div>
	);
}
