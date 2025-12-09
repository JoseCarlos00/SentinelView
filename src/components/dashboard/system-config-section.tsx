import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SystemConfigSection() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>⚙️ Configuración del Sistema</CardTitle>
				<CardDescription>Ajustes avanzados y mantenimiento</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-3'>
					<div className='flex items-center justify-between p-3 border rounded-lg'>
						<div>
							<p className='font-medium'>Modo de Alarma</p>
							<p className='text-sm text-muted-foreground'>Volumen máximo y vibración</p>
						</div>
						<Button
							variant='outline'
							size='sm'
						>
							Configurar
						</Button>
					</div>

					<div className='flex items-center justify-between p-3 border rounded-lg'>
						<div>
							<p className='font-medium'>Intervalo de Sincronización</p>
							<p className='text-sm text-muted-foreground'>Actualización cada 30 segundos</p>
						</div>
						<Button
							variant='outline'
							size='sm'
						>
							Configurar
						</Button>
					</div>

					<div className='flex items-center justify-between p-3 border rounded-lg'>
						<div>
							<p className='font-medium'>Backup de Base de Datos</p>
							<p className='text-sm text-muted-foreground'>Último backup: Hoy 02:00 AM</p>
						</div>
						<Button
							variant='outline'
							size='sm'
						>
							Crear Backup
						</Button>
					</div>

					<div className='flex items-center justify-between p-3 border rounded-lg'>
						<div>
							<p className='font-medium'>Logs del Sistema</p>
							<p className='text-sm text-muted-foreground'>Ver registro de eventos</p>
						</div>
						<Button
							variant='outline'
							size='sm'
						>
							Ver Logs
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
