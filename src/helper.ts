export function can(role: string, permission: string) {
	const rules = {
		admin: ['manage_users', 'see_logs', 'edit_equipment'],
		tech: ['see_logs', 'edit_equipment'],
		viewer: ['see_logs'],
	};
	return rules[role]?.includes(permission);
}

//  {can(user.role, "manage_users") && <CreateUserDialog />}
