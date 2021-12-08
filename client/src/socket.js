import {
    chatMessagesReceived,
    chatMessageReceived,
} from "./redux/messages/slice.js";

import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (messages) =>
            store.dispatch(chatMessagesReceived(messages))
        );

        socket.on("chatMessage", (message) =>
            store.dispatch(chatMessageReceived(message))
        );
    }
};
