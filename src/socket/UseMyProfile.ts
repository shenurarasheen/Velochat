import { useContext, useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider"
import { User, WSResponse } from "./Chat";
import { AuthContext } from "../components/AuthProvider";

export const useUserProfile = () => {
    const { socket, sendMessage } = useWebSocket();
    const [ userProfile, setUserProfile ] = useState<User>();
    const auth = useContext(AuthContext);

    const sendProfile = (image: string) => {
        sendMessage({type: "set_user_profile", image});
    }

    useEffect(() => {
        if (!socket) {
            return;
        }

        sendMessage({type: "send_profile_details"});
        const onMessage = (event: MessageEvent) => {
            let res: WSResponse = JSON.parse(event.data);
            console.log(res.payload);

            if(res.type === "user_profile_details") {
                setUserProfile(res.payload);
            }
        }

        socket.addEventListener("message", onMessage);

        return () => {
            socket.removeEventListener("message", onMessage);
        }
    }, []);

    return {sendProfile, userProfile}
}