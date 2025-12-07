import winston from 'winston';

const logger = winston.createLogger({
	level: 'info', // Nivel mínimo de log a registrar
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		winston.format.errors({ stack: true }), // Para loguear el stack de errores
		winston.format.splat(),
		winston.format.json() // Formato de salida
	),
	defaultMeta: { service: 'sentinel-view-app' }, // Metadata por defecto
	transports: [
		// Por ahora, solo mostraremos los logs en la consola.
		// En producción, podrías añadir transportes para archivos o servicios externos.
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
	],
});

export default logger;
