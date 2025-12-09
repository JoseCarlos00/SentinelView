'use client'

import { usePermission, useHasRole } from '@/components/role-badge';
import { UserRole } from '@/auth/roles';

interface DeviceCardProps {
	device: {
		id: string;
		name: string;
		online: boolean;
	};
}

export default function DeviceCard({ device }: DeviceCardProps) {
	const canLocate = usePermission('locate_devices');
	const canManage = usePermission('manage_devices');
	const isSuperAdmin = useHasRole(UserRole.SUPER_ADMIN);

	return (
		<div className='border rounded-lg p-4 bg-white'>
			<h3 className='font-semibold'>{device.name}</h3>
			<p className={device.online ? 'text-green-600' : 'text-red-600'}>{device.online ? '🟢 Online' : '🔴 Offline'}</p>

			<div className='mt-4 space-y-2'>
				{/* Botón visible solo si tiene permiso */}
				{canLocate && (
					<button
						className='w-full bg-blue-500 text-white px-4 py-2 rounded'
						disabled={!device.online}
					>
						🔔 Localizar
					</button>
				)}

				{/* Botón visible solo para quien puede gestionar */}
				{canManage && <button className='w-full bg-gray-500 text-white px-4 py-2 rounded'>⚙️ Configurar</button>}

				{/* Botón visible solo para SUPER_ADMIN */}
				{isSuperAdmin && <button className='w-full bg-red-500 text-white px-4 py-2 rounded'>🗑️ Eliminar</button>}
			</div>
		</div>
	);
}
