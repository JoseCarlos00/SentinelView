import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


export default function UserManagementSection() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>👥 Gestión de Usuarios</CardTitle>
				<CardDescription>Administrar usuarios y permisos del sistema</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div className='flex items-center justify-between p-4 border rounded-lg'>
						<div>
							<p className='font-medium'>Total de Usuarios</p>
							<p className='text-2xl font-bold mt-1'>24</p>
						</div>
						<Button>+ Nuevo Usuario</Button>
					</div>

					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						<div className='p-4 border rounded-lg text-center'>
							<p className='text-sm text-muted-foreground'>Super Admins</p>
							<p className='text-2xl font-bold mt-1'>2</p>
						</div>
						<div className='p-4 border rounded-lg text-center'>
							<p className='text-sm text-muted-foreground'>Admins</p>
							<p className='text-2xl font-bold mt-1'>5</p>
						</div>
						<div className='p-4 border rounded-lg text-center'>
							<p className='text-sm text-muted-foreground'>Operadores</p>
							<p className='text-2xl font-bold mt-1'>12</p>
						</div>
						<div className='p-4 border rounded-lg text-center'>
							<p className='text-sm text-muted-foreground'>Usuarios</p>
							<p className='text-2xl font-bold mt-1'>5</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
