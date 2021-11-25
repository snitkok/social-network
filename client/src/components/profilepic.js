export default function Profilepic({ first, last, imageUrl, toggleUploader }) {
    imageUrl = imageUrl || "default.png";

    return (
        <>
            <img
                src={imageUrl}
                alt={`${first} ${last}`}
                id="image"
                onClick={toggleUploader}

            />
        </>
    );
}
