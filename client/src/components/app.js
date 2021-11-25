import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class app extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
            first: "",
            last: "",
            imageUrl: "",
            
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.logNamePlusSomethingElse =
            this.logNamePlusSomethingElse.bind(this);
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
                if (data.success) {
                    this.setState({
                        first: data.first,
                        last: data.last,
                        imageUrl: data.image,
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

    logNamePlusSomethingElse(val) {
        console.log(this.state.name + val);
    }

    render() {
        return (
            <>
                <header>
                    <img
                        id="homepage-logo"
                        src="https://alsimageuniverse.s3.amazonaws.com/jhHC3lw0fMcoDXJFxNpnk_6iFWpR92aG.png"
                        alt="commonground logo"
                    />
                    <ProfilePic
                        first={this.state.name}
                        last="Quinn"
                        imageUrl="http://www.magicalmaths.org/wp-content/uploads/2014/06/cool-teacher.jpg"
                    />
                </header>
                <button onClick={this.toggleUploader}>Toggle uploader</button>
                {this.state.uploaderIsVisible && (
                    <Uploader loggerFunc={this.logNamePlusSomethingElse} />
                )}
            </>
        );
    }
}
