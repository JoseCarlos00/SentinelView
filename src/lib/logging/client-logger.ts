type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Envía un log desde el cliente al servidor a través de un endpoint de API.
 * @param level Nivel del log (error, warn, info, etc.).
 * @param message El mensaje a loguear.
 * @param meta Metadata adicional en formato de objeto.
 */
export function logClient(level: LogLevel, message: string, meta: object = {}) {
	const serializableMeta: { [key: string]: any } = {};
	
	for (const key in meta) {
		if (Object.prototype.hasOwnProperty.call(meta, key)) {
			const value = (meta as any)[key];
			if (value instanceof Error) {
				// Si el valor es un error, lo convertimos en un objeto plano.
				serializableMeta[key] = {
					message: value.message,
					stack: value.stack,
					name: value.name,
				};
			} else {
				serializableMeta[key] = value;
			}
		}
	}

	fetch('/api/log', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ level, message, ...serializableMeta }),
		keepalive: true, // Asegura que la petición se complete incluso si la página se cierra
	}).catch(console.error); // Si falla el envío del log, lo mostramos en la consola del navegador.
}
