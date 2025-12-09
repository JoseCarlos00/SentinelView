import jwt from 'jsonwebtoken';
import { User } from "@/types/index";

export interface TokenPayload {
	userId: string;
	username: string;
	role: string;
	exp?: number;
	iat?: number;
}

/**
 * Decodifica un JWT sin verificar la firma (útil para leer payload)
 */
export function decodeToken(token: string): TokenPayload | null {
	try {
		const payloadBase64 = token.split('.')[1];

		if (!payloadBase64) {
			return null;
		}

		const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
		const decodedPayloadString = Buffer.from(base64, 'base64').toString('utf8');
		const payload = JSON.parse(decodedPayloadString) as TokenPayload;

		return payload;
	} catch (error) {
		console.error('Error decodificando token:', error);
		return null;
	}
}

/**
 * Verifica si un token ha expirado
 */
export function isTokenExpired(token: string): boolean {
	const payload = decodeToken(token);

	if (!payload || !payload.exp) {
		return true;
	}

	// exp está en segundos, Date.now() en milisegundos
	return payload.exp * 1000 < Date.now();
}

/**
 * Obtiene el tiempo restante del token en segundos
 */
export function getTokenRemainingTime(token: string): number {
	const payload = decodeToken(token);

	if (!payload || !payload.exp) {
		return 0;
	}

	const remainingMs = payload.exp * 1000 - Date.now();
	return Math.max(0, Math.floor(remainingMs / 1000));
}

type SecretKey = 'JWT_SECRET' | 'REFRESH_TOKEN_SECRET';

export function verifyToken(token: string, secret: SecretKey): User | null {
	try {
		const secretValue = process.env[secret];

		const payload = jwt.verify(token, secretValue!) as User;
		return payload;
	} catch (error) {
		console.error('Error verificando token:', error);
		return null;
	}
}
