import ProfilePic from "./profilepic";
import Bio from "./bio";
export default function Profile({
    first,
    last,
    imageUrl,
    loggerFunc,
    bio,
    setBio,
}) {
    return (
        <>
            <h1>Hello!</h1>
            <h3>
                {first} {last}
            </h3>

            <Bio bio={bio} setBio={setBio} />
            <div id="bioImg" className="bioImg" onClick={loggerFunc}>
                <ProfilePic imageUrl={imageUrl} />
            </div>
        </>
    );
}
