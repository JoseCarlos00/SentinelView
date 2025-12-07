import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { REFRESH_TOKEN_COOKIE_NAME, ACCESS_TOKEN_COOKIE_NAME } from '@/lib/constants';
import { authLogger as logger } from '@/lib/logger';

export async function POST(_request: Request) {
	const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:9001';

	try {
		// 1. Obtener la cookie de refresco de la petición entrante.
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME);

		// 2. Reenviar la solicitud de logout al backend, incluyendo la cookie de refresco.
		const backendResponse = await fetch(`${BACKEND_URL}/api/auth/logout`, {
			method: 'POST',
			headers: {
				// Propagamos la cookie para que el backend sepa qué sesión invalidar.
				Cookie: refreshToken ? `${refreshToken.name}=${refreshToken.value}` : '',
			},
		});

		// 3. Si el backend responde con un error, lo propagamos.
		if (!backendResponse.ok) {
			logger.warn('El logout en el backend falló.', { status: backendResponse.status });
			return NextResponse.json(
				{ message: 'El logout en el backend falló' },
				{ status: backendResponse.status }
			);
		}

		// 4. El backend debería responder con una cabecera para eliminar las cookies.
		//    Creamos una respuesta para el cliente que replica esta acción.
		const response = NextResponse.json({ message: 'Logout exitoso' });
		response.cookies.delete(REFRESH_TOKEN_COOKIE_NAME);
		response.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);

		return response;
	} catch (error) {
		logger.error('Error en el proxy de logout:', { error });
		return NextResponse.json({ message: 'Error interno del servidor en el proxy de logout' }, { status: 500 });
	}
}
