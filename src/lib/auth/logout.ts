import { useAuth } from '@/store/use-auth';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/lib/constants';
import Cookies from 'js-cookie';
import { logClient } from '@/lib/logging/client-logger';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:9001';

export async function logout() {
	try {
		await fetch(`${BACKEND_URL}/api/auth/logout`, {
			method: 'POST',
			credentials: 'include', // IMPORTANTE para que la cookie viaje
			headers: {
				Cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${Cookies.get(REFRESH_TOKEN_COOKIE_NAME)}`,
			},
			keepalive: true, // Asegura que la petición se complete incluso si la página se cierra
		});
	} catch (error) {
		logClient('error', 'La llamada al endpoint de logout falló', { error });
	} finally {
		useAuth.getState().setToken(null);
		Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
		Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
	}
}
