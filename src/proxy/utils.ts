import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { User } from "@/types/index";

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function getUserFromToken2() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) return null;

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as User;

    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

export function getUserFromToken(accessToken: string) {
	try {
		const decoded = jwt.verify(accessToken, JWT_SECRET) as User;

		return {
			id: decoded.id,
			username: decoded.username,
			role: decoded.role,
		};
	} catch {
		return null;
	}
}
