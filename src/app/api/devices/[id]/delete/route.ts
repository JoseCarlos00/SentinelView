import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	// Obtener token
	const token = await cookies()
  const tokenValue = token.get('access_token')?.value;

	if (!tokenValue) {
		return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
	}

	try {
		// Verificar token
		const payload = jwt.verify(tokenValue, process.env.JWT_SECRET!) as any;

		// Verificar rol (solo SUPER_ADMIN puede eliminar)
		if (payload.role !== 'SUPER_ADMIN') {
			return NextResponse.json(
				{
					success: false,
					message: 'Solo SUPER_ADMIN puede eliminar dispositivos',
					currentRole: payload.role,
				},
				{ status: 403 }
			);
		}

		// Lógica para eliminar dispositivo
		const deviceId = params.id;
		// await deleteDevice(deviceId);

		return NextResponse.json({
			success: true,
			message: 'Dispositivo eliminado',
		});
	} catch (error) {
		return NextResponse.json({ success: false, message: 'Token inválido' }, { status: 401 });
	}
}
