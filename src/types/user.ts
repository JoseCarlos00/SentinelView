import { UserRole } from '@/lib/auth/roles';

export interface User {
	id: string;
	username: string;
	role: UserRole;
}
