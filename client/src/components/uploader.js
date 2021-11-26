import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
        };
        this.upload = this.upload.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0],
        });
        console.log(e.target.files[0]);
    }

    upload() {
        const formData = new FormData();
        formData.append("file", this.state.file);
        fetch("/upload/picture", {
            method: "POST",
            body: formData,
        })
            .then((data) => data.json())
            .then((data) => {
                if (data.image_url) {
                    console.log("image_url", data.image_url);
                    this.props.updateProfileImg(data.image_url);
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }

    closeModal(e) {
        if (e.target.id === "modal-overlay") {
            this.setState({ show: false });
        }
    }

    render() {
        return (
            <>
                <div id="modal">
                    <div id="modal-content">
                        Want to change an image?
                        <br />
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="file"
                            type="file"
                            accept="image/*"
                        />
                        <br />
                        <button
                            onClick={() => {
                                this.upload();
                                this.props.loggerFunc();
                            }}
                        >
                            submit
                        </button>
                    </div>
                </div>
                <div id="modal-overlay" onClick={this.props.loggerFunc}></div>
            </>
        );
    }
}
