import AlertScannerDashboard from '@/components/alert-scanner-dashboard';
import DeviceTableContent from '@/components/inventory/device-table-content';
import { fetchInventoryData, fetchInventoryDataTest, getAuthDataFromServer } from '@/lib/server-utils';

export default async function DashboardPage() {
	// 1. La información del usuario y la sincronización de Zustand ya se manejan en el layout.
	//    Gracias a React.cache, esta llamada no vuelve a ejecutar la función,
	//    sino que devuelve los datos ya obtenidos en el layout.
	const { accessToken, currentUser } = await getAuthDataFromServer();

	// 2. Obtiene los datos de inventario con el token (en el servidor)
	const initialDevices = await fetchInventoryDataTest(accessToken);

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
