/* eslint-disable indent */
import { useState, useEffect } from "react";

export default function FriendButton({ viewedUserId }) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        fetch(`/friendshipstatus/${viewedUserId}`)
            .then((res) => res.json())
            .then((result) => {
                console.log("result**************", result);
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
                console.log("🦀", response.userId, response.sender_id);
                return "Cancel Friend Request";
            } else if (response.userId == response.recipient_id) {
                console.log("🦀", response.userId, response.recipient_id);
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
                console.log("response%%%%%%%%%%%%%%%%%%🦞", result);
                console.log("viewedUserId", viewedUserId);
                console.log("buttonText", buttonText);
                // setButtonText(handleButtonText(result));
            });
    }

    // friendBtn should be passed the other userId via props from the otherProfile on which
    // this btn will be rendered
    // we need this info for that we can figure out, what the btn should read.
    // LOGIC I:
    // we'll want to add a useEffect to make a request to the server to find out
    // our current relationship status with the user we are looking at
    // as a result of this fetch our btn should display the correct txt!

    //LOGIC II:
    // when the btn gets clicked, we need to update the relationship in the database,
    // and update the btn text to reflect this change
    return <button onClick={handleFriendshipStatus}>{buttonText}</button>;

    //we need this logic for that we can figure out, what the button should display
    //Logic I
    // we'll want to add a useeffect to make a request to the
}
