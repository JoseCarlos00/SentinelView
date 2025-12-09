import { logClient } from '@/lib/logging/client-logger';
import { useUser } from '@/hooks/use-user';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Cierra sesión del usuario
 * Las cookies httpOnly se limpian automáticamente por el backend
 */
export async function logout(): Promise<void> {
	try {
		const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
			method: 'POST',
			credentials: 'include', // ⭐ Esto envía las cookies automáticamente
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			logClient('warn', 'El backend respondió con error en logout', {
				status: response.status,
			});
		}

		logClient('info', 'Logout exitoso');
	} catch (error) {
		logClient('error', 'Error en llamada a logout, limpiando estado local', { error });
	} finally {
		useUser.setState({ user: null });
		logClient('info', 'Estado local limpiado');
	}
}
