import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Device } from '@/types/devices';

/** * Función ASÍNCRONA para obtener el inventario de la API.
 * Aquí puedes usar claves secretas sin exponerlas al cliente.
 */
export async function fetchInventoryData(accessToken: string): Promise<Device[]> {
	const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

	try {
		// const response = await fetch(`${BACKEND_URL}/api/inventory/devices`, {
		// 	method: 'GET',
		// 	headers: {
		// 		Authorization: `Bearer ${accessToken}`, // Token seguro
		// 		'Content-Type': 'application/json',
		// 	},
		// 	// Desactiva el cache para datos operativos en tiempo real (opcional)
		// 	cache: 'no-store',
		// });

		// if (response.status === 401) {
		// 	// Si el Access Token expira, podrías intentar refrescarlo aquí o redirigir
		// 	redirect('/login?expired=true');
		// }

		// if (!response.ok) {
		// 	throw new Error(`Fallo al obtener datos: ${response.status}`);
		// }

		// return response.json();
		return [
			{ id: '1', alias: 'Router Principal', ip: '192.168.1.1', status: 'connected', userRole: 'ADMIN' },
			{ id: '2', alias: 'Switch Core', ip: '192.168.1.10', status: 'connected', userRole: 'OPERATOR' },
			{ id: '3', alias: 'Firewall Gateway', ip: '192.168.1.254', status: 'disconnected', userRole: 'SUPER_ADMIN' },
			{ id: '4', alias: 'AP Oficina Norte', ip: '192.168.2.1', status: 'connected', userRole: 'OPERATOR' },
			{ id: '5', alias: 'AP Oficina Sur', ip: '192.168.2.2', status: 'disconnected', userRole: 'OPERATOR' },
			{ id: '6', alias: 'Server Backup', ip: '192.168.3.50', status: 'connected', userRole: 'ADMIN' },
		];
	} catch (error) {
		console.error('Error fetching inventory:', error);
		// En caso de error, devuelve un array vacío o datos mock de seguridad
		return [];
	}
}

/** * Función para obtener el token de la cookie (Asume que usas un token de sesión/JWT en cookies).
 * Alternativamente, podrías obtenerlo del AuthContext si usaras sólo un Client Component para todo.
 */
export async function getAuthDataFromServer() {
	const cookieStore = await cookies();
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
