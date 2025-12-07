import { ACCESS_TOKEN_COOKIE_NAME } from '@/lib/constants';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:9001';
const USERS_API_URL = `${BACKEND_URL}/api/admin/users`;

// Función auxiliar para reenviar peticiones al backend
async function proxyRequest(request: Request) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

	// Preparamos las cabeceras, incluyendo el token de autorización.
	const headers = new Headers(request.headers);
	if (accessToken) {
		headers.set('Authorization', `Bearer ${accessToken}`);
	}

	try {
		const backendResponse = await fetch(USERS_API_URL, {
			method: request.method,
			headers,
			// Solo incluimos el cuerpo para métodos que lo permiten (ej. POST)
			body: request.method !== 'GET' ? await request.blob() : undefined,
			// Duplex es necesario para enviar un cuerpo con una petición GET/HEAD, aunque aquí lo evitamos.
			// @ts-ignore
			duplex: 'half',
		});

		// Reenviamos la respuesta del backend (cuerpo, estado, cabeceras) al cliente.
		return new NextResponse(backendResponse.body, {
			status: backendResponse.status,
			statusText: backendResponse.statusText,
			headers: backendResponse.headers,
		});
	} catch (error) {
		console.error(`Error proxying ${request.method} to ${USERS_API_URL}:`, error);
		return NextResponse.json({ message: 'Error al contactar el servidor backend.' }, { status: 502 }); // 502 Bad Gateway
	}
}

// GET - Retrieve all users
export async function GET() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

	console.log({cookieStore, accessToken});
	

	try {
		const backendResponse = await fetch(USERS_API_URL, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const data = await backendResponse.json();
		
		return NextResponse.json(data, { status: backendResponse.status });
	} catch (error) {
		console.error(`Error proxying GET to ${USERS_API_URL}:`, error);
		return NextResponse.json({ message: 'Error al contactar el servidor backend.' }, { status: 502 });
	}
}

// POST - Create a new user
export async function POST(request: Request) {
	return proxyRequest(request);
}
