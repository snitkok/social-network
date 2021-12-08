import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "../socket";

export default function Chat() {
    const chatMessages = useSelector((state) => state?.messages);
    console.log("chat messages", chatMessages);
    const textareaRef = useRef();
    // const chatContainerRef = useRef();

    useEffect(() => {
        // chatContainerRef.current.scrollTop =
        //     chatContainerRef.current.scrollHeight;
    }, [chatMessages]);

    const keyCheck = (e) => {
        console.log("🐳", e.target.value);
        if (e.key === "Enter") {
            e.preventDefault();

            socket.emit("newChatMessage", e.target.value);
            textareaRef.current.value = "";
        }
    };

    return (
        <div>
            <div>
                <h2 className="m-4">Join the conversation</h2>
                <div className="chatContainer m-4 h-96 w-1/3 flex flex-col-reverse overflow-y-scroll ring ring-yellow-400 ring-offset-4 ring-offset-yellow-100 rounded">
                    {chatMessages &&
                        chatMessages.map((message) => (
                            <div key={message.messageId}>
                                <div className="userInfo">
                                    <img
                                        className="results rounded-full h-20 w-20 mt-4 mb-4 ml-2 mr-2 ring ring-gray-400 ring-offset-4 ring-offset-blue-100"
                                        src={message.image_url}
                                    />
                                    <p>{message.first}</p>
                                </div>
                                <div className="userMessage">
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <textarea
                ref={textareaRef}
                placeholder="Enter your message"
                onKeyDown={keyCheck}
                className="m-4 border-2 border-yellow-300 rounded w-1/3 h-36"
            />
        </div>
    );
}
