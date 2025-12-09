import { Role } from "@/types/user"

export interface AuthUser {
	id: string;
	role: Role;
	permissions: string[];
}

export interface TokenPayload {
	userId: string;
	username: string;
	role: Role;
	exp?: number;
}
