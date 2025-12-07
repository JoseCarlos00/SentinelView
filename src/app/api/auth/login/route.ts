import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	// 1. Obtener la URL del backend desde las variables de entorno.
	// Es más seguro usar una variable sin el prefijo NEXT_PUBLIC_ ya que esta ruta se ejecuta en el servidor.
	const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:9001';

	try {
		// 2. Obtener el cuerpo de la solicitud original (del cliente).
		const body = await request.json();

		// 3. Reenviar la solicitud al servidor backend.
		const backendResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		// 4. Leer el cuerpo de la respuesta del backend.
		const data = await backendResponse.json();

		// Si la respuesta del backend no fue exitosa (ej. 401 Unauthorized),
		// la reenviamos tal cual al cliente.
		if (!backendResponse.ok) {
			return NextResponse.json(data, { status: backendResponse.status });
		}

		// 5. Capturar la cabecera 'Set-Cookie' de la respuesta del backend.
		const cookies = backendResponse.headers.get('set-cookie');

		// 6. Crear una nueva respuesta para el cliente, incluyendo el cuerpo y la cookie.
		const response = NextResponse.json(data);
		if (cookies) {
			response.headers.set('set-cookie', cookies);
		}
		return response;
	} catch (error) {
		console.error('Error proxying login request:', error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
