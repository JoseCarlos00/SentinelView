import  LoginForm  from '@/components/auth/login-form';
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
		<div className='min-h-screen flex items-center justify-center bg-background p-4'>
			{/* Fondo con gradiente sutil */}
			<div className='absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]'></div>

			<div className='w-full max-w-md px-4'>
				<div className='mb-8 text-center'>
					<h1 className='text-3xl font-bold text-foreground'>SentinelView</h1>
					<p className='text-muted-foreground mt-2'>Panel de Administración</p>
				</div>

				{/* Alerta de Éxito: Usando variante 'default' con colores de tema */}
				{successMessage === 'logout_success' && (
					<Alert className='mb-4 border-green-500/50 text-green-700 dark:text-green-400'>
						<Terminal className='h-4 w-4 text-green-700 dark:text-green-400' />
						<AlertTitle className='text-green-800 dark:text-green-300'>Sesión Cerrada</AlertTitle>
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
