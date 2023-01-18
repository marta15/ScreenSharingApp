import useWebSocket from 'react-use-websocket';
import { JsonValue } from 'react-use-websocket/dist/lib/types';

type Callback = (e: WebSocketEventMap['message']) => void;

export default abstract class WebSocketApi {

    static WS_URL = 'ws://127.0.0.1:8000';
    static sendMessage: (message: JsonValue) => void;
    static callbacks: { messageType: string, callback: Callback }[] = [];

    static openConnection = (closeTransmission: () => void) => {

        const { sendJsonMessage } = useWebSocket(this.WS_URL, {
            onClose: closeTransmission,
            share: true,
            shouldReconnect: (closeEvent) => true,
            onMessage: (event: WebSocketEventMap['message']) => this.processMessage(event)
        });
        this.sendMessage = sendJsonMessage;
    }

    static subscribeToMessage = (messageType: string, callback: Callback) => {
        this.callbacks.push({ messageType, callback });
    }

    static send = (message: JsonValue) => {
        console.log("Sending message: ");
        console.log(message);
        this.sendMessage(message);
    }


    static processMessage = (event: WebSocketEventMap['message']) => {
        let evData = JSON.parse(event.data);
        console.log(this.callbacks);
        for (let c of this.callbacks) {
            if (evData.data.type === c.messageType) {
                c.callback(event);
            }
        }
    }

}