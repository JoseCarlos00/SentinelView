"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Users } from "lucide-react"
import { cn } from "@/lib/utils"

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

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all w-18 lg:w-64">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
          {/* Puedes usar un logo aquí si quieres */}
          <Package className="h-6 w-6" />
          <span className="hidden lg:inline">Panel Admin</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        {menuItems
          .filter((item) => {
            // Si el item no tiene una propiedad 'roles', es público para todos.
            // Si la tiene, verifica si el rol del usuario actual está incluido.
            return !item.roles || item.roles.includes(currentUser.role);
          })
          .map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn( // Se justifica al centro en modo ícono
                  'flex items-center justify-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors lg:justify-start lg:px-3',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <Icon className='h-5 w-5' />
                <span className="hidden lg:inline">{item.title}</span>
              </Link>
            );
          })}
      </nav>
    </aside>
  )
}
