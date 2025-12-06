import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, RefreshCw, Wifi, WifiOff } from 'lucide-react';


export interface InventorySidebarProps {
  connectedDevices: number;
  disconnectedDevices: number;
  alertsSentToday: number;
  handleSyncInventory: () => void;
}

export default function InventorySidebar({
  connectedDevices,
  disconnectedDevices,
  alertsSentToday,
  handleSyncInventory,
}: InventorySidebarProps) {
  return (
		<aside className='w-80 border-r border-border bg-card p-6'>
			<div className='space-y-6'>
				<div>
					<h2 className='mb-4 text-lg font-semibold text-foreground'>Dashboard de Métricas</h2>
					<div className='space-y-3'>
						<Card className='bg-background/50'>
							<CardHeader className='pb-3'>
								<CardTitle className='text-sm font-medium text-muted-foreground'>Dispositivos Conectados</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex items-center gap-2'>
									<Wifi className='h-5 w-5 text-green-500' />
									<span className='text-3xl font-bold text-foreground'>{connectedDevices}</span>
								</div>
							</CardContent>
						</Card>

						<Card className='bg-background/50'>
							<CardHeader className='pb-3'>
								<CardTitle className='text-sm font-medium text-muted-foreground'>Dispositivos Desconectados</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex items-center gap-2'>
									<WifiOff className='h-5 w-5 text-red-500' />
									<span className='text-3xl font-bold text-foreground'>{disconnectedDevices}</span>
								</div>
							</CardContent>
						</Card>

						<Card className='bg-background/50'>
							<CardHeader className='pb-3'>
								<CardTitle className='text-sm font-medium text-muted-foreground'>Alertas Enviadas Hoy</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex items-center gap-2'>
									<Bell className='h-5 w-5 text-blue-500' />
									<span className='text-3xl font-bold text-foreground'>{alertsSentToday}</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				<div>
					<Button
						className='w-full'
						size='lg'
						onClick={handleSyncInventory}
					>
						<RefreshCw className='mr-2 h-4 w-4' />
						Sincronizar Inventario Maestro
					</Button>
				</div>
			</div>
		</aside>
	);
}
