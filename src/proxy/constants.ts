import { UserRole } from '@/lib/auth/roles';

// Rutas completamente públicas (no requieren autenticación)
export const PUBLIC_PATHS = ['/login', '/api/log', '/api/auth/login', '/forbidden', '/test'] as const ;

// Configuración de rutas protegidas por rol
export const ROLE_PROTECTED_ROUTES: Array<{ path: string; allowedRoles: UserRole[] }> = [
	// Rutas que SOLO pueden acceder SUPER_ADMINs
	{
		path: '/admin',
		allowedRoles: [UserRole.SUPER_ADMIN],
	},
	{
		path: '/api/admin',
		allowedRoles: [UserRole.SUPER_ADMIN],
	},
	{
		path: '/users/manage',
		allowedRoles: [UserRole.SUPER_ADMIN],
	},

	// Rutas que pueden acceder SUPER_ADMIN y ADMIN
	{
		path: '/reports',
		allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
	},

	// Rutas que pueden acceder todos los roles autenticados
	{
		path: '/dashboard',
		allowedRoles: [
			UserRole.SUPER_ADMIN,
			UserRole.ADMIN,
			UserRole.OPERATOR,
			UserRole.USER,
		],
	},
] as const;
