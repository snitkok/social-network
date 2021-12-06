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
        <div className="flex flex-col justify-center">
            <div className="text-center">
                <h1>My profile</h1>
                <div id="bioImg" onClick={loggerFunc}>
                    <ProfilePic imageUrl={imageUrl} className="h-200 w-300" />
                </div>
                <h3>
                    {first} {last}
                </h3>

                <Bio bio={bio} setBio={setBio} />
            </div>
        </div>
    );
}
