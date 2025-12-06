import { useAuth } from "@/hooks/use-auth"

export async function logout() {
	await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
		method: 'POST',
		credentials: 'include',
	});

	useAuth.getState().setToken(null);
}
