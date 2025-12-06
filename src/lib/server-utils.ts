import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Device } from '@/types/devices';

/**
 * Intenta refrescar el Access Token en el servidor.
 * Asume que el backend espera el Refresh Token en una cookie HttpOnly.
 * @returns El nuevo accessToken si el refresco es exitoso, o null si falla.
 */
async function refreshTokenOnServer(): Promise<string | null> {
	const cookieStore = await cookies();
	const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

	// Next.js 'fetch' en el servidor no envía cookies automáticamente.
	// Debemos pasarlas manualmente para que el backend pueda validar el refresh token.
	const requestHeaders = new Headers();
	const refreshTokenCookie = cookieStore.get('jwt-refresh-token'); // Nombre de la cookie del refresh token
	if (refreshTokenCookie) {
		requestHeaders.set('Cookie', `${refreshTokenCookie.name}=${refreshTokenCookie.value}`);
	}

	try {
		const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
			method: 'POST',
			headers: requestHeaders,
		});

		if (!res.ok) return null;

		const data = await res.json();
		const newAccessToken = data.accessToken;

		// Actualiza la cookie del access token para las siguientes peticiones en el servidor
		cookieStore.set('jwt-access-token', newAccessToken, { path: '/' });

		return newAccessToken;
	} catch (error) {
		console.error('Server-side refresh token failed:', error);
		return null;
	}
}

/** * Función ASÍNCRONA para obtener el inventario de la API.
 * Aquí puedes usar claves secretas sin exponerlas al cliente.
 */
export async function fetchInventoryData(accessToken: string): Promise<Device[]> {
	const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

	const fetchWithToken = async (token: string) => {
		return await fetch(`${BACKEND_URL}/api/inventory/devices`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`, // Token seguro
				'Content-Type': 'application/json',
			},
			// Desactiva el cache para datos operativos en tiempo real (opcional)
			cache: 'no-store',
		});
	};

	let response = await fetchWithToken(accessToken);

	if (response.status === 401) {
		console.log('Access token expired. Attempting to refresh on the server...');
		const newAccessToken = await refreshTokenOnServer();

		if (newAccessToken) {
			console.log('Token refreshed successfully. Retrying original request...');
			response = await fetchWithToken(newAccessToken);
		} else {
			console.log('Failed to refresh token. Redirecting to login.');
			redirect('/login?expired=true');
		}
	}

	try {
		if (!response.ok) {
			throw new Error(`Fallo al obtener datos: ${response.status}`);
		}

		return response.json();
	} catch (error) {
		console.error('Error fetching inventory:', error);
		// En caso de error, devuelve un array vacío o datos mock de seguridad
		return [];
	}
}

export async function fetchInventoryDataTest(accessToken: string): Promise<Device[]> {
	try {
		return [
			{ id: '1', alias: 'Router Principal', ip: '192.168.1.1', status: 'connected', userRole: 'ADMIN' },
			{ id: '2', alias: 'Switch Core', ip: '192.168.1.10', status: 'connected', userRole: 'OPERATOR' },
			{ id: '3', alias: 'Firewall Gateway', ip: '192.168.1.254', status: 'disconnected', userRole: 'SUPER_ADMIN' },
			{ id: '4', alias: 'AP Oficina Norte', ip: '192.168.2.1', status: 'connected', userRole: 'OPERATOR' },
			{ id: '5', alias: 'AP Oficina Sur', ip: '192.168.2.2', status: 'disconnected', userRole: 'OPERATOR' },
			{ id: '6', alias: 'Server Backup', ip: '192.168.3.50', status: 'connected', userRole: 'ADMIN' },
		];
	} catch (error) {
		console.error('Error fetching inventory:', error);
		// En caso de error, devuelve un array vacío o datos mock de seguridad
		return [];
	}
}

/** * Función para obtener el token de la cookie (Asume que usas un token de sesión/JWT en cookies).
 * Alternativamente, podrías obtenerlo del AuthContext si usaras sólo un Client Component para todo.
 */
export async function getAuthDataFromServer() {
	const cookieStore = await cookies();
	let accessToken = cookieStore.get('jwt-access-token')?.value;

	// Si no hay Access Token, intenta refrescarlo en el servidor.
	// Esto es crucial para la primera carga después del login.
	if (!accessToken) {
		console.log('No access token found, attempting server-side refresh...');
		const newAccessToken = await refreshTokenOnServer();
		if (newAccessToken) {
			console.log('Server-side refresh successful.');
			accessToken = newAccessToken;
		}
	}

	// Si después de intentar el refresco, seguimos sin token, redirigimos al login.
	// Esto cubre sesiones expiradas o inválidas.
	if (!accessToken) {
		redirect('/login'); // Redirige si no hay token (aunque el middleware debería hacerlo)
	}

	// Decodificar el nuevo token (sin validarlo, sólo leer payload)
	const decoded = JSON.parse(atob(accessToken.split('.')[1]));

	return { accessToken: accessToken, currentUser: { username: decoded.username, role: decoded.role, id: decoded.id } };
}
