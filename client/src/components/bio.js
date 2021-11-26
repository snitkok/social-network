import { Component } from "react";

export default class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorVisible: false,
            bio: this.props.bio,
            bioEditorVisible: true,
            // draftBio: "",
        };
        this.textareaToggle = this.textareaToggle.bind(this);
        console.log("props********", this.props.bio);
    }

    handleChange(e) {
        this.setState({ bio: e.target.value }, () => {
            console.log("handleChange Func: this.state", e.target.value);
        });
    }

    //bind it here
    textareaToggle() {
        this.setState({
            editorVisible: !this.state.editorVisible,
        });
    }

    save() {
        fetch("/update/profile", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                bio: this.state.bio,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    console.log("success****!!!!!!!!!!!!!!!!!*******", data.bio);
                    // this.setState({
                    //     bio: data.bio,
                    // });
                    this.props.setBio(data.bio);
                } else {
                    console.log("no success***********");
                }
            });
    }
    render() {
        return (
            <>
                <h3>This is my bio: {this.props.bio}</h3>
                {this.state.editorVisible && (
                    <div>
                        <textarea
                            onChange={(e) => this.handleChange(e)}
                            value={this.props.bio}
                        />
                        <br />
                        <button
                            onClick={() => {
                                this.save();
                                this.textareaToggle();
                            }}
                        >
                            Save
                        </button>
                    </div>
                )}

                {!this.props.bio && !this.state.editorVisible && (
                    <button onClick={this.textareaToggle}>Add bio!</button>
                )}

                {this.props.bio && !this.state.editorVisible && (
                    <button onClick={this.textareaToggle}>Edit bio!</button>
                )}
            </>
        );
    }
}
