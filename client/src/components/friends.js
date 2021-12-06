import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsAndWannabes,
    rejectFriend,
    acceptFriend,
} from "./../redux/friends/slice.js";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    const currentFriends = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((friend) => friend.accepted)
    );
    console.log("current friends", currentFriends);
    const wannabes = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((friend) => !friend.accepted)
    );

    useEffect(() => {
        fetch("/friends-and-wannabes")
            .then((res) => res.json())
            .then((data) => {
                dispatch(receiveFriendsAndWannabes(data));
                console.log("friends-and-wannabes", data);
            })
            .catch((err) => {
                console.log("error in friends.js", err);
            });
    }, []);

    function acceptFriendReq(id) {
        fetch(`/update/friendshipstatus/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                buttonText: "Accept Friend Request",
            }),
        })
            .then((res) => res.json())
            .then(() => {
                dispatch(acceptFriend(id));
            });
    }

    function rejectFriendReq(id) {
        fetch(`/update/friendshipstatus/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                buttonText: "Unfriend",
            }),
        })
            .then((res) => res.json())
            .then(() => {
                dispatch(rejectFriend(id));
            });
    }

    return (
        <div>
            <h2>Your friends</h2>
            <div className="friends flex flex-row mb-20">
                {currentFriends &&
                    currentFriends.map((individual) => (
                        <div key={individual.id} className="m-2 justify-center">
                            <Link to={`/user/${individual.id}`}>
                                <img
                                    className="results 
                                    h-64 w-48 p-2"
                                    src={individual.image_url}
                                ></img>
                                <p className="flex-shrink">
                                    {individual.first} {individual.last}
                                </p>
                            </Link>
                            <button
                                className="rounded-full py-3 px-6 transition duration-500 ease-in-out bg-pink-600 hover:bg-purple-800 transform hover:-translate-y-1 hover:scale-110 "
                                onClick={() => rejectFriendReq(individual.id)}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
            </div>
            <h2>Your Wannabes</h2>
            <div className="wannabes friends flex flex-row mb-20 inline-flex ">
                {wannabes &&
                    wannabes.map((individual) => (
                        <div
                            key={individual.id}
                            className="m-2 justify-center "
                        >
                            <Link to={`/user/${individual.id}`}>
                                <img
                                    className="results h-64 w-48"
                                    src={individual.image_url}
                                ></img>
                                <p className="flex-shrink">
                                    {individual.first} {individual.last}
                                </p>
                            </Link>
                            <button
                                className="rounded-full py-3 px-6 transition duration-500 ease-in-out bg-pink-600 hover:bg-purple-800 transform hover:-translate-y-1 hover:scale-110 "
                                onClick={() => acceptFriendReq(individual.id)}
                            >
                                Accept Request
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
