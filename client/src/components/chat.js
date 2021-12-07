import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "../socket";

export default function Chat() {
    const chatMessages = useSelector((state) => state?.chatMessages);
    console.log("chat messages", chatMessages);
    const textareaRef = useRef();
    // const chatContainerRef = useRef();

    useEffect(() => {
    }, [chatMessages]);

    const keyCheck = (e) => {
        console.log("🐳",e.target.value);
        if (e.key === "Enter") {
            e.preventDefault();

            socket.emit("newChatMessage", e.target.value);
            textareaRef.current.value = "";
        }
    };

    return (
        <div>
            <div>
                <h2>Join the conversation</h2>
                <div>
                    {chatMessages &&
                        chatMessages.map((message) => (
                            <div key={message.id}>
                                <div>
                                    <img src={message.image_url} />
                                    <p>{message.first}</p>
                                </div>
                                <div>
                                    <p>{message.message}</p>
                                    <p>{message.created_at}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <textarea
                ref={textareaRef}
                className="input-container"
                placeholder="Enter your message"
                onKeyDown={keyCheck}
            />
        </div>
    );
}
