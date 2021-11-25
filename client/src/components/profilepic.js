export default function Profilepic({ first, last, imageUrl }) {
    imageUrl = imageUrl || "default.png";

    return (
        <img
            // onClick={logAgain}
            src={imageUrl}
            alt={`${first} ${last}`}
            id="navbar-avatar"
        />
    );
}
