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
            })
            .catch((err) => {
                console.log("error in friends.js", err);
            });
    }, []);

    function acceptFriendReq(id) {
        fetch(`/friendship/accept/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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
        })
            .then((res) => res.json())
            .then(() => {
                dispatch(rejectFriend(id));
            });
    }

    return (
        <div>
            <div className="friends">
                <h2>Your friends</h2>
                {currentFriends &&
                    currentFriends.map((individual) => (
                        <div key={individual.id}>
                            <Link to={`/user/${individual.id}`}>
                                <img
                                    className="results"
                                    src={individual.image_url}
                                ></img>
                                <p>
                                    {individual.first} {individual.last}
                                </p>
                            </Link>
                            <button onClick= { () =>  acceptFriendReq(individual.id)}>
                                Unfriend
                            </button>
                        </div>
                    ))}
                ;
            </div>
            <div className="wannabes">
                <h2>Your Wannabes</h2>
                {wannabes &&
                    wannabes.map((individual) => (
                        <div key={individual.id}>
                            <Link to={`/user/${individual.id}`}>
                                <img
                                    className="results"
                                    src={individual.image_url}
                                ></img>
                                <p>
                                    {individual.first} {individual.last}
                                </p>
                            </Link>
                            <button onClick={() => rejectFriendReq(individual.id)}>
                                Accept Request
                            </button>
                        </div>
                    ))}
                ;
            </div>
        </div>
    );
}
