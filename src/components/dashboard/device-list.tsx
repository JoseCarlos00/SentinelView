'use client';

import { useEffect, useState } from 'react';
import { Search, RefreshCw, MapPin, Battery, Wifi, WifiOff } from 'lucide-react';
import io, { Socket } from 'socket.io-client';
import apiClient from '@/lib/api/axios-client';
import { usePermission } from '@/hooks/use-permissions';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// ============================================
// TIPOS
// ============================================

interface Device {
	id: string;
	name: string;
	model: string;
	online: boolean;
	battery?: number;
	lastSeen?: string;
	location?: string;
	ipAddress?: string;
}

interface DeviceListProps {
	initialDevices: Device[];
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function DeviceList({ initialDevices }: DeviceListProps) {
	const [devices, setDevices] = useState<Device[]>(initialDevices);
	const [filteredDevices, setFilteredDevices] = useState<Device[]>(initialDevices);
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	
	const { toast } = useToast();
	const canLocate = usePermission('locate_devices');
	const canManage = usePermission('manage_devices');

	// ============================================
	// WEBSOCKET CONNECTION
	// ============================================

	useEffect(() => {
		const newSocket = io('http://192.168.1.7:9001', {
			withCredentials: true,
			query: {
				clientType: 'WEB_CLIENT',
			},
		});

		newSocket.on('connect', () => {
			console.log('[WebSocket] Conectado ✅');
			toast({
				title: 'Conectado',
				description: 'Conexión en tiempo real establecida',
			});
		});

		newSocket.on('connect_error', (err) => {
			// Este evento se dispara si el servidor rechaza la conexión.
			console.error('[WebSocket] Error de conexión:', err.message);
			toast({
				title: 'Error de conexión en tiempo real',
				description: `No se pudo establecer la conexión: ${err.message}`,
				variant: 'destructive',
			});
		});

		newSocket.on('device-status', (data) => {
			console.log('[WebSocket] Actualización de dispositivo:', data);
			
			setDevices(prev => 
				prev.map(d => 
					d.id === data.deviceId 
						? { ...d, ...data }
						: d
				)
			);
		});

		newSocket.on('disconnect', () => {
			console.log('[WebSocket] Desconectado');
			toast({
				title: 'Desconectado',
				description: 'Conexión en tiempo real perdida',
				variant: 'destructive',
			});
		});

		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, [toast]);

	// ============================================
	// BÚSQUEDA Y FILTRADO
	// ============================================

	useEffect(() => {
		const filtered = devices.filter(device =>
			device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
			device.location?.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredDevices(filtered);
	}, [searchTerm, devices]);

	// ============================================
	// ACCIONES
	// ============================================

	const handleRefresh = async () => {
		setLoading(true);
		try {
			const response = await apiClient.get('/api/devices');
			setDevices(response.data);
			toast({
				title: 'Lista actualizada',
				description: `${response.data.length} dispositivos cargados`,
			});
		} catch (error) {
			console.error('[Refresh] Error:', error);
			toast({
				title: 'Error',
				description: 'No se pudo actualizar la lista',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleLocate = async (device: Device) => {
		try {
			const response = await apiClient.post('/api/locate', { 
				deviceId: device.id 
			});

			if (response.data.success) {
				toast({
					title: '🔔 Alarma Activada',
					description: `Localizando ${device.name}`,
				});

				if (socket) {
					socket.emit('locate-device', { deviceId: device.id });
				}
			}
		} catch (error) {
			console.error('[Locate] Error:', error);
			toast({
				title: 'Error',
				description: 'No se pudo activar la alarma',
				variant: 'destructive',
			});
		}
	};

	const handleViewDetails = (device: Device) => {
		setSelectedDevice(device);
		setIsDetailOpen(true);
	};

	// ============================================
	// ESTADÍSTICAS
	// ============================================

	const onlineCount = devices.filter(d => d.online).length;
	const offlineCount = devices.length - onlineCount;
	const avgBattery = devices
		.filter(d => d.battery !== undefined)
		.reduce((sum, d) => sum + (d.battery || 0), 0) / devices.length;

	// ============================================
	// RENDER
	// ============================================

	return (
		<div className="space-y-6">
			{/* Tarjetas de Estadísticas */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Dispositivos</CardTitle>
						<Wifi className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{devices.length}</div>
						<p className="text-xs text-muted-foreground">Equipos RF registrados</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">En Línea</CardTitle>
						<Wifi className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{onlineCount}</div>
						<p className="text-xs text-muted-foreground">
							{((onlineCount / devices.length) * 100).toFixed(0)}% activos
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Fuera de Línea</CardTitle>
						<WifiOff className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">{offlineCount}</div>
						<p className="text-xs text-muted-foreground">
							{((offlineCount / devices.length) * 100).toFixed(0)}% inactivos
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Batería Promedio</CardTitle>
						<Battery className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{avgBattery.toFixed(0)}%</div>
						<p className="text-xs text-muted-foreground">Nivel de carga</p>
					</CardContent>
				</Card>
			</div>

			{/* Barra de Búsqueda y Acciones */}
			<div className="flex items-center justify-between gap-4">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						type="text"
						placeholder="Buscar por nombre, modelo o ubicación..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>

				<Button
					onClick={handleRefresh}
					disabled={loading}
					variant="outline"
					size="default"
				>
					<RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
					Actualizar
				</Button>
			</div>

			{/* Tabla de Dispositivos */}
			<Card>
				<CardHeader>
					<CardTitle>Lista de Dispositivos</CardTitle>
					<CardDescription>
						{filteredDevices.length} de {devices.length} dispositivos
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<DeviceListSkeleton />
					) : filteredDevices.length === 0 ? (
						<div className="text-center py-12">
							<WifiOff className="mx-auto h-12 w-12 text-muted-foreground" />
							<h3 className="mt-4 text-lg font-semibold">No se encontraron dispositivos</h3>
							<p className="text-sm text-muted-foreground mt-2">
								{searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay dispositivos registrados'}
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Estado</TableHead>
									<TableHead>Nombre</TableHead>
									<TableHead>Modelo</TableHead>
									<TableHead>Ubicación</TableHead>
									<TableHead>Batería</TableHead>
									<TableHead>IP</TableHead>
									<TableHead className="text-right">Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredDevices.map((device) => (
									<TableRow key={device.id}>
										<TableCell>
											<Badge 
												variant={device.online ? 'default' : 'destructive'}
												className={device.online ? 'bg-green-500' : ''}
											>
												{device.online ? (
													<>
														<Wifi className="h-3 w-3 mr-1" />
														Online
													</>
												) : (
													<>
														<WifiOff className="h-3 w-3 mr-1" />
														Offline
													</>
												)}
											</Badge>
										</TableCell>
										<TableCell className="font-medium">{device.name}</TableCell>
										<TableCell className="text-muted-foreground">{device.model}</TableCell>
										<TableCell>
											{device.location ? (
												<div className="flex items-center text-sm">
													<MapPin className="h-3 w-3 mr-1" />
													{device.location}
												</div>
											) : (
												<span className="text-muted-foreground">-</span>
											)}
										</TableCell>
										<TableCell>
											{device.battery !== undefined ? (
												<div className="flex items-center gap-2">
													<Battery 
														className={`h-4 w-4 ${
															device.battery > 50 ? 'text-green-600' :
															device.battery > 20 ? 'text-yellow-600' :
															'text-red-600'
														}`}
													/>
													<span className="text-sm">{device.battery}%</span>
												</div>
											) : (
												<span className="text-muted-foreground">-</span>
											)}
										</TableCell>
										<TableCell className="text-sm text-muted-foreground">
											{device.ipAddress || '-'}
										</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm">
														•••
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Acciones</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem onClick={() => handleViewDetails(device)}>
														Ver Detalles
													</DropdownMenuItem>
													{canLocate && device.online && (
														<DropdownMenuItem onClick={() => handleLocate(device)}>
															🔔 Localizar
														</DropdownMenuItem>
													)}
													{canManage && (
														<>
															<DropdownMenuItem>
																⚙️ Configurar
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem className="text-red-600">
																🗑️ Eliminar
															</DropdownMenuItem>
														</>
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Dialog de Detalles */}
			<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Detalles del Dispositivo</DialogTitle>
						<DialogDescription>
							Información completa de {selectedDevice?.name}
						</DialogDescription>
					</DialogHeader>
					{selectedDevice && (
						<div className="space-y-4 py-4">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Estado:</span>
								<Badge variant={selectedDevice.online ? 'default' : 'destructive'}>
									{selectedDevice.online ? 'Online' : 'Offline'}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Nombre:</span>
								<span className="text-sm">{selectedDevice.name}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Modelo:</span>
								<span className="text-sm">{selectedDevice.model}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">IP:</span>
								<span className="text-sm font-mono">{selectedDevice.ipAddress || 'N/A'}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Ubicación:</span>
								<span className="text-sm">{selectedDevice.location || 'Desconocida'}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Batería:</span>
								<span className="text-sm">{selectedDevice.battery || 0}%</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Última conexión:</span>
								<span className="text-sm text-muted-foreground">
									{selectedDevice.lastSeen || 'Ahora'}
								</span>
							</div>
							
							{canLocate && selectedDevice.online && (
								<Button 
									onClick={() => {
										handleLocate(selectedDevice);
										setIsDetailOpen(false);
									}}
									className="w-full"
								>
									🔔 Localizar Dispositivo
								</Button>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

// ============================================
// SKELETON LOADER
// ============================================

function DeviceListSkeleton() {
	return (
		<div className="space-y-3">
			{[...Array(5)].map((_, i) => (
				<div key={i} className="flex items-center space-x-4">
					<Skeleton className="h-10 w-20" />
					<Skeleton className="h-10 flex-1" />
					<Skeleton className="h-10 w-32" />
					<Skeleton className="h-10 w-24" />
					<Skeleton className="h-10 w-16" />
					<Skeleton className="h-10 w-32" />
					<Skeleton className="h-10 w-12" />
				</div>
			))}
		</div>
	);
}
