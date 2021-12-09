import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Chat from "./chat";
import Login from "./login";
import OtherProfile from "./otherprofile";
import { BrowserRouter, Route } from "react-router-dom";
import { Link,  } from "react-router-dom";

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

    logout() {
        fetch("/logout");
        location.replace("/login");
    }

    deleteAccount() {
        fetch("/delete-account", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
        });
        location.replace("/");
    }

 

    render() {
     
        return (
            <>
                <BrowserRouter>
                    <header className="header flex items-center bg-black  text-blue-800 justify-between flex-wrap p-6">
                        <div className="dropdown">
                            <img
                                id="headerlogo"
                                src="/welcome.gif"
                                alt="commonground logo"
                                className=" mb-4 flex items-center flex-shrink-0 mr-6 h-32 w-32 rounded   ring ring-blue-800
                    ring-offset-4 ring-offset-black"
                            />
                            <p className="cursor-pointer text-3xl">Menu</p>
                            <div className="dropdown-content rounded">
                                <Link to="/users">
                                    <p className="block mt-4 sm:inline-block sm:mt-0 text-teal-200 hover:text-gray-400">
                                        Find users
                                    </p>
                                </Link>
                                <Link to="/">
                                    <p className="block mt-4 sm:inline-block sm:mt-0 text-teal-200 hover:text-gray-400">
                                        Profile
                                    </p>
                                </Link>
                                <Link to="/friends">
                                    <p className="block mt-4 sm:inline-block sm:mt-0 text-teal-200 hover:text-gray-400">
                                        My friends
                                    </p>
                                </Link>
                                <Link to="/chat">
                                    <p className="block mt-4 sm:inline-block sm:mt-0 text-teal-200 hover:text-gray-400">
                                        Chat
                                    </p>
                                </Link>
                                <br />
                                <div
                                    className="cursor-pointer block mt-4 sm:inline-block sm:mt-0 text-teal-200 hover:text-gray-400"
                                    onClick={() => this.logout()}
                                >
                                    Logout
                                </div>
                                <div
                                    className="cursor-pointer block mt-4 sm:inline-block sm:mt-0 text-teal-200 hover:text-gray-400"
                                    onClick={() =>
                                        window.confirm(
                                            "This action cannot be indone. Delete your account❓"
                                        ) && this.deleteAccount()
                                    }
                                >
                                    Delete account
                                </div>
                            </div>
                        </div>
                        <div>
                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                loggerFunc={this.toggleUploader}
                            />
                            <p className="mt-4 invisible text-3xl">Menu</p>
                            {this.state.uploaderIsVisible && (
                                <Uploader
                                    loggerFunc={this.toggleUploader}
                                    updateProfileImg={this.updateProfileImg}
                                />
                            )}
                        </div>
                    </header>
                    <hr />

                    <div className="flex justify-center items-center p-3">
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
                    <div>
                        <Route exact path="/friends">
                            <Friends />
                        </Route>
                    </div>
                    <div>
                        <Route exact path="/chat">
                            <Chat />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}
