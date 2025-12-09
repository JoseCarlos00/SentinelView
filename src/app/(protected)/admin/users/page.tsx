'use client'

import RoleBadge from '@/components/auth/role-badge';
import { UserRole } from '@/lib/auth/roles';

interface User {
	id: string;
	username: string;
	email: string;
	role: UserRole;
}

export default function UsersPage() {
	// Simular lista de usuarios
	const users: User[] = [
		{ id: '1', username: 'admin', email: 'admin@example.com', role: UserRole.SUPER_ADMIN },
		{ id: '2', username: 'manager', email: 'manager@example.com', role: UserRole.ADMIN },
		{ id: '3', username: 'operator1', email: 'op1@example.com', role: UserRole.OPERATOR },
		{ id: '4', username: 'viewer', email: 'viewer@example.com', role: UserRole.USER },
	];

	return (
		<div className='p-8'>
			<h1 className='text-3xl font-bold mb-6'>Gestión de Usuarios</h1>

			<div className='bg-white rounded-lg shadow overflow-hidden'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Usuario</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Email</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Rol</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Acciones</th>
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{users.map((user) => (
							<tr
								key={user.id}
								className='hover:bg-gray-50'
							>
								<td className='px-6 py-4 whitespace-nowrap font-medium'>{user.username}</td>
								<td className='px-6 py-4 whitespace-nowrap text-gray-600'>{user.email}</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<RoleBadge
										role={user.role}
										size='sm'
									/>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<button className='text-blue-600 hover:text-blue-800 mr-3'>Editar</button>
									<button className='text-red-600 hover:text-red-800'>Eliminar</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
