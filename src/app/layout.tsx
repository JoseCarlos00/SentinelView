import type { Metadata } from 'next';
'@/components/ui/toaster';
import { cookies } from 'next/headers';
import UserProvider from '@/components/user-store-sync';
import { REFRESH_TOKEN_COOKIE_NAME } from '@/lib/constants';
import { Toaster } from '@/components/ui/toaster';
import { Geist, Geist_Mono } from 'next/font/google';

// @ts-ignore
import './globals.css';
import { verifyToken } from '@/lib/auth/tokens'

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
	// <CHANGE> Updated metadata for AlertScanner dashboard
	title: 'AlertScanner Control | Dashboard Operacional',
	description: 'Dashboard de control operacional para monitoreo y gestión de dispositivos de red',
};

async function getUserFromToken() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
	if (!accessToken) return null;

	return verifyToken(accessToken, 'JWT_REFRESH_SECRET');
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
