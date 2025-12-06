// src/app/page.tsx (Server Component por defecto)
import { cookies } from 'next/headers';
import AlertScannerDashboard from '@/components/alert-scanner-dashboard'; // Ruta de tu componente actual
import { redirect } from 'next/navigation';

// Definiciones de tipos (Asegúrate de que Device sea el mismo que en tu Dashboard)
type Device = {
  id: string;
  alias: string;
  ip: string; 
  status: 'connected' | 'disconnected';
  userRole: string; // Asegúrate de que este campo exista en tus datos
};

// --- Funciones del Lado del Servidor ---

/** * Función ASÍNCRONA para obtener el inventario de la API.
 * Aquí puedes usar claves secretas sin exponerlas al cliente.
 */
async function fetchInventoryData(accessToken: string): Promise<Device[]> {
  const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${BACKEND_URL}/api/inventory/devices`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`, // Token seguro
        'Content-Type': 'application/json',
      },
      // Desactiva el cache para datos operativos en tiempo real (opcional)
      cache: 'no-store',
    });

    if (response.status === 401) {
      // Si el Access Token expira, podrías intentar refrescarlo aquí o redirigir
      redirect('/login?expired=true');
    }

    if (!response.ok) {
      throw new Error(`Fallo al obtener datos: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching inventory:', error);
    // En caso de error, devuelve un array vacío o datos mock de seguridad
    return [];
  }
}

/** * Función para obtener el token de la cookie (Asume que usas un token de sesión/JWT en cookies).
 * Alternativamente, podrías obtenerlo del AuthContext si usaras sólo un Client Component para todo.
 */
function getAuthDataFromServer() {
  const cookieStore = cookies();
  // Reemplaza 'jwt-access-token' por el nombre real de tu cookie de token
  const accessToken = cookieStore.get('jwt-access-token')?.value || null;

  // Si el rol está codificado en la cookie, también lo obtendrías aquí.
  // Por simplicidad, asumiremos que el rol viene del componente que maneja la sesión.
  // **NOTA:** Para la seguridad total, el *middleware* ya debería haber verificado esto.

  if (!accessToken) {
    redirect('/login'); // Redirige si no hay token (aunque el middleware debería hacerlo)
  }

  return { accessToken };
}

export default async function DashboardPage() {
  const { accessToken } = getAuthDataFromServer();

  // 1. Obtiene los datos iniciales del inventario en el servidor
  const initialDevices = await fetchInventoryData(accessToken);

  // 2. Aquí podrías obtener el rol de usuario si es necesario para el componente padre
  const currentUser = { name: 'Admin', role: 'SUPER_ADMIN' };

  return (
    // 3. Pasa los datos iniciales al componente cliente
    <AlertScannerDashboard
      initialDevices={initialDevices}
      currentUser={currentUser}
    />
  );
}
