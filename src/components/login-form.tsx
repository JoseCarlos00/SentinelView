'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

export function LoginForm() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const res = await fetch('http://localhost:9001/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include', // <-- AÑADIR ESTA LÍNEA
				body: JSON.stringify({ username: username, password }),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || 'Credenciales inválidas');
			}

			const data = await res.json();
			console.log('Login successful, access token:', data.accessToken);

			// 1. Guarda el token en el store de Zustand para peticiones del lado del cliente.
			useAuth.getState().setToken(data.accessToken);

			// 2. El backend ahora es responsable de establecer AMBAS cookies:
			// - 'jwt-refresh-token' (httpOnly)
			// - 'jwt-access-token' (accesible por el servidor)
			router.push('/');
			router.refresh();

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado';
			console.error('Error en el login:', errorMessage);
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Iniciar Sesión</CardTitle>
				<CardDescription>Ingresa tus credenciales para acceder al panel</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={handleSubmit}
					className='space-y-4'
				>
					<div className='space-y-2'>
						<Label htmlFor='username'>Usuario</Label>
						<Input
							id='username'
							type='username'
							placeholder='usuario'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='password'>Contraseña</Label>
						<Input
							id='password'
							type='password'
							placeholder='••••••••'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					{error && <p className='text-sm text-red-500'>{error}</p>}
					<Button
						type='submit'
						className='w-full'
						disabled={isLoading}
					>
						{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
