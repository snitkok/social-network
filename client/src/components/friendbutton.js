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
        fetch("/update/friendshipstatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                viewedUserId: viewedUserId,
                buttonText: buttonText,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                setButtonText(handleButtonText(result));
            });
    }

    return <button onClick={handleFriendshipStatus}>{buttonText}</button>;
}
