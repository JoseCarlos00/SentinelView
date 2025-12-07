import { NextResponse } from 'next/server';
import {clientLogger as logger} from '@/lib/logger'; // Importamos nuestro logger centralizado

export async function POST(request: Request) {
	try {
		const { level, message, ...meta } = await request.json();

		// Validamos que el nivel sea uno de los que maneja winston
		if (typeof logger[level as keyof typeof logger] === 'function') {
			(logger as any)[level](message, meta);
		} else {
			// Si no, lo registramos como 'info' por defecto
			logger.info(message, meta);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		// Usamos el mismo logger para registrar errores en el endpoint de logging
		logger.error('Error en el endpoint /api/log', { error });
		return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
	}
}
