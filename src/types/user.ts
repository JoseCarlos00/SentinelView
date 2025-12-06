export interface User {
	id: string;
	username: string;
	role: Role;
}

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'USER';
