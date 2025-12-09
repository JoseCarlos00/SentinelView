import { cookies } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';
import { siteConfig } from '@/config/site';
import { REFRESH_TOKEN_COOKIE_NAME } from '@/lib/constants';
import UserStoreSync from '@/components/user-store-sync';
import { verifyToken } from '@/lib/auth/tokens'

// @ts-ignore
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });


export const metadata = {
	title: siteConfig.title,
	description: siteConfig.description,
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
				<UserStoreSync  initialUser={user} />
				{children}
				<Toaster />
			</body>
		</html>
	);
}
