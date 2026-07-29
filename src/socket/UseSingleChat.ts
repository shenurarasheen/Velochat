import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Chat, User, WSResponse } from "./Chat";

const useSingleChat = (friendId: number) => {

    const {socket, sendMessage} = useWebSocket();
    const [messages, setMessages] = useState<Chat[]>([]);
    const [friend, setFriend] = useState<User>();

    useEffect(() => {
        if (!socket) {
            return;
        }

        sendMessage({type: "get_single_chat", friendId});

        const onMessage = (event: MessageEvent) => {
            const res:WSResponse = JSON.parse(event.data);
            if (res.type === "single_chat") {
                setMessages(res.payload);
            }

            if (res.type === "new_message" && res.payload.to.id === friendId) {
                setMessages((prev) => [...prev, res.payload])
            }
        }

        socket.addEventListener("message", onMessage);

        return () => {
            socket.removeEventListener("message", onMessage);
        }
    }, [socket, friendId]);

    return {messages};
}

export default useSingleChat;