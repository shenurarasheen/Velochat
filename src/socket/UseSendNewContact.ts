import { useEffect, useState } from "react";
import { User, WSResponse } from "./Chat";
import { useWebSocket } from "./WebSocketProvider"
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

export const useSendNewContact = () => {
    const { socket, sendMessage } = useWebSocket();
    const [ responseText, setResponseText ] = useState("");
    const sendNewContact = (user: User) => {
        sendMessage({type: "save_new_contact", user});
    };

    useEffect(() => {

        if (!socket) {
            return;
        }

        const onMessage = (event: MessageEvent) => {
            const res: WSResponse = JSON.parse(event.data);
            if (res.type === "new_contact_response_text") {

                if (res.type === "new_contact_response_text") {

                    if (res.payload.responseStatus) {
                        setResponseText(res.payload.message);
                        Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: "Success",
                            textBody: res.payload.message
                        });
                        return;
                    }

                    Toast.show({
                        type:ALERT_TYPE.WARNING,
                        title: "Warning",
                        textBody: res.payload.message
                    });

                }
            }
        }

        socket.addEventListener("message", onMessage);

        return () => {
            socket.removeEventListener("message", onMessage);
        }
    }, [socket]);

    return {sendNewContact, responseText}
}