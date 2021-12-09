import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "../socket";
import { Link } from "react-router-dom";

export default function Chat() {
    const chatMessages = useSelector((state) => state?.messages);
    console.log("chat messages", chatMessages);
    const textareaRef = useRef();

    useEffect(() => {}, [chatMessages]);

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

            <div
                className="
                    container 
                    h-96 w-2/3 
                    m-4 
                    flex 
                    flex-col-reverse 
                    overflow-y-scroll 
                  rounded  ring ring-blue-800
                    ring-offset-4 ring-offset-black
                    "
            >
                {chatMessages &&
                    chatMessages.map((message) => (
                        <div className="" key={message.messageId}>
                            {message.loggedInUserAuthor && (
                                <div className="flex flex-col userEntry inline-flex w-full">
                                    <div className="flex flex-row-reverse justify-start">
                                        <div className="userInfo">
                                            <Link to={`/user/${message.id}`}>
                                                <img
                                                    className="userPic rounded-full h-20 w-20 mt-4 mb-4 ml-2 mr-2 ring ring-blue-800 ring-offset-4 ring-offset-black"
                                                    src={message.image_url}
                                                />
                                            </Link>
                                        </div>

                                        <div className="userMessage m-4">
                                            <p className="text-right">
                                                {message.first}
                                            </p>
                                            <p>{message.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!message.loggedInUserAuthor && (
                                <div className="inline-flex">
                                    <div className="userInfo">
                                        <Link to={`/user/${message.id}`}>
                                            <img
                                                className="results rounded-full h-20 w-20 mt-4 mb-4 ml-2 mr-2 ring ring-blue-800 ring-offset-4 ring-offset-black"
                                                src={message.image_url}
                                            />
                                        </Link>
                                    </div>

                                    <div className="userMessage m-4">
                                        <p className="">{message.first}</p>
                                        <p>{message.message}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
            </div>
            <textarea
                ref={textareaRef}
                placeholder="Enter your message"
                onKeyDown={keyCheck}
                className="m-4 border-2 border-blue-800 rounded w-1/3 h-36"
            />
        </div>
    );
}
