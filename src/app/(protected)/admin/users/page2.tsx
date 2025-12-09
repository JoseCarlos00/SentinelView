import { redirect } from 'next/navigation';
import UsersClientPage from '@/components/admin/users-client-page'

type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER"

const ALLOWED_ROLES: UserRole[] = ['SUPER_ADMIN'];

export default async function UsersPage() {
	const currentUser = {
			username: 'Test',
			role: 'SUPER_ADMIN',
			id: '1'
		}

	// Verificación de rol en el servidor
	if (!ALLOWED_ROLES.includes(currentUser.role as UserRole)) {
		redirect('/forbidden');
	}

	// Pasamos los datos al componente cliente para que maneje la interactividad.
	return <UsersClientPage />;
}
