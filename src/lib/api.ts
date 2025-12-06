import { useAuth } from '@/hooks/use-auth';
import { refreshToken } from './auth';

type ApiFetchOptions = RequestInit & {
	isRetry?: boolean; // Para evitar bucles de reintento infinitos
};

export async function apiFetch(url: string, options: ApiFetchOptions = {}): Promise<Response> {
	const { accessToken } = useAuth.getState();

	// Construir la URL completa si es una ruta relativa
	const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`;

	const res = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
			...(accessToken && { Authorization: `Bearer ${accessToken}` }),
		},
	});

	// Si el token expiró y no es un reintento, intentamos refrescarlo
	if (res.status === 401 && !options.isRetry) {
		const refreshed = await refreshToken();

		if (refreshed) {
			// Reintentar la petición original con la opción isRetry=true
			return apiFetch(url, { ...options, isRetry: true });
		}

		// Si el refresco falla, el usuario será deslogueado por la lógica en refreshToken()
		// Devolvemos la respuesta original 401 para que el ? código pueda manejarla si es necesario.
	}

	return res;
}
