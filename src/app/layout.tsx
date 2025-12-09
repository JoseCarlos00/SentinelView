import type { Metadata } from 'next';
'@/components/ui/toaster';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import UserProvider from '@/components/user-store-sync';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/lib/constants';
import { Toaster } from '@/components/ui/toaster';
import { Geist, Geist_Mono } from 'next/font/google';

// @ts-ignore
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
	// <CHANGE> Updated metadata for AlertScanner dashboard
	title: 'AlertScanner Control | Dashboard Operacional',
	description: 'Dashboard de control operacional para monitoreo y gestión de dispositivos de red',
};

async function getUserFromToken() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

	if (!accessToken) return null;

	try {
		const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as any;
		return {
			id: decoded.userId,
			username: decoded.username,
			role: decoded.role,
		};
	} catch {
		return null;
	}
}

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
	const user = await getUserFromToken();

	return (
		<html lang='es' className='dark' suppressHydrationWarning>
			<body className={`font-sans antialiased`} suppressHydrationWarning>
				<UserProvider initialUser={user} />
				{children}
				<Toaster />
			</body>
		</html>
	);
}
