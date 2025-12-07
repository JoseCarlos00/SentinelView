import type React from 'react';
import type { Metadata } from 'next';
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='es'
			className='dark'
		>
			{/* Añadimos suppressHydrationWarning para evitar errores de hidratación
          causados por extensiones del navegador que modifican el DOM. */}
			<body
				className={`font-sans antialiased`}
				suppressHydrationWarning
			>
				<div className='dark min-h-screen bg-background'>
					{children}
				</div>
			</body>
		</html>
	);
}
