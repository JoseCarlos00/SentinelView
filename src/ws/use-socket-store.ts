import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/store/use-auth';

export type LogEntry = {
	id: string;
	timestamp: string;
	message: string;
	type: 'info' | 'success' | 'error' | 'warning';
};

// Define la estructura del estado del socket
interface SocketState {
	socket: Socket | null;
	isConnected: boolean;
	logs: LogEntry[];

	// Acciones:
	connect: () => void;
	disconnect: () => void;
	addLog: (message: string, type: LogEntry['type']) => void;
	// Puedes agregar aquí una acción para inicializar el estado del inventario si lo necesitas
}

// Obtén la URL del backend del entorno
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:9001';

export const useSocketStore = create<SocketState>((set, get) => ({
	socket: null,
	isConnected: false,
	logs: [],

	addLog: (message, type='info') => {
		set((state) => {
			const newLog: LogEntry = {
				id: Date.now().toString(),
				timestamp: new Date().toLocaleTimeString(),
				message,
				type,
			};
			return {
				logs: [...state.logs, newLog].slice(-50),
			};
		});
	},

	connect: () => {
		const { socket: existingSocket, addLog } = get();
		const token = useAuth.getState().accessToken;

		if (!token) {
			addLog('Socket: No hay token de autenticación. Conexión abortada.', 'error');
			return;
		}

		if (existingSocket && existingSocket.connected) {
			addLog('Socket ya está conectado.', 'warning');
			return;
		}

		// 1. Inicializa la conexión
		const newSocket = io(SOCKET_URL, {
			withCredentials: true,
			transports: ['websocket', 'polling'],
			auth: {
				token,
			},
			
			query: {
				clientType: 'WEB_CLIENT',
			},
		});

		// 2. Suscribe los handlers de eventos
		newSocket.on('connect', () => {
			set({ isConnected: true });
			addLog('✓ Socket: Conexión establecida.', 'success');

			newSocket.emit('IDENTIFY_CLIENT', { clientType: 'WEB' });
		});

		newSocket.on('disconnect', () => {
			set({ isConnected: false });
			addLog('Socket: Desconectado.', 'error');
		});

		// 3. Suscribe tus eventos de negocio (ejemplo)
		newSocket.on('device_update', (data) => {
			// Llama a otra acción del store para actualizar el inventario o la tabla
			// useDeviceStore.getState().updateDevice(data);
			addLog(`RT Update: Dispositivo ${data.id} actualizado.`, 'success');
		});

		newSocket.on('device_alert', (alert) => {
			addLog(`ALERTA: ${alert.message}`, 'warning');
		});

		// 4. Almacena el socket en el estado
		set({ socket: newSocket });
	},

	disconnect: () => {
		const { socket: existingSocket, addLog } = get();
		if (existingSocket) {
			existingSocket.disconnect();
			set({ socket: null, isConnected: false });
		}
	},
}));

