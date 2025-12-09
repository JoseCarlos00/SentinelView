export interface Equipment {
	id: string;
	name: string;
	model: string;
	online: boolean;
	battery?: number;
	lastSeen?: string;
	location?: string;
	ipAddress?: string;
}

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
