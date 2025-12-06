import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { refreshTokenOnServer } from './lib/server-utils';
import { REFRESH_TOKEN_COOKIE_NAME, ACCESS_TOKEN_COOKIE_NAME } from './lib/constants';
 
// Función para verificar si un token está expirado (simplificada)
function isTokenExpired(token: string): boolean {
	try {
		const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
		// Compara la fecha de expiración (en segundos) con la fecha actual.
		return Date.now() >= payload.exp * 1000;
	} catch {
		return true;
	}
}

export async function proxy(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;

	const accessTokenValue = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const refreshTokenValue = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

	// 1. Si el usuario está autenticado (tiene refresh token) y va a /login, redirigir a la raíz.
	//    Se excluye si viene de un error para evitar bucles.
	if (refreshTokenValue && pathname === '/login' && !searchParams.has('error')) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	// 2. Si el usuario no está autenticado (no tiene refresh token) y no está en /login, redirigir a /login.
	if (!refreshTokenValue && pathname !== '/login') {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// 3. Si el usuario tiene un access token y no está expirado, permitir el paso.
	if (accessTokenValue && !isTokenExpired(accessTokenValue)) {
		return NextResponse.next();
	}

	// 4. Si el usuario tiene un refresh token pero el access token falta o ha expirado, intentar refrescarlo.
	if (refreshTokenValue) {
		try {
			const { newAccessToken, newCookies } = await refreshTokenOnServer();

			// 4a. Si el refresco falla (token de refresco inválido), redirigir a login y limpiar cookies.
			if (!newAccessToken) {
				const response = NextResponse.redirect(new URL('/login?error=session_expired', request.url));
				response.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);
				response.cookies.delete(REFRESH_TOKEN_COOKIE_NAME);
				return response;
			}

			// 4b. Si el refresco es exitoso, continuar la petición original.
			//     La respuesta adjuntará las nuevas cookies que nos dio el backend.
			const response = NextResponse.next();
			if (newCookies) {
				response.headers.set('Set-Cookie', newCookies);
			}
			return response;
		} catch (error) {
			console.error('Error en el proxy al intentar refrescar el token:', error);
			// En caso de un error inesperado, es más seguro redirigir al login.
			return NextResponse.redirect(new URL('/login?error=proxy_error', request.url));
		}
	}
	
	return NextResponse.next();
}

// 5. Configuración del Matcher
// Esto define en qué rutas se ejecutará el middleware.
export const config = {
	matcher: [
		/*
		 * Coincide con todas las rutas de petición excepto las que empiezan por:
		 * - api (rutas de API)
		 * - _next/static (archivos estáticos)
		 * - _next/image (imágenes optimizadas)
		 * - favicon.ico (icono de la página)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
