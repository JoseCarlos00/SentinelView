import { useAuth } from '@/hooks/use-auth';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/lib/constants';
import Cookies from 'js-cookie';
import { logClient } from '@/lib/client-logger';

export async function logout() {
	try {
		await fetch('/api/auth/logout', {
			method: 'POST',
		});
	} catch (error) {
		logClient('error', 'La llamada al endpoint de logout falló', {
			error: error instanceof Error ? error.message : String(error),
		});
	} finally {
		useAuth.getState().setToken(null);
		Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
		Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
	}
}
