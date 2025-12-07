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
    roles: ['SUPER_ADMIN', 'ADMIN'],
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
    <aside className="w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="text-lg font-semibold text-sidebar-foreground"><Link href="/">Panel Admin</Link></h1>
      </div>
      <nav className="space-y-1 p-4">
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
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <Icon className='h-4 w-4' />
                {item.title}
              </Link>
            );
          })}
      </nav>
    </aside>
  )
}
