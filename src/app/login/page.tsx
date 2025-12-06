import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">SentinelView</h1>
          <p className="text-muted-foreground mt-2">Panel de Administración</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
