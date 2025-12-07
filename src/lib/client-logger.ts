type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Envía un log desde el cliente al servidor a través de un endpoint de API.
 * @param level Nivel del log (error, warn, info, etc.).
 * @param message El mensaje a loguear.
 * @param meta Metadata adicional en formato de objeto.
 */
export function logClient(level: LogLevel, message: string, meta: object = {}) {
	// Como requiere un formato específico, para este caso usamos fetch que es más flexible.
	fetch('/api/log', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ level, message, ...meta }),
		keepalive: true, // Asegura que la petición se complete incluso si la página se cierra
	}).catch(console.error); // Si falla el envío del log, lo mostramos en la consola del navegador.
}
