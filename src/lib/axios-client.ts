import axios from 'axios';

// ⭐ Esta instancia SOLO se usa en 'use client' components
const apiClient = axios.create({
	baseURL: 'http://192.168.1.7:9001',
	withCredentials: true, // Enviar cookies automáticamente
	timeout: 10000,
});

// Estado para evitar múltiples refreshes simultáneos
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: any) => void;
	reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((promise) => {
		if (error) {
			promise.reject(error);
		} else {
			promise.resolve(token);
		}
	});

	failedQueue = [];
};

// ⭐ INTERCEPTOR DE RESPUESTA (maneja 401 automáticamente)
apiClient.interceptors.response.use(
	// Si la respuesta es exitosa, devolverla tal cual
	(response) => response,

	// Si hay error, verificar si es 401 (token expirado)
	async (error) => {
		const originalRequest = error.config;

		// Si es 401 (Unauthorized) y no hemos intentado refrescar
		if (error.response?.status === 401 && !originalRequest._retry) {
			// Si ya hay un refresh en proceso, esperar
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => {
						// Cuando el refresh termine, reintentar request original
						return apiClient(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			// Marcar que vamos a intentar refresh
			originalRequest._retry = true;
			isRefreshing = true;

			console.log('[Axios Interceptor] Token expirado, refrescando...');

			try {
				// ⭐ Llamar al endpoint de refresh
				// Las cookies se envían automáticamente (withCredentials: true)
				const refreshResponse = await axios.post('http://192.168.1.7:9001/auth/refresh', {}, { withCredentials: true });

				if (refreshResponse.status === 200) {
					console.log('[Axios Interceptor] Refresh exitoso ✅');

					// Nuevo access token ya está en cookie (httpOnly)
					// No necesitamos hacer nada más

					// Procesar requests en cola
					processQueue(null, 'success');

					// ⭐ Reintentar el request original
					return apiClient(originalRequest);
				}
			} catch (refreshError) {
				console.error('[Axios Interceptor] Refresh falló:', refreshError);

				// Refresh falló → procesar cola con error
				processQueue(refreshError, null);

				// Redirigir a login
				if (typeof window !== 'undefined') {
					window.location.href = '/login';
				}

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		// Si no es 401 o ya intentamos refrescar, rechazar
		return Promise.reject(error);
	}
);

export default apiClient;
