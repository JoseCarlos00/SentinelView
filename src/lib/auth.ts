import { useAuth } from "@/hooks/use-auth"

export async function refreshToken() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
		method: 'POST',
		credentials: 'include',
	});

	if (!res.ok) {
		useAuth.getState().setToken(null);
		return false;
	}

	const data = await res.json()
	useAuth.getState().setToken(data.accessToken);
	return true;
}

