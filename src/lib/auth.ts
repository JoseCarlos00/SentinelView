import { useAuth } from '@/store/use-auth';
import { apiFetch } from './api';

function deleteClientCookies() {
	// Esto ayuda a limpiar el estado en el cliente si el refresh falla.
	document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export async function refreshToken() {
	try {
	const res = await apiFetch('/api/auth/refresh', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!res.ok) {
		useAuth.getState().setToken(null);
		deleteClientCookies();
		return false;
	}

	const data = await res.json();
	useAuth.getState().setToken(data.accessToken);
	return true;
	} catch (error) {
		useAuth.getState().setToken(null);
		deleteClientCookies();
		return false;
	}
}
