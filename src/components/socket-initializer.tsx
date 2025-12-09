'use client';

import { useEffect } from 'react';
import { useSocketStore } from '@/modules/ws/use-socket-store';

// Componente simple cuya única tarea es inicializar la conexión.
export function SocketInitializer() {
	const connect = useSocketStore((state) => state.connect);
	const disconnect = useSocketStore((state) => state.disconnect);

	useEffect(() => {
		// 1. Conectar al montar
		connect(); // Esta función ya obtiene el token más reciente de useAuth.

		return () => {
			// 2. Desconectar al desmontar el componente (ej: al cerrar sesión)
			disconnect();
		};
	}, []);

	// Este componente no renderiza nada visible.
	return null;
}
