'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth'

export function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		try {
			e.preventDefault();
			setIsLoading(true);

			// TODO: Implementar lógica de autenticación
			console.log('Login attempt:', { email, password });
      fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error('Credenciales inválidas');
        }
        const data = await res.json();
        console.log('Login successful, access token:', data.accessToken);
        // Aquí podrías guardar el token en el estado global o en una cookie
        useAuth.getState().setToken(data.accessToken);
      });
		} catch (error) {
			console.error('Error:', error);
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
							value={email}
							onChange={(e) => setEmail(e.target.value)}
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
