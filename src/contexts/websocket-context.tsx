'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
	useCallback,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketContextType {
	isConnected: boolean;
	sendMessage: (event: string, data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
	undefined
);

export const useWebSocket = () => {
	const context = useContext(WebSocketContext);
	if (context === undefined) {
		throw new Error('useWebSocket must be used within a WebSocketProvider');
	}
	return context;
};

interface WebSocketProviderProps {
	children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		// Reemplaza la URL con la de tu servidor de WebSockets
		const socketIo = io('http://localhost:9001', {
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		});

		setSocket(socketIo);

		socketIo.on('connect', () => {
			console.log('Conectado al servidor de WebSocket');
			setIsConnected(true);
		});

		socketIo.on('disconnect', () => {
			console.log('Desconectado del servidor de WebSocket');
			setIsConnected(false);
		});

		// Limpieza al desmontar el componente
		return () => {
			socketIo.disconnect();
		};
	}, []);

	const sendMessage = useCallback(
		(event: string, data: any) => {
			if (socket && socket.connected) {
				socket.emit(event, data);
			} else {
				console.error('Socket no conectado.');
			}
		},
		[socket]
	);

	const value = { isConnected, sendMessage };

	return (
		<WebSocketContext.Provider value={value}>
			{children}
		</WebSocketContext.Provider>
	);
};
