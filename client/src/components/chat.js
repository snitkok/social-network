import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "../socket";

export default function Chat() {
    const chatMessages = useSelector((state) => state?.messages);
    console.log("chat messages", chatMessages);
    const textareaRef = useRef();

    useEffect(() => {
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
            <h2 className="m-4">Join the conversation</h2>
            <div className="m-4">
                <div
                    className=" 
                    h-96 w-2/3 
                    flex 
                    flex-col-reverse 
                    overflow-y-scroll 
                    rounded
                    mt-4 mb-4 ml-2 mr-2 ring ring-yellow-400 ring-offset-4 ring-offset-yellow-100"
                >
                    {chatMessages &&
                        chatMessages.map((message) => (
                            <div
                                className="inline-flex"
                                key={message.messageId}
                            >
                                <div className="userInfo">
                                    <img
                                        className="results rounded-full h-20 w-20 mt-4 mb-4 ml-2 mr-2 ring ring-gray-400 ring-offset-4 ring-offset-blue-100"
                                        src={message.image_url}
                                    />
                                </div>
                                <hr />

                                <div className="">
                                    <p className="">{message.first}</p>
                                    {message.loggedInUserAuthor && (
                                        <div className="userMessage  bg-red-500">
                                            {/* <p>{message.created_at}</p> */}
                                            <p>{message.message}</p>
                                        </div>
                                    )}
                                    {!message.loggedInUserAuthor && (
                                        <div className="userMessage bg-blue-500">
                                            {/* <p>{message.created_at}</p> */}
                                            <p>{message.message}</p>
                                        </div>
                                    )}
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
