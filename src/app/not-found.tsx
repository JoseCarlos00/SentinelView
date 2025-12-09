// app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-background p-4'>
			<div className='absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]'></div>

			<div className='text-center px-4'>
				<h1 className='text-9xl font-bold text-primary'>404</h1>
				<h2 className='text-3xl font-semibold text-foreground mt-4'>Página no encontrada</h2>
				<p className='text-muted-foreground mt-2 mb-8'>La página que buscas no existe o fue movida.</p>

				<div className='flex gap-4 justify-center'>
					<Link href='/dashboard'>
						<Button size='lg'>
							<Home className='mr-2 h-4 w-4 cursor-pointer' />
							Ir al Dashboard
						</Button>
					</Link>
					<Link href='/'>
						<Button
							size='lg'
							variant='outline'
							className='cursor-pointer'
						>
							<Search className='mr-2 h-4 w-4' />
							Página Principal
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
