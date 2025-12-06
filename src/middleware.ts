import { NextResponse } from 'next/server';
// import { verifyToken } from './modules/auth/verify-token';

export function middleware(req) {
	const token = req.cookies.get('token')?.value;
	const url = req.nextUrl.clone();

	// rutas que requieren login
	const protectedPaths = ['/admin', '/inventory'];
	const isProtected = protectedPaths.some((path) => url.pathname.startsWith(path));

	if (isProtected && !token) {
		url.pathname = '/login';
		return NextResponse.redirect(url);
	}

	// control por rol
	const adminOnly = ['/admin'];
	if (token && adminOnly.some((path) => url.pathname.startsWith(path))) {
		// const payload = verifyToken(token);
    const payload = { role: 'user' }; // Mocked payload for demonstration
		if (payload.role !== 'admin') {
			url.pathname = '/login';
			return NextResponse.redirect(url);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*', '/inventory/:path*'],
};
