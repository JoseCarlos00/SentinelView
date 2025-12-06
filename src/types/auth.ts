import { Role } from "./user"

export interface AuthUser {
	id: string;
	role: Role;
	permissions: string[];
}
