'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import RoleBadge from '@/components/auth/role-badge';
import { UserRole } from '@/lib/auth/roles';
import { LogoutButton } from '../logout-button'

export default function AppHeader() {
	const user = useUser((state) => state.user);
	const router = useRouter();

	return (
		<header className='bg-card border-b border-border'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
				<div className='flex items-center justify-between'>
					{/* Sección Izquierda: Título y Saludo */}
					<div>
						<h1 className='text-2xl font-bold text-foreground'>Dashboard</h1>
						<p className='mt-1 text-sm text-muted-foreground'>
							Bienvenido de nuevo, {user?.username ?? 'invitado'} 👋
						</p>
					</div>

					{/* Sección Derecha: Info de Usuario y Logout */}
					{user && (
						<div className='flex items-center gap-4'>
							<div className='text-right hidden sm:block'>
								<p className='font-semibold text-sm text-foreground'>{user.username}</p>
								<RoleBadge role={user.role as UserRole} />
							</div>
							<LogoutButton />
						</div>
					)}
					</div>
				</div>
		</header>
	);
}
