export interface Equipment {
	id: string;
	name: string;
	model: string;
	status: EquipmentStatus;
}

export type EquipmentStatus = 'online' | 'offline' | 'error';
