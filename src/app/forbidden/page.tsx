// app/forbidden/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ForbiddenPage() {
	const router = useRouter();
	const [countdown, setCountdown] = useState(10);

	useEffect(() => {
		// Contador regresivo
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					router.push('/dashboard');
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [router]);

	const handleGoBack = () => {
		router.back();
	};

	const handleGoHome = () => {
		router.push('/dashboard');
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-red-100'>
			<div className='max-w-md w-full mx-4'>
				<div className='bg-white rounded-2xl shadow-xl p-8 text-center'>
					{/* Icono de advertencia */}
					<div className='mb-6'>
						<div className='mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center'>
							<svg
								className='w-12 h-12 text-red-600'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
								/>
							</svg>
						</div>
					</div>

					{/* Título y mensaje */}
					<h1 className='text-3xl font-bold text-gray-900 mb-3'>Acceso Denegado</h1>
					<p className='text-gray-600 mb-2'>No tienes permisos suficientes para acceder a esta página.</p>
					<p className='text-sm text-gray-500 mb-8'>Si crees que esto es un error, contacta a tu administrador.</p>

					{/* Contador regresivo */}
					<div className='mb-8 p-4 bg-red-50 rounded-lg'>
						<p className='text-sm text-gray-600'>Serás redirigido al dashboard en:</p>
						<p className='text-4xl font-bold text-red-600 mt-2'>{countdown}s</p>
					</div>

					{/* Botones de acción */}
					<div className='space-y-3'>
						<button
							onClick={handleGoHome}
							className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg'
						>
							🏠 Ir al Dashboard
						</button>
						<button
							onClick={handleGoBack}
							className='w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200'
						>
							← Volver Atrás
						</button>
					</div>

					{/* Información adicional */}
					<div className='mt-8 pt-6 border-t border-gray-200'>
						<p className='text-xs text-gray-500'>¿Necesitas acceso? Contacta a:</p>
						<p className='text-sm font-semibold text-gray-700 mt-1'>admin@tuempresa.com</p>
					</div>
				</div>
			</div>
		</div>
	);
}
