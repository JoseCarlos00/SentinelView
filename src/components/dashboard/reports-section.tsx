import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Reportes y Análisis</CardTitle>
        <CardDescription>Estadísticas de uso y rendimiento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='p-4 border rounded-lg bg-muted/50'>
            <h3 className='text-sm font-medium text-muted-foreground'>Dispositivos Localizados (Hoy)</h3>
            <p className='text-3xl font-bold mt-2'>42</p>
            <p className='text-xs text-muted-foreground mt-1'>+12% vs ayer</p>
          </div>

          <div className='p-4 border rounded-lg bg-muted/50'>
            <h3 className='text-sm font-medium text-muted-foreground'>Tiempo Promedio de Localización</h3>
            <p className='text-3xl font-bold mt-2'>2.3m</p>
            <p className='text-xs text-muted-foreground mt-1'>-8% vs semana pasada</p>
          </div>

          <div className='p-4 border rounded-lg bg-muted/50'>
            <h3 className='text-sm font-medium text-muted-foreground'>Equipos con Batería Baja</h3>
            <p className='text-3xl font-bold mt-2 text-yellow-600 dark:text-yellow-400'>7</p>
            <p className='text-xs text-muted-foreground mt-1'>Requieren carga</p>
          </div>
        </div>

        <div className='mt-6'>
          <h3 className='text-sm font-semibold mb-3'>Actividad Reciente</h3>
          <div className='space-y-2'>
            {[
              { time: '10:23', action: 'Dispositivo Zebra-045 localizado', user: 'Juan P.' },
              { time: '10:15', action: 'Alarma activada en Datalogic-012', user: 'María G.' },
              { time: '09:58', action: 'Dispositivo UROBO-087 conectado', user: 'Sistema' },
            ].map((activity, i) => (
              <div
                key={i}
                className='flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm'
              >
                <div className='flex items-center gap-3'>
                  <span className='text-xs text-muted-foreground font-mono'>{activity.time}</span>
                  <span>{activity.action}</span>
                </div>
                <span className='text-xs text-muted-foreground'>{activity.user}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
