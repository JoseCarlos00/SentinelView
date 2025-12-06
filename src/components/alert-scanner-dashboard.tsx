'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client'; // Asegúrate de instalar socket.io-client
// ... (resto de tus importaciones)

// (Mantén los tipos Device y LogEntry igual)

// Modifica la definición de la función para aceptar props
export default function AlertScannerDashboard({
	initialDevices,
	currentUser,
}: {
	initialDevices: Device[];
	currentUser: { name: string; role: string };
}) {
	// 1. Inicializa el estado 'devices' con las props del Server Component
	const [devices, setDevices] = useState<Device[]>(initialDevices);

	// (Mantén el estado logs, searchTerm, y statusFilter)

	// *** Implementación de Conexión Socket.IO y Token ***
	useEffect(() => {
		// 💡 IMPORTANTE: El token JWT debe ser accesible aquí para el socket.
		// Si el token solo está en las cookies HTTP-Only (lo más seguro),
		// el *Server Component* debe pasarlo a este componente como una prop (y no exponerlo),
		// o el socket debe re-usar la cookie.
		// Lo más común es: El Login guarda el token en un *Context* de React, al que accederías con un hook `useAuth()`.

		// --- Lógica de Socket.IO ---
		const SOCKET_URL = 'ws://tu-servidor-backend:tu-puerto'; // Reemplaza
		const socket = io(SOCKET_URL, {
			// Si usas tokens en el header (menos seguro en Client):
			// auth: { token: 'TOKEN_AQUI' },
			// Si quieres que use las cookies de sesión (la forma en que funciona con HTTP-Only):
			withCredentials: true,
		});

		socket.on('connect', () => {
			addLog('Conexión en tiempo real establecida.', 'success');
		});

		socket.on('device_update', (updatedDevice: Device) => {
			// Lógica para actualizar un solo dispositivo en la tabla
			setDevices((prevDevices) => prevDevices.map((d) => (d.id === updatedDevice.id ? updatedDevice : d)));
			addLog(`Actualización de estado: ${updatedDevice.alias} (${updatedDevice.status})`, 'info');
		});

		socket.on('disconnect', () => {
			addLog('Conexión en tiempo real perdida.', 'error');
		});

		// Función de limpieza
		return () => {
			socket.disconnect();
		};
	}, []); // El array vacío asegura que solo se ejecute al montar

	// ----------------------------------------------------

	// ... (tus funciones addLog, handleSyncInventory, handlePing, handleAlarm se mantienen igual, pero ahora
	// deben usar 'axios' o 'fetch' e incluir el TOKEN en el header para las llamadas REST)

	// --- Ejemplo de handleSyncInventory con Token ---
	const handleSyncInventory = async () => {
		addLog('Iniciando sincronización de inventario maestro...', 'info');
		const token = 'TOKEN_DEL_CONTEXTO_O_COOKIES'; // DEBE obtenerse del contexto de auth

		try {
			const response = await fetch('/api/inventory/sync', {
				// Usa tu ruta API
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			// ... manejo de respuesta ...
		} catch (error) {
			addLog('Error en la sincronización.', 'error');
		}
	};

	// --- Implementación de Autorización (Bloqueo de UI) ---
	const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

	return (
		<div className='space-y-4'>
			{/* ... Componente Card de Métricas y Acciones ... */}

			{/* Bloquea la acción sensible por rol */}
			{isSuperAdmin && (
				<Button
					className='w-full'
					size='lg'
					onClick={handleSyncInventory}
				>
					<RefreshCw className='mr-2 h-4 w-4' />
					Sincronizar Inventario Maestro
				</Button>
			)}

			{/* ... Resto del Renderizado ... */}

			{/* Bloquea opciones en el Dropdown por rol */}
			<TableCell className='text-right'>
				<DropdownMenu>
					{/* ... (MenuTrigger) ... */}
					<DropdownMenuContent align='end'>
						<DropdownMenuItem onClick={() => handlePing(device)}>{/* ... */}</DropdownMenuItem>
						{isSuperAdmin && (
							<DropdownMenuItem onClick={() => handleAlarm(device)}>
								<Zap className='mr-2 h-4 w-4' />
								Activar Alarma (Solo SA)
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>

			{/* ... (Final del componente) ... */}
		</div>
	);
}
