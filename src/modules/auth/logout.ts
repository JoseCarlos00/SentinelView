import { useAuth } from '@/hooks/use-auth';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/lib/constants';
import Cookies from 'js-cookie';

export async function logout() {
	try {
		// 1. Llama a nuestro propio endpoint de API (proxy) para cerrar la sesión.
		// Este se encargará de comunicarse con el backend de forma segura.
		await fetch('/api/auth/logout', {
			method: 'POST',
		});
	} catch (error) {
		console.error('La llamada al endpoint de logout falló, pero se procederá con la limpieza local:', error);
	} finally {
		// 2. Limpieza en el cliente (siempre se ejecuta):
		// a. Limpia el token del estado de Zustand.
		useAuth.getState().setToken(null);

		// b. Elimina las cookies accesibles desde el cliente como fallback.
		// Esto es útil si la llamada al backend falla o para una limpieza inmediata.
		Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
		// Aunque la refresh token es HttpOnly, intentar removerla no causa daño.
		Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
	}
}
