'use client';

import { useUser } from '@/store/use-user'; // Asumiendo que tienes este context

import { UserRole, getRoleBadgeColor, getRoleDisplayName } from '@/auth/roles';

interface RoleBadgeProps {
	role: UserRole;
	showIcon?: boolean;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const ROLE_ICONS: Record<UserRole, string> = {
	[UserRole.SUPER_ADMIN]: '👑',
	[UserRole.ADMIN]: '⚡',
	[UserRole.OPERATOR]: '🔧',
	[UserRole.USER]: '👤',
};

const SIZE_CLASSES = {
	sm: 'text-xs px-2 py-0.5',
	md: 'text-sm px-3 py-1',
	lg: 'text-base px-4 py-2',
};

export default function RoleBadge({ role, showIcon = true, size = 'md', className = '' }: RoleBadgeProps) {
	const colorClass = getRoleBadgeColor(role);
	const sizeClass = SIZE_CLASSES[size];
	const displayName = getRoleDisplayName(role);
	const icon = ROLE_ICONS[role];

	return (
		<span
			className={`inline-flex items-center gap-1 font-semibold rounded-full border ${colorClass} ${sizeClass} ${className}`}
		>
			{showIcon && <span>{icon}</span>}
			<span>{displayName}</span>
		</span>
	);
}

// ============================================
// Hook para verificar permisos en componentes
// ============================================



export function usePermission(permission: string): boolean {
	const { user } = useUser();

	if (!user) return false;

	const { hasPermission } = require('@/auth/roles');
	return hasPermission(user.role as UserRole, permission);
}

export function useHasRole(requiredRole: UserRole): boolean {
	const { user } = useUser();

	if (!user) return false;

	const { hasEqualOrHigherRole } = require('@/auth/roles');
	return hasEqualOrHigherRole(user.role as UserRole, requiredRole);
}

// ============================================
// Componente para proteger contenido por rol
// ============================================

interface ProtectedContentProps {
	requiredRole: UserRole;
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function ProtectedContent({ requiredRole, children, fallback = null }: ProtectedContentProps) {
	const hasRole = useHasRole(requiredRole);

	if (!hasRole) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

// ============================================
// Componente para proteger contenido por permiso
// ============================================

interface ProtectedByPermissionProps {
	permission: string;
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function ProtectedByPermission({ permission, children, fallback = null }: ProtectedByPermissionProps) {
	const hasPermission = usePermission(permission);

	if (!hasPermission) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
