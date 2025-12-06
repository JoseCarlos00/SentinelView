import type React from "react"
import  AppSidebar  from "@/components/AdminSidebar"
import  AppHeader  from "@/components/AppHeader"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader currentUser={{ name: "Admin Protect", role: "SUPER_ADMIN" }}/>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
