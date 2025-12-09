import { ACCESS_TOKEN_COOKIE_NAME } from '@/lib/constants';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { apiLogger as logger } from '@/lib/logging/logger';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:9001';

// Función auxiliar para reenviar peticiones al backend para un ID específico
async function proxyRequestWithId(request: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;
	const url = `${BACKEND_URL}/api/admin/users/${id}`;

	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

	const headers = new Headers(request.headers);
	if (accessToken) {
		headers.set('Authorization', `Bearer ${accessToken}`);
	}

	try {
		const backendResponse = await fetch(url, {
			method: request.method,
			headers,
			// Solo incluimos el cuerpo para métodos que lo permiten (ej. PATCH, PUT)
			body: request.method !== 'GET' && request.method !== 'DELETE' ? await request.blob() : undefined,
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
		logger.error(`Error proxying ${request.method} to ${url}:`, error);
		return NextResponse.json({ message: 'Error al contactar el servidor backend.' }, { status: 502 }); // 502 Bad Gateway
	}
}

// GET /api/admin/users/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	return proxyRequestWithId(request, { params });
}

// PATCH, PUT, DELETE
export {
	proxyRequestWithId as PATCH,
	proxyRequestWithId as PUT,
	proxyRequestWithId as DELETE,
};
