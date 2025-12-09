export interface Equipment {
	id: string;
	name: string;
	model: string;
	status: EquipmentStatus;
}

export type EquipmentStatus = 'online' | 'offline' | 'error';

// Definiciones de tipos (Asegúrate de que Device sea el mismo que en tu Dashboard)
export type MappingData = {
	id: string;
	alias: string;
	ip: string;
	status: 'connected' | 'disconnected';
	userRole: string; // Asegúrate de que este campo exista en tus datos
};

export interface Device {
	id: string;
	androidId: string | null;
	equipo: string;
	modelo: string;
	usuario: string;
	correo: string;
	aliasUsuario: string | null;
	ip: string;
	macAddress: string;
	isConnected: boolean;
}
