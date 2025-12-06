import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
	const refreshToken = req.cookies.get('refreshToken'); // Usar el refresh token como señal de sesión
	const { pathname } = req.nextUrl;

	// Si el usuario no tiene refresh token y no está en el login, redirigir
	if (!refreshToken && pathname !== '/login') {
		const loginUrl = new URL('/login', req.url);
		return NextResponse.redirect(loginUrl);
	}

	// Si el usuario tiene un token pero intenta acceder al login, redirigir al dashboard
	if (refreshToken && pathname === '/login') {
		return NextResponse.redirect(new URL('/', req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Coincide con todas las rutas de petición excepto las que empiezan por:
		 * - api (rutas de API)
		 * - _next/static (archivos estáticos)
		 * - _next/image (optimización de imágenes)
		 * - favicon.ico (archivo de favicon)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
