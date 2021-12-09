/* eslint-disable indent */
import { useState, useEffect } from "react";

export default function FriendButton({ viewedUserId }) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        fetch(`/friendshipstatus/${viewedUserId}`)
            .then((res) => res.json())
            .then((result) => {
                setButtonText(handleButtonText(result));
            });
    }, []);

    function handleButtonText(response) {
        if (response.requestSent == false) {
            return "Send Friend Request";
        } else if (response.accepted == true) {
            return "Unfriend";
        } else if (response.accepted == false) {
            if (response.userId == response.sender_id) {
                return "Cancel Friend Request";
            } else if (response.userId == response.recipient_id) {
                return "Accept Friend Request";
            }
        } else {
            return "Oooops(";
        }
    }

    function handleFriendshipStatus() {
        fetch(`/update/friendshipstatus/${viewedUserId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                buttonText: buttonText,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                setButtonText(handleButtonText(result));
            });
    }

    return (
        <button
            onClick={handleFriendshipStatus}
            className="m-4 p-1 rounded-full py-3 px-6 transition duration-500 ease-in-out bg-gray-400 hover:bg-yellow-400 transform hover:-translate-y-1 hover:scale-110 "
        >
            {buttonText}
        </button>
    );
}
