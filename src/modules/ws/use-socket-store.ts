import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

// Define la estructura del estado del socket
interface SocketState {
	socket: Socket | null;
	isConnected: boolean;
	logs: string[];

	// Acciones:
	connect: () => void;
	disconnect: () => void;
	addLog: (message: string) => void;
	// Puedes agregar aquí una acción para inicializar el estado del inventario si lo necesitas
}

// Obtén la URL del backend del entorno
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9001';

export const useSocketStore = create<SocketState>((set, get) => ({
	socket: null,
	isConnected: false,
	logs: [],

	addLog: (message) => {
		set((state) => ({ logs: [...state.logs, message].slice(-50) })); // Limita el log a 50 mensajes
	},

	connect: () => {
		const { socket: existingSocket, addLog } = get();

		if (existingSocket && existingSocket.connected) {
			// addLog('Socket ya está conectado.'); // Opcional: puedes registrar esto si lo deseas.
			return;
		}

		// 1. Inicializa la conexión
		const newSocket = io(SOCKET_URL, {
			withCredentials: true,
			transports: ['websocket', 'polling'],
			auth: {
				token: token,
			},
			// Query para identificar el tipo de cliente.
			query: {
				clientType: 'WEB_CLIENT',
			},
		});

		// 2. Suscribe los handlers de eventos
		newSocket.on('connect', () => {
			set({ isConnected: true });
			addLog('Socket: Conexión establecida.');
		});

		newSocket.on('disconnect', () => {
			set({ isConnected: false });
			addLog('Socket: Desconectado.');
		});

		// 3. Suscribe tus eventos de negocio (ejemplo)
		newSocket.on('device_update', (data) => {
			// Llama a otra acción del store para actualizar el inventario o la tabla
			// useDeviceStore.getState().updateDevice(data);
			addLog(`RT Update: Dispositivo ${data.id} actualizado.`);
		});

		newSocket.on('device_alert', (alert) => {
			addLog(`ALERTA: ${alert.message}`);
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
