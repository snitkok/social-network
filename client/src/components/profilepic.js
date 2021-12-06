export default function Profilepic({ first, last, imageUrl, loggerFunc }) {
    imageUrl = imageUrl || "welcome.png";

    return (
        <>
            <img
                src={imageUrl}
                alt={`${first} ${last}`}
                id="image"
                onClick={loggerFunc}
                className="h-32 w-32 ring ring-gray-400 ring-offset-4 ring-offset-blue-100 rounded"
            />
        </>
    );
}
