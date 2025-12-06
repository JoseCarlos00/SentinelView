import AlertScannerDashboard from '@/components/alert-scanner-dashboard';
import DeviceTableContent from '@/components/inventory/device-table-content';
import { fetchInventoryData, getAuthDataFromServer } from '@/lib/server-utils'; // Funciones creadas en la respuesta anterior

export default async function DashboardPage() {
	// 1. Obtiene de forma SEGURA el Access Token y la información del usuario
	// const { accessToken, currentUser } = getAuthDataFromServer();
  const { accessToken } = await getAuthDataFromServer();
  const currentUser = { name: 'Admin', role: 'SUPER_ADMIN' };


	// 2. Obtiene los datos de inventario con el token (en el servidor)
	const initialDevices = await fetchInventoryData(accessToken);

	return (
		// 3. El componente Cliente (AlertScannerDashboard) envuelve al Server Component (DeviceTableContent)
		<AlertScannerDashboard currentUser={currentUser}>
			{/* El Server Component DeviceTableContent se renderiza a HTML 
        antes de que AlertScannerDashboard se 'hidrate' en el cliente.
      */}
			<DeviceTableContent devices={initialDevices} />
		</AlertScannerDashboard>
	);
}
