import { useAuth } from '@/hooks/use-auth';

export async function logout() {
	try {
		// 1. Llama al backend para que elimine las cookies httpOnly.
		// Es importante incluir 'credentials' para que la cookie de sesión viaje.
		await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001'}/api/auth/logout`, {
			method: 'POST',
			credentials: 'include',
		});
	} catch (error) {
		console.error('La llamada al endpoint de logout falló, pero se procederá con la limpieza local:', error);
	} finally {
		// 2. Limpia el estado de Zustand, sin importar si la llamada al backend falló.
		useAuth.getState().setToken(null);
	}
}

