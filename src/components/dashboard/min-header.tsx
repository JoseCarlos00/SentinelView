'use client'

import { useUser } from "@/hooks/use-user";

export default function MinHeader() {
  const user = useUser((state) => state.user);
  console.log({user});
  
  return (
		<header className='bg-white border-b'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
						<p className='mt-1 text-sm text-gray-500'>Hola: {user?.username} 👋</p>

						<p className='mt-1 text-sm text-gray-500'>Sistema de localización de equipos RF</p>
					</div>
				</div>
			</div>
		</header>
	);
}
