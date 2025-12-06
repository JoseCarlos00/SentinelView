import { NextResponse } from "next/server"

export async function middleware(req: any) {
	const access = req.cookies.get('accessToken');

	// si no hay token, intentamos refresh
	if (!access) {
		const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
			method: 'POST',
			credentials: 'include',
			headers: { cookie: req.headers.get('cookie') || '' },
		});

		if (refreshRes.ok) {
			const data = await refreshRes.json();
			// colocas accessToken en cookie temporal (si quieres SSR)
			const response = NextResponse.next();
			response.cookies.set('accessToken', data.accessToken);
			return response;
		}
	}

	return NextResponse.next();
}
