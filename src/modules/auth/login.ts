export async function login(username: string, password: string) {
	try {
		console.log({ username, password });

		// Usamos una ruta relativa. El navegador la completará con el dominio actual (p. ej., http://localhost:3000).
		// Esto es más simple y robusto si el frontend y el backend de Next.js están en el mismo host.
		// La variable de entorno NEXT_PUBLIC_API_URL ya no es estrictamente necesaria para esta llamada.
		const res = await fetch('/api/auth/login', {
			method: 'POST',
			credentials: 'include', // IMPORTANTE para que la cookie viaje
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		});

		if (!res.ok) throw new Error('Credenciales inválidas');

		console.log(res);
		
		const data = await res.json();
		console.log(data);
		
		return data.accessToken;
	} catch (error) {
		console.error('Error during login:', error);
		throw error;
	}
}
