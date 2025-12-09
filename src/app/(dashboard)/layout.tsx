import AppHeader from '@/components/layout/app-header';
// import AdminSidebar from '@/components/admin-sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='min-h-screen bg-gray-50'>
			<AppHeader />
			<div className='flex'>
				{/* <AdminSidebar /> */}
				<main className='flex-1'>{children}</main>
			</div>
		</div>
	);
}
