'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { logClient } from '@/lib/logging/client-logger';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Error capturado:', error);
    logClient('error', 'PAGE ERROR', { error });
	}, [error]);

	return (
		<div className='min-h-screen flex items-center justify-center p-4 bg-gray-50'>
			<Card className='max-w-md w-full'>
				<CardHeader>
					<div className='flex items-center gap-3'>
						<AlertTriangle className='h-8 w-8 text-red-600' />
						<div>
							<CardTitle>Algo salió mal</CardTitle>
							<CardDescription>Ha ocurrido un error inesperado</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='p-3 bg-red-50 rounded-lg'>
						<p className='text-sm text-red-800 font-mono'>{error.message || 'Error desconocido'}</p>
						{error.digest && <p className='text-xs text-red-600 mt-2'>ID: {error.digest}</p>}
					</div>

					<div className='flex gap-3'>
						<Button
							onClick={reset}
							className='flex-1'
						>
							Intentar de nuevo
						</Button>
						<Button
							variant='outline'
							onClick={() => (window.location.href = '/dashboard')}
							className='flex-1'
						>
							Ir al Dashboard
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
