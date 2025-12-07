import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { refreshTokenOnServer } from './lib/server-utils';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from './lib/constants';

// Función para decodificar el payload de un JWT (sin verificar firma)
function getPayloadFromToken(token: string) {
	try {
		const payloadBase64 = token.split('.')[1];

		// 1. Decodifica la Base64 URL-safe. Reemplaza '-' por '+' y '_' por '/'
		// y añade el padding '=' si es necesario, para que Buffer lo decodifique correctamente.
		const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');

		// 2. Utiliza Buffer de Node.js para decodificar la Base64
		const decodedPayloadString = Buffer.from(base64, 'base64').toString('utf8');

		// 3. Parsea la cadena JSON
		const payload = JSON.parse(decodedPayloadString);

		return payload;
	} catch (error) {
		console.error('Error al decodificar el payload del token.', error);
		return null;
	}
}

// Lógica para la autenticación de PÁGINAS
async function handlePageAuth(request: NextRequest) {
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

	const payload = accessTokenValue ? getPayloadFromToken(accessTokenValue) : null;
	const isExpired = !payload || Date.now() >= payload.exp * 1000;

	// 3. Si el usuario tiene un access token y no está expirado, permitir el paso.
	if (accessTokenValue && !isExpired) {
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

			// 4b. Si el refresco es exitoso, preparamos la continuación de la petición.
			//     Primero, creamos una nueva cabecera para la petición que continuará al renderizado.
			const requestHeaders = new Headers(request.headers);
			requestHeaders.set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${newAccessToken}`);

			// Creamos una respuesta que continúa a la página solicitada, pero con las cabeceras de la petición actualizadas.
			const response = NextResponse.next({ request: { headers: requestHeaders } });

			// Adjuntamos a la RESPUESTA las cookies que el backend nos dio para que el NAVEGADOR se actualice.
			if (newCookies) { // newCookies contiene el string 'Set-Cookie' del backend
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

// Lógica para la autorización de RUTAS DE API
async function handleApiAuth(request: NextRequest) {
	const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

	if (!accessToken) {
		return NextResponse.json({ message: 'No autenticado: se requiere token de acceso.' }, { status: 401 });
	}


	const payload = getPayloadFromToken(accessToken);

	if (!payload || payload.role !== 'SUPER_ADMIN') {
		return NextResponse.json({ message: 'Acceso denegado: se requiere rol de SUPER_ADMIN.' }, { status: 403 });
	}

	return NextResponse.next();
}

// Esta es la función principal que Next.js ejecutará.
// Actúa como un despachador que decide qué lógica aplicar según la ruta.
export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Si la ruta es para la API de administración, aplica la lógica de autorización de API.
	if (pathname.startsWith('/api/admin')) {
		return handleApiAuth(request);
	}

	// Para el resto de rutas (páginas), aplica la lógica de autenticación de páginas.
	return handlePageAuth(request);
}

export const config = {
	matcher: [
		/*
		 * Coincide con todas las rutas excepto las de activos estáticos y la API de autenticación.
		 * - Primero, el negativo para las rutas que NO queremos que pasen por el middleware.
		 * - Segundo, el positivo para las rutas de API de admin que SÍ queremos proteger.
		 */
		'/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
		'/api/admin/:path*',
	],
};
