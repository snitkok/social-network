export default function messagesReducer
(messages = null, action) {
    if (action.type == "messages/chatMessagesReceived") {
        messages = action.payload.messages;
        console.log("we are in messages/chatMessagesReceived 🍥", messages);
    }

    if (action.type == "messages/chatMessageReceived") {
        const lastMessage = action.payload.message;
        messages = [lastMessage, ...messages];
        console.log("messages/receiveMessages 🍄", messages);
    }
    return messages;
}

//Create and Export all our functions

export function chatMessagesReceived(messages) {
    return {
        type: "messages/chatMessagesReceived",
        payload: { messages },
    };
}

export function chatMessageReceived(message) {
    return {
        type: "messages/chatMessageReceived",
        payload: { message },
    };
}
