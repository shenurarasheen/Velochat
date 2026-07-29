import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider"
import { FriendList, User, WSResponse } from "./Chat";

export const useFriendList = () => {
    const { socket, sendMessage } = useWebSocket();
    const [friends, setFriends] = useState<User[]>([]);

    useEffect(() => {
        if (!socket) {
            return;
        }
        sendMessage({type: "get_all_friends"});

        const onMessage = (event: MessageEvent) => {
            const res: WSResponse = JSON.parse(event.data);
            if (res.type === "all_friends") {
                setFriends(res.payload);
            }
        }

        socket.addEventListener("message", onMessage);

        return () => {
            socket.removeEventListener("message", onMessage);
        }
    }, [socket]);

    return friends;
}