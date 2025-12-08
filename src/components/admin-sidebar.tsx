"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation';
import { Menu, Package, Users } from 'lucide-react';
import { cn } from "@/lib/utils"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: 'Inventario',
    href: '/',
    icon: Package,
    // Si no se especifica 'roles', es visible para todos.
  },
  {
    title: 'Gestión de Usuarios',
    href: '/admin/users',
    icon: Users,
    // Solo los roles en este array pueden ver este elemento.
    roles: ['SUPER_ADMIN'],
  },
]

interface AdminSidebarProps {
  currentUser: {
    username: string
    role: string
  }
}

export default function AdminSidebar({ currentUser }: AdminSidebarProps) {
  const pathname = usePathname()

	const filteredMenuItems = menuItems.filter((item) => {
		// Si el item no tiene una propiedad 'roles', es público para todos.
		// Si la tiene, verifica si el rol del usuario actual está incluido.
		return !item.roles || item.roles.includes(currentUser.role);
	});

  return (
		<>
			{/* --- Barra Lateral para Escritorio (Visible en lg y superior) --- */}
			<aside className='fixed inset-y-0 left-0 z-20 hidden h-fit flex-col border-r border-sidebar-border bg-sidebar transition-all md:flex md:w-64 md:h-full'>
				<div className='flex h-16 items-center border-b border-sidebar-border px-6'>
					<Link
						href='/'
						className='flex items-center gap-2 font-semibold'
					>
						<Package className='h-6 w-6' />
						<span>Panel Admin</span>
					</Link>
				</div>

				<nav className='flex flex-col gap-2 p-4'>
					{filteredMenuItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'flex items-center gap-3 rounded-lg py-2 px-3 text-sm font-medium transition-colors',
									isActive
										? 'bg-sidebar-accent text-sidebar-accent-foreground'
										: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
								)}
							>
								<Icon className='h-5 w-5' />
								<span>{item.title}</span>
							</Link>
						);
					})}
				</nav>
			</aside>

			{/* --- Menú Desplegable para Móvil (Oculto en md y superior) --- */}
			<div className='fixed top-0 left-0 z-30 flex h-16 items-center px-4 md:hidden'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='outline'
							size='icon'
						>
							<Menu className='h-5 w-5' />
							<span className='sr-only'>Abrir menú</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='start'>
						{filteredMenuItems.map((item) => (
							<DropdownMenuItem key={item.href} asChild>
								<Link href={item.href}>{item.title}</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
}
