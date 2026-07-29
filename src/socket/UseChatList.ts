import { useEffect, useState } from "react";
import { Chat, WSResponse } from "./Chat";
import { useWebSocket } from "./WebSocketProvider";

export const useChatList = (): Chat[] => {
    const {socket, sendMessage} = useWebSocket();
    const [chatList, setChatList] = useState<Chat[]>([]);

    useEffect(() => {
        if (!socket) {
            return;
        }
        sendMessage({type: "get_chat_list"});
        const onMessage = (event: MessageEvent) => {
            let res: WSResponse = JSON.parse(event.data);
            console.log(res.payload);

            if (res.type === "friend_list") {
                setChatList(res.payload);
            }
        }
        socket.addEventListener("message", onMessage);
        return () => {
            socket.removeEventListener("message", onMessage);
        }
    }, [socket, chatList]);

    return chatList;
}