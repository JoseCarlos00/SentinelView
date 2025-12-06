import { useAuth } from "@/hooks/use-auth"

export async function logout() {
	await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
		method: 'POST',
	});

	useAuth.getState().setToken(null);
}
