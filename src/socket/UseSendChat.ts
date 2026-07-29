import { useWebSocket } from "./WebSocketProvider";

export const useSendChat = () => {
    const { sendMessage } = useWebSocket();

    const sendChat = (toUserId: number, message: string) => {
        sendMessage({
            type: "send_message",
            toUserId, 
            message
        });
    }

    return sendChat;
}

