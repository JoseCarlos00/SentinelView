
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/login-form';
import { Wifi } from 'lucide-react';
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/constants";

export default async function HomePage() {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

	// // Si ya está autenticado, redirigir a dashboard
	// if (refreshToken) {
	// 	redirect('/dashboard');
	// }

	return (
		<div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-50'>
			<div className='w-full max-w-md px-6'>
				{/* Logo y Título */}
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg'>
						<Wifi className='h-8 w-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>RF Locator</h1>
					<p className='text-gray-600'>Sistema de Localización de Equipos RF</p>
				</div>

				{/* Formulario de Login */}
				<div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
					<h2 className='text-xl font-semibold text-gray-900 mb-6 text-center'>Iniciar Sesión</h2>
					<LoginForm />
				</div>

				{/* Footer */}
				<p className='text-center text-sm text-gray-500 mt-8'>
					¿Problemas para acceder?{' '}
					<a
						href='mailto:admin@tuempresa.com'
						className='text-blue-600 hover:underline'
					>
						Contacta soporte
					</a>
				</p>
			</div>
		</div>
	);
}
