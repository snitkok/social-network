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
                <div
                    id="modal"
                    className="rounded ring ring-gray-400 ring-offset-4 ring-offset-blue-100"
                >
                    <div id="modal-content">
                        <p className="text-4xl animate-pulse p-8">
                            Want to change an image?
                        </p>
                        <img src="/cat.png" className="" />
                        <br />
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="file"
                            type="file"
                            accept="image/*"
                            className="text-2xl hover:text-yellow-400"
                        />
                        <br />
                        <button
                            className=" mt-4 mb-4 p-1 rounded transition duration-500 ease-in-out bg-gray-400 hover:bg-yellow-300 transform hover:-translate-y-1 hover:scale-110"
                            onClick={() => {
                                this.upload();
                                this.props.loggerFunc();
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <div
                    className=""
                    id="modal-overlay"
                    onClick={this.props.loggerFunc}
                ></div>
            </>
        );
    }
}
