import { UserRole } from '@/auth/roles';

export interface User {
	id: string;
	username: string;
	role: UserRole;
}
