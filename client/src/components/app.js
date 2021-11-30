import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import FindPeople from "./findpeople";
import OtherProfile from "./otherprofile";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

export default class app extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
            first: "",
            last: "",
            imageUrl: "",
            bio: "",
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.updateProfileImg = this.updateProfileImg.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        console.log("App compponent mounted");
        fetch("/user.json", {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data", data);
                if (data) {
                    this.setState({
                        first: data.first,
                        last: data.last,
                        imageUrl: data.image_url,
                        bio: data.bio,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    updateProfileImg(val) {
        this.setState({
            imageUrl: val,
            ploaderIsVisible: false,
        });
    }

    setBio(val) {
        console.log("val&&&&&&&&&&", this.state);
        this.setState({
            bio: val,
        });
    }

    render() {
        return (
            <>
                {" "}
                <BrowserRouter>
                    <header className="header">
                        <img
                            id="headerlogo"
                            src="https://alsimageuniverse.s3.amazonaws.com/jhHC3lw0fMcoDXJFxNpnk_6iFWpR92aG.png"
                            alt="commonground logo"
                        />

                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                            loggerFunc={this.toggleUploader}
                        />
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                loggerFunc={this.toggleUploader}
                                updateProfileImg={this.updateProfileImg}
                            />
                        )}

                        <Link to="/users">
                            <p>Find users</p>
                        </Link>
                        <Link to="/">
                            <p>Profile</p>
                        </Link>
                        
                    </header>
                    <hr />

                    <div>
                        <Route exact path="/">
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                bio={this.state.bio}
                                loggerFunc={this.toggleUploader}
                                setBio={this.setBio}
                            />
                        </Route>
                    </div>
                    <div>
                        <Route exact path="/users">
                            <FindPeople />
                        </Route>
                    </div>
                    <div>
                        <Route exact path="/user/:id">
                            <OtherProfile />
                        </Route>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}
