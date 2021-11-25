import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: "",
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    upload() {
        const formData = new FormData();
        formData.append("file", this.file);
        fetch("/upload/picture", {
            method: "POST",
            body: formData,
        })
            .then((data) => data.json())
            .then((data) => {
                if (data.success) {
                    this.setState({
                        uploading: false,
                        data,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }

    render() {
        return (
            <>
                return{" "}
                <div onClick={() => this.props.loggerFunc("!!!!!!")}>
                    <div id="modal"></div>
                    Want to change an image?
                    <br />
                    <input onChange={(e) => this.handleChange(e)}  name="file" type="file" accept="image/*" />
                    <br />
                    <button onClick={() => this.upload()}>submit</button>
                </div>
                <div id="modal-overlay"></div>
            </>
        );
    }
}
