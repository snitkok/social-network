export default function friendsReducer(friendsAndWannabes = null, action) {
    if (action.type == "friends/receiveFriendsAndWannabes") {
        friendsAndWannabes = action.payload.friendsAndWannabes;
    }
    if (action.type == "friends/rejectFriend") {
        friendsAndWannabes = friendsAndWannabes.filter(
            (friend) => friend.id !== action.payload.id
        );
    }

    if (action.type == "friends/acceptFriend") {
        friendsAndWannabes = friendsAndWannabes.map((friend) => {
            if (friend.id == action.payload.id) {
                friend.accepted = true;
                return friend;
            } else {
                return friend;
            }
        });
    }
    return friendsAndWannabes;
}

//Create and Export all our functions

export function receiveFriendsAndWannabes(friendsAndWannabes) {
    return {
        type: "friends/receiveFriendsAndWannabes",
        payload: { friendsAndWannabes },
    };
}

export function acceptFriend(id) {
    return {
        type: "friends/acceptFriend",
        payload: { id },
    };
}

export function rejectFriend(id) {
    return {
        type: "friends/rejectFriend",
        payload: { id },
    };
}
