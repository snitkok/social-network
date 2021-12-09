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
            <h2 className="m-4 text-3xl text-blue-800">Your friends</h2>
            <div className="friends flex flex-row mb-20">
                {currentFriends &&
                    currentFriends.map((individual) => (
                        <div key={individual.id} className="m-4 text-center">
                            <Link to={`/user/${individual.id}`}>
                                <img
                                    className="results rounded-full h-48 w-48 mt-4 mb-4 ml-2 mr-2 ring ring-black
                                    ring-offset-4 ring-offset-blue-800"
                                    src={individual.image_url}
                                ></img>
                                <hr className="border-blue-800" />
                                <p>
                                    {individual.first} {individual.last}
                                </p>
                            </Link>
                            <button
                                className=" mt-4 mb-4 p-1 rounded transition duration-500 ease-in-out bg-gray-400 hover:bg-yellow-300 transform hover:-translate-y-1 hover:scale-110"
                                onClick={() => rejectFriendReq(individual.id)}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
            </div>
            <h2 className="m-4 text-3xl text-gray-500">Your Wannabes</h2>
            <div className="wannabes friends flex flex-row mb-20 inline-flex ">
                {wannabes &&
                    wannabes.map((individual) => (
                        <div key={individual.id} className="m-4 text-center ">
                            <Link to={`/user/${individual.id}`}>
                                <img
                                    className="results rounded-full h-48 w-48 mt-4 mb-4 ml-2 mr-2 ring ring-black
                                    ring-offset-4 ring-offset-blue-800"
                                    src={individual.image_url}
                                ></img>
                                <hr className="border-blue-800" />
                                <p>
                                    {individual.first} {individual.last}
                                </p>
                            </Link>
                            <button
                                className=" mt-4 mb-4 p-1 rounded transition duration-500 ease-in-out bg-gray-400 hover:bg-yellow-300 transform hover:-translate-y-1 hover:scale-110"
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
