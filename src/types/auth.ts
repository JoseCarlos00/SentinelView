import { Role } from "@/types/user"

export interface AuthUser {
	id: string;
	role: Role;
	permissions: string[];
}
