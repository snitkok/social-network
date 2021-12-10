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
        <div className="profile flex flex-col items-center">
            <div className="text-center">
                <h1 className=" m-4 text-4xl">My profile</h1>
                <div id="bioImg" onClick={loggerFunc}>
                    <ProfilePic imageUrl={imageUrl} />
                </div>
                <h3 className=" m-4 text-4xl">
                    {first} {last}
                </h3>

                <Bio bio={bio} setBio={setBio} />
            </div>
        </div>
    );
}
