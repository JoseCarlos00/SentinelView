import { Role as UserRole } from '@/types/user';

// Rutas completamente públicas (no requieren autenticación)
export const PUBLIC_PATHS = ['/login', '/api/log', '/forbidden'];

// Configuración de rutas protegidas por rol
export const ROLE_PROTECTED_ROUTES: Array<{ path: string; allowedRoles: UserRole[] }> = [
	// Rutas que SOLO pueden acceder SUPER_ADMINs
	{
		path: '/admin',
		allowedRoles: ['SUPER_ADMIN'],
	},
	{
		path: '/api/admin',
		allowedRoles: ['SUPER_ADMIN'],
	},
	{
		path: '/users/manage',
		allowedRoles: ['SUPER_ADMIN'],
	},

	// Rutas que pueden acceder SUPER_ADMIN y ADMIN
	{
		path: '/reports',
		allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
	},

	// Rutas que pueden acceder todos los roles autenticados
	{
		path: '/dashboard',
		allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'USER'],
	},
];
