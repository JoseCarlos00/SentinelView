import { useAuth } from '@/hooks/use-auth';
import { refreshToken } from './auth'

export async function apiFetch(url: string, options: RequestInit = {}) {
	const { accessToken, setToken } = useAuth.getState();

	const res = await fetch(url, {
		...options,
		credentials: 'include',
		headers: {
			...(options.headers || {}),
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
	});

	// Si el token expiró, intentamos refresh
	if (res.status === 401) {
		const refreshed = await refreshToken();

		if (refreshed) {
			// reintentar original
			return fetch(url, {
				...options,
				credentials: 'include',
				headers: {
					...(options.headers || {}),
					Authorization: `Bearer ${useAuth.getState().accessToken}`,
					'Content-Type': 'application/json',
				},
			});
		}
	}

	return res;
}
