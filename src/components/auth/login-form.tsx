'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/auth/login';
import { logClient } from "@/lib/logging/client-logger";

export default function LoginForm() {
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
			// Usamos la función centralizada
			await login(username, password);
			logClient('info', 'Intento de login exitoso', { username });

			window.location.href = '/dashboard';

		} catch (error) {
			// Proporcionamos un mensaje más amigable y específico.
			// El error lanzado desde login.ts es 'Credenciales inválidas'.
			const errorMessage =
				error instanceof Error && error.message === 'Credenciales inválidas'
					? 'El usuario o la contraseña son incorrectos.'
					: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';

			// Usamos el clientLogger para enviar el error al servidor.
			logClient('warn', 'Intento de login fallido', { username, error});

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
							placeholder='********'
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
