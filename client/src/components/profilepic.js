export default function Profilepic({ first, last, imageUrl, loggerFunc }) {
    imageUrl = imageUrl || "welcome.png";

    return (
        <>
            <img
                src={imageUrl}
                alt={`${first} ${last}`}
                id="image"
                onClick={loggerFunc}
                className="h-32 w-32 rounded   ring ring-blue-800
                    ring-offset-4 ring-offset-black"
            />
        </>
    );
}
