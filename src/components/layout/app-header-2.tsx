'use client';

import { useUser } from '@/hooks/use-user';
import RoleBadge from '@/components/auth/role-badge';
import { UserRole } from '@/lib/auth/roles';

export default function Header() {
	const { user } = useUser();

	return (
		<header className='bg-white shadow px-6 py-4 flex justify-between items-center'>
			<h1 className='text-2xl font-bold'>Sistema RF</h1>

			{user && (
				<div className='flex items-center gap-4'>
					<div className='text-right'>
						<p className='text-sm text-gray-600'>Hola,</p>
						<p className='font-semibold'>{user.username}</p>
					</div>
					<RoleBadge role={user.role as UserRole} />
					<button className='text-red-600 hover:text-red-800'>Cerrar Sesión</button>
				</div>
			)}
		</header>
	);
}
