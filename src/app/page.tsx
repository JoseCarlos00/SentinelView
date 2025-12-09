import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/login-form';
import { Wifi } from 'lucide-react';
import { REFRESH_TOKEN_COOKIE_NAME } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function HomePage() {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

	// // Si ya está autenticado, redirigir a dashboard
	// if (refreshToken) {
	// 	redirect('/dashboard');
	// }

	return (
		<div className='min-h-screen flex items-center justify-center bg-background p-4'>
			{/* Fondo con gradiente sutil */}
			<div className='absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]'></div>

			<div className='w-full max-w-md'>
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-2xl mb-4 shadow-lg'>
						<Wifi className='h-8 w-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold text-foreground mb-2'>RF Locator</h1>
					<p className='text-muted-foreground'>Sistema de Localización de Equipos RF</p>
				</div>

				<Card>
					<CardHeader className='text-center'>
						<CardTitle>Iniciar Sesión</CardTitle>
					</CardHeader>
					<CardContent>
						<LoginForm />
					</CardContent>
				</Card>

				<p className='text-center text-sm text-muted-foreground mt-8'>
					¿Problemas para acceder?{' '}
					<a href='mailto:admin@tuempresa.com' className='text-primary hover:underline'>
						Contacta soporte
					</a>
				</p>
			</div>
		</div>
	);
}
