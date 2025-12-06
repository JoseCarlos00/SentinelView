import { WebSocketServer } from 'ws';
// import { handleEquipmentEvent } from './handlers/equipment-handler';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (client) => {
	client.on('message', (raw) => {
		const msg = JSON.parse(raw.toString());
		if (msg.type === 'equipment_event') {
			// handleEquipmentEvent(msg.data);
		}
	});
});
