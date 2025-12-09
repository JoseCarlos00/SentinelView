	"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Settings, BarChart3, PanelLeftClose } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
	{ href: "/dashboard", label: "Inicio", icon: Home },
	{ href: "/dashboard/reports", label: "Reportes", icon: BarChart3 },
	{ href: "/dashboard/users", label: "Usuarios", icon: Users },
	{ href: "/dashboard/settings", label: "Configuración", icon: Settings },
]

interface AppSidebarProps {
	className?: string,
	onMenuClick?: () => void,
}

export default function AppSidebar({ className, onMenuClick }: AppSidebarProps) {
	const pathname = usePathname()

	return (
		<aside className={cn("border-r bg-card text-card-foreground", className)}>
			<div className="flex h-full max-h-screen flex-col gap-2">
				<div className="flex h-16 items-center border-b px-6 max-sm:justify-between">
					<Link href="/dashboard" className="flex items-center gap-2 font-semibold">
						{/* Puedes poner tu logo aquí */}
						<span className="">Device Admin</span>
					</Link>

					<PanelLeftClose className="block md:hidden" onClick={onMenuClick} />
				</div>
				<div className="flex-1 overflow-y-auto py-2">
					<nav className="grid items-start px-4 text-sm font-medium">
						{navItems.map(({ href, label, icon: Icon }) => {
							const isActive = pathname === href
							return (
								<Link
									key={href}
									href={href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
										isActive && "bg-muted text-primary"
									)}
								>
									<Icon className="h-4 w-4" />
									{label}
								</Link>
							)
						})}
					</nav>
				</div>
			</div>
		</aside>
	)
}
