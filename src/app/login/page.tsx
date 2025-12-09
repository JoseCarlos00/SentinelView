import { LoginForm } from '@/components/auth/login-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { use } from 'react';
import { Terminal } from 'lucide-react';

// Define una interfaz para los parámetros de búsqueda que esperas
interface LoginPageProps {
	searchParams?: {
		message?: string;
		error?: string;
	};
}

// 1. El componente de página ahora es `async` para poder usar `use()`.
//    Next.js trata `searchParams` como una Promesa en el servidor.
export default function LoginPage({ searchParams }: LoginPageProps) {
	// 2. Usamos `React.use()` para desenvolver la "Promesa" de searchParams.
	const resolvedSearchParams = use(Promise.resolve(searchParams));
	const errorMessage = resolvedSearchParams?.error ?? '';
	const successMessage = resolvedSearchParams?.message ?? '';

	return (
		<div className='min-h-screen flex items-center justify-center bg-background'>
			<div className='w-full max-w-md px-4'>
				<div className='mb-8 text-center'>
					<h1 className='text-3xl font-bold text-foreground'>SentinelView</h1>
					<p className='text-muted-foreground mt-2'>Panel de Administración</p>
				</div>

				{/* Muestra Alerta de Éxito: message=logout_success */}
				{successMessage === 'logout_success' && (
					<Alert className='mb-4 border-green-500 text-green-500'>
						<Terminal className='h-4 w-4' />
						<AlertTitle className='text-green-600'>Sesión Cerrada</AlertTitle>
						<AlertDescription>Has cerrado sesión exitosamente.</AlertDescription>
					</Alert>
				)}

				{/* Muestra Alerta de Error: error=session_expired */}
				{errorMessage === 'session_expired' && (
					<Alert
						variant='destructive'
						className='mb-4'
					>
						<Terminal className='h-4 w-4' />
						<AlertTitle>Sesión Expirada</AlertTitle>
						<AlertDescription>Tu sesión ha expirado. Por favor, inicia sesión de nuevo.</AlertDescription>
					</Alert>
				)}

				<LoginForm />
			</div>
		</div>
	);
}
