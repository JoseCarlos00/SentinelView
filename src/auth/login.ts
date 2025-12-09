export async function login(username: string, password: string) {
	const res = await fetch('/api/auth/login', {
		method: 'POST',
		credentials: 'include', // IMPORTANTE para que la cookie viaje
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password }),
	});

	if (!res.ok) throw new Error('Credenciales inválidas');
}

