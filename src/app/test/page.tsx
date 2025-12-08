export default function TestPage () {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Página de Prueba - Cabecera Fija</h1>
      <p className="mb-4">
        Esta es una tabla HTML simple para probar el comportamiento de la cabecera fija (`sticky`).
        El contenedor de la tabla tiene una altura fija y `overflow-auto`. La cabecera (`thead`)
        tiene las clases `sticky top-0` y un color de fondo.
      </p>
      {/* 1. Contenedor con altura definida, scroll y posicionamiento relativo */}
      <div className="relative h-96 overflow-auto rounded-md border">
        <table className="w-full text-sm text-left">
          {/* 2. Cabecera Fija (sticky) con color de fondo */}
          <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2">Columna 1</th>
              <th className="px-4 py-2">Columna 2</th>
              <th className="px-4 py-2">Columna 3</th>
              <th className="px-4 py-2">Columna 4</th>
              <th className="px-4 py-2">Columna 5</th>
            </tr>
          </thead>
          {/* 3. Cuerpo de la tabla con suficiente contenido para provocar scroll */}
          <tbody>
            {Array.from({ length: 50 }).map((_, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2">Fila {index + 1}, Celda 1</td>
                <td className="px-4 py-2">Fila {index + 1}, Celda 2</td>
                <td className="px-4 py-2">Fila {index + 1}, Celda 3</td>
                <td className="px-4 py-2">Fila {index + 1}, Celda 4</td>
                <td className="px-4 py-2">Fila {index + 1}, Celda 5</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
