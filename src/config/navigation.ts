import { UserRole } from '@/lib/auth/roles';
import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
	label: string;
	href: string;
	icon?: string; // Nombre del icono de lucide-react
	allowedRoles: UserRole[];
	badge?: string | number;
	children?: NavigationItem[];
}

/**
 * Menú principal de navegación
 */
export const mainNavigation: NavigationItem[] = [
	{
		label: 'Dashboard',
		href: '/dashboard',
		icon: 'LayoutDashboard',
		allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATOR, UserRole.USER],
	},
	{
		label: 'Reportes',
		href: '/reports',
		icon: 'BarChart3',
		allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
	},
	{
		label: 'Administración',
		href: '/admin',
		icon: 'Settings',
		allowedRoles: [UserRole.SUPER_ADMIN],
		children: [
			{
				label: 'Usuarios',
				href: '/admin/users',
				icon: 'Users',
				allowedRoles: [UserRole.SUPER_ADMIN],
			},
			{
				label: 'Configuración',
				href: '/admin/settings',
				icon: 'Sliders',
				allowedRoles: [UserRole.SUPER_ADMIN],
			},
		],
	},
];

/**
 * Menú de usuario (dropdown)
 */
export const userNavigation: NavigationItem[] = [
	{
		label: 'Perfil',
		href: '/profile',
		icon: 'User',
		allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATOR, UserRole.USER],
	},
	{
		label: 'Configuración',
		href: '/settings',
		icon: 'Settings',
		allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATOR, UserRole.USER],
	},
];

/**
 * Filtra items de navegación según el rol del usuario
 */
export function filterNavigationByRole(items: NavigationItem[], userRole: UserRole): NavigationItem[] {
	return items
		.filter((item) => item.allowedRoles.includes(userRole))
		.map((item) => ({
			...item,
			children: item.children ? filterNavigationByRole(item.children, userRole) : undefined,
		}));
}
