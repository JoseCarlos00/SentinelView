'use client';

import { useState } from 'react';
import { LogEntry } from '@/modules/ws/use-socket-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// ... (resto de tus importaciones)

// (Mantén los tipos Device y LogEntry igual)

// Definición de Props para el Client Component
interface DashboardProps {
	// Aquí va el contenido estático renderizado por el Server Component
	children: React.ReactNode;
	// La información del usuario necesaria para la lógica de la UI y los sockets
	currentUser: { username: string; role: string };
}

interface StoreProps {
	isConnected: boolean;
	logs: LogEntry[];
}

// *** Componente Cliente (Contenedor de Interactividad) ***
export default function AlertScannerDashboard({ children, currentUser }: DashboardProps) {

  const isConnected = true;
  const [logs, setLogs] = useState<LogEntry[]>([]);

	// ... (Tu función addLog, handlePing, handleAlarm, useEffect para Socket.IO) ...


	return (
		<div className='min-h-screen bg-background sm:p-6'>
			{/* ... (Header, Sidebar, y Métricas del Dashboard, adaptadas o extraídas) ... */}

			<p>Estado del Socket: {isConnected ? '✅ Conectado' : '❌ Desconectado'}</p>

			{/* 2. El children (El contenido de la tabla de dispositivos) inyectado aquí */}
			<div className='mx-auto max-w-7xl space-y-6'>{children}</div>

			{/* 3. La Consola de Eventos (Controlada por estado local/Client) */}
			{/* ... (Tu componente de Consola de Eventos y logs) ... */}
			<Card>
				<CardHeader>
					<CardTitle className='text-xl'>Consola de Eventos</CardTitle>
					<CardDescription>Logs y notificaciones en tiempo real</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='h-64 overflow-y-auto rounded-lg bg-black/50 p-4 font-mono text-sm'>
						{logs.length === 0 ? (
							<p className='text-muted-foreground'>No hay eventos para mostrar</p>
						) : (
							<div className='space-y-1'>
								{logs.map((log) => (
									<div
										key={log.id}
										className='flex gap-3'
									>
										<span className='text-muted-foreground'>[{log.timestamp}]</span>
										<span
											className={
												log.type === 'success'
													? 'text-green-400'
													: log.type === 'error'
													? 'text-red-400'
													: log.type === 'warning'
													? 'text-yellow-400'
													: 'text-blue-400'
											}
										>
											{log.message}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
