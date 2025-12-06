export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bienvenido al Panel de Control de SentinelView</h1>
        <p className="text-muted-foreground mt-2">
          Este es el dashboard principal donde podrás ver métricas y estadísticas importantes. El contenido específico
          se agregará próximamente.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Espacio reservado para futuras métricas y widgets */}
      </div>
    </div>
  )
}
