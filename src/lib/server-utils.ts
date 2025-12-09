import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { Device } from '@/types/devices';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from './constants';
import { apiLogger, authLogger as logger } from './logging/logger';

interface RefreshResult {
	newAccessToken: string | null;
	newCookies: string | null; // Para almacenar el encabezado 'set-cookie'
}


export async function refreshTokenOnServer(): Promise<RefreshResult> {
	const cookieStore = await cookies();
	const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:9001';

	const requestHeaders = new Headers();
	const refreshTokenCookie = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME);

	if (refreshTokenCookie) {
		requestHeaders.set('Cookie', `${refreshTokenCookie.name}=${refreshTokenCookie.value}`);
	} else {
		// Si no hay refresh token, no hay nada que hacer.
		return { newAccessToken: null, newCookies: null };
	}

	try {
		const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
			method: 'POST',
			headers: requestHeaders,
		});

		if (!res.ok) {
			logger.warn('Fallo al refrescar el token en el servidor. El backend respondió con:', { status: res.status });
			// No intentamos borrar cookies aquí. Simplemente notificamos el fallo.
			// El middleware se encargará de la redirección y la limpieza de cookies.
			return { newAccessToken: null, newCookies: null };
		}

		const data = await res.json();
		const newAccessToken = data.accessToken;

		// ¡Este es el cambio clave!
		// Capturamos los encabezados 'set-cookie' de la respuesta del backend.
		// Pueden ser múltiples, por lo que los manejamos como un array.
		const newCookiesHeader = res.headers.getSetCookie();

		// Ya no establecemos la cookie manualmente aquí.
		// Devolvemos el token y los encabezados para que el llamador (middleware) los gestione.
		return {
			newAccessToken: newAccessToken,
			newCookies: newCookiesHeader.length > 0 ? newCookiesHeader.join(', ') : null,
		};
	} catch (error) {
		logger.error('El refresco de token en el servidor falló por una excepción.', { error });
		return { newAccessToken: null, newCookies: null };
	}
}

/** * Función ASÍNCRONA para obtener el inventario de la API.
 * Aquí puedes usar claves secretas sin exponerlas al cliente.
 */
export async function fetchInventoryData(accessToken: string): Promise<Device[]> {
	const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:9001';
	// El proxy ya ha garantizado que el accessToken es válido.
	// No necesitamos la lógica de reintento aquí.
	const response = await fetch(`${BACKEND_URL}/api/inventory/devices`, {
		headers: { Authorization: `Bearer ${accessToken}` },
		cache: 'no-store',
	});

	try {
		if (!response.ok) {
			throw new Error(`Fallo al obtener datos: ${response.status}`);
		}

		return response.json();
	} catch (error) {
		apiLogger.error('Error al obtener el inventario.', { error });
		// En caso de error, devuelve un array vacío o datos mock de seguridad
		return [];
	}
}

/** * Función para obtener el token de la cookie (Asume que usas un token de sesión/JWT en cookies).
 * Alternativamente, podrías obtenerlo del AuthContext si usaras sólo un Client Component para todo.
 */
export const getAuthDataFromServer = cache(async () => {
	const cookieStore = await cookies();
	// El proxy ya ha garantizado que el token existe y es válido.
	// Simplemente lo leemos.
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

	// Si por alguna razón extrema el token no está (lo cual no debería pasar
	// si el proxy funciona), redirigimos. Esto es una salvaguarda.
	if (!accessToken) {
		logger.error('getAuthDataFromServer: No se encontró accessToken después del chequeo del proxy. Redirigiendo.');
		redirect('/login?error=session_expired');
	}

	// Decodificar el nuevo token (sin validarlo, sólo leer payload)
	const decoded = JSON.parse(atob(accessToken.split('.')[1]));

	return { accessToken: accessToken, currentUser: { username: decoded.username, role: decoded.role, id: decoded.id } };
});
