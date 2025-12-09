import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { apiLogger as logger } from '@/lib/logging/logger';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/lib/constants';

import { UserRole } from '@/lib/auth/roles';

import { getUserFromToken } from '@/proxy/utils';
import { ROLE_PROTECTED_ROUTES, PUBLIC_PATHS } from '@/proxy/constants';


/**
 * Verifica si una ruta requiere un rol específico y si el usuario tiene permiso.
 */
function checkRoutePermission(pathname: string, userRole: UserRole): { isProtected: boolean; hasAccess: boolean; } {
	// Buscar si la ruta coincide con alguna ruta protegida
	const protectedRoute = ROLE_PROTECTED_ROUTES.find((route) => pathname.startsWith(route.path));

	// Si no está en rutas protegidas, permitir acceso por defecto
	if (!protectedRoute) {
		return { isProtected: false, hasAccess: true };
	}

	// Verificar si el rol del usuario está en la lista de roles permitidos
	const hasAccess = protectedRoute.allowedRoles.includes(userRole);

	return { isProtected: true, hasAccess };
}

/**
 * Verifica si una ruta es pública (no requiere autenticación).
 */
function isPublicPath(pathname: string): boolean {
	return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}



async function handlePageAuth(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;
	const accessTokenValue = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const refreshTokenValue = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

	// 1. Si el usuario está autenticado y va a /login (sin error), redirigir a raíz
	if (refreshTokenValue && pathname === '/login' && !searchParams.has('error')) {
		logger.info('Usuario autenticado intenta acceder a /login, redirigiendo a /');
		return NextResponse.redirect(new URL('/', request.url));
	}
	
	// 2. Si el usuario no está autenticado y no está en página pública, redirigir a /login
	if (!refreshTokenValue && !isPublicPath(pathname)) {
		logger.info('Usuario no autenticado intenta acceder a ruta protegida', { pathname });
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// 3. Si el usuario está autenticado, verificar permisos de rol
	if (accessTokenValue) {
		const payload = getUserFromToken(accessTokenValue);

		if (!payload) {
			logger.warn('Token de acceso inválido, redirigiendo a /login');
			return NextResponse.redirect(new URL('/login', request.url));
		}

		const { isProtected, hasAccess } = checkRoutePermission(pathname, payload.role);

		if (isProtected && !hasAccess) {
			logger.warn('Acceso denegado por rol', {
				pathname,
				userRole: payload.role,
				username: payload.username,
			});

			// Redirigir a página de acceso denegado
			return NextResponse.redirect(new URL('/forbidden', request.url));
		}

		// Si tiene acceso, agregar información del usuario al header (opcional)
		const response = NextResponse.next();
		response.headers.set('X-User-Role', payload.role);
		response.headers.set('X-User-Id', payload.id);

		return response;
	}

	return NextResponse.next();
}


async function handleApiAuth(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

	// 1. Verificar que existe el token
	if (!accessToken) {
		logger.warn('API: No se proporcionó token de acceso', { pathname });
		return NextResponse.json(
			{
				success: false,
				message: 'No autenticado: se requiere token de acceso.',
				error: 'UNAUTHORIZED',
			},
			{ status: 401 }
		);
	}

	// 2. Decodificar token
	const payload = getUserFromToken(accessToken);

	if (!payload) {
		logger.warn('API: Token inválido', { pathname });
		return NextResponse.json(
			{
				success: false,
				message: 'Token inválido.',
				error: 'INVALID_TOKEN',
			},
			{ status: 401 }
		);
	}

	// 3. Verificar permisos de rol para la ruta de API
	const { isProtected, hasAccess } = checkRoutePermission(pathname, payload.role);

	if (isProtected && !hasAccess) {
		logger.warn('API: Acceso denegado por rol', {
			pathname,
			userRole: payload.role,
			username: payload.username,
		});

		return NextResponse.json(
			{
				success: false,
				message: `Acceso denegado: se requiere uno de los siguientes roles: ${ROLE_PROTECTED_ROUTES.find((r) =>
					pathname.startsWith(r.path)
				)?.allowedRoles.join(', ')}`,
				error: 'FORBIDDEN',
				currentRole: payload.role,
			},
			{ status: 403 }
		);
	}

	// 4. Si tiene acceso, agregar información del usuario al request
	const response = NextResponse.next();
	response.headers.set('X-User-Role', payload.role);
	response.headers.set('X-User-Id', payload.id);
	response.headers.set('X-Username', payload.username);

	return response;
}


export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// 1. Permitir acceso sin verificación a rutas públicas
	if (isPublicPath(pathname)) {
		return NextResponse.next();
	}

	// 2. Rutas de API -> Lógica de autorización de API
	if (pathname.startsWith('/api/')) {
		return handleApiAuth(request);
	}

	// 3. Rutas de páginas -> Lógica de autenticación de páginas
	return handlePageAuth(request);
}

export const config = {
	matcher: [
		// Ejecuta el proxy en todas las rutas excepto archivos estáticos
		'/((?!_next/static|_next/image|favicon.ico).*)',
	],
};
