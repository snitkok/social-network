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
        this.updateProfileImg = this.updateProfileImg.bind(this);
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
                if (data) {
                    this.setState({
                        first: data.first,
                        last: data.last,
                        imageUrl: data.image_url,
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
        });
    }

    render() {
        return (
            <>
                <header className="header">
                    <img
                        id="headerlogo"
                        src="https://alsimageuniverse.s3.amazonaws.com/jhHC3lw0fMcoDXJFxNpnk_6iFWpR92aG.png"
                        alt="commonground logo"
                    />
                    <ProfilePic
                        first={this.state.name}
                        last={this.state.name}
                        imageUrl={this.state.imageUrl}
                        toggleUploader={this.toggleUploader}
                    />
                    {this.state.uploaderIsVisible && (
                        <Uploader

                            loggerFunc={this.toggleUploader}
                            updateProfileImg={this.updateProfileImg}
                        />
                    )}
                </header>
            </>
        );
    }
}
