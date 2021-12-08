import { useParams, useHistory } from "react-router";
import { useEffect, useState } from "react";
import FriendButton from "./friendbutton";

export default function OtherProfile() {
    const [image_url, setImg] = useState("");
    const [first, setFirstName] = useState("");
    const [last, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        fetch(`/api/user/${id}`)
            .then((res) => res.json())
            .then((result) => {
                if (result.currentUserId == id) {
                    history.replace("/");
                }
                console.log("currentUserId", result.currentUserId);
                console.log("id", id);

                if (result.success === false) {
                    history.replace("/");
                }

                const { first, last, bio, image_url } = result;
                setFirstName(first);
                setLastName(last);
                setBio(bio);
                setImg(image_url);
            })
            .catch((err) => {
                console.log("err in otherprofile", err);
            });
    }, [id]);

    return (
        <div>
            <div>
                <img
                    className=" m-4 rounded-full 
                    ring ring-yellow-400 ring-offset-4 ring-offset-yellow-100
                    h-64 w-64 "
                    src={image_url}
                ></img>
                <p className="m-4">
                    {first} {last}
                    <br /> {bio}
                </p>
            </div>
            <FriendButton viewedUserId={id} />
        </div>
    );
}
