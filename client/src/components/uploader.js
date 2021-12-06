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
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                <h3 className="text-3xl font-semibold">
                                    Want to change profile picture?
                                </h3>
                            </div>
                            {/*body*/}
                            <div className="relative p-6 flex-auto">
                                <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                    Upload your new profile picture here ⬇️
                                </p>
                            </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                <button
                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={this.props.loggerFunc}
                                >
                                    Close
                                </button>
                                <input
                                    className="background-red-500 text-black active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    onChange={(e) => this.handleChange(e)}
                                    name="file"
                                    type="file"
                                    accept="image/*"
                                />

                                <button
                                    className="text-black font-bold uppercase text-sm px-6 py-3 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => {
                                        this.upload();
                                        this.props.loggerFunc();
                                    }}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="bg-blend-overlay opacity-75 fixed inset-0 z-1040 bg-black"
                    onClick={this.props.loggerFunc}
                ></div>
            </>
        );
    }

    // render() {
    //     return (
    //         <>
    //             <div id="modal"   >
    //                 <div id="modal-content">
    //                     Want to change an image?
    //                     <br />
    //                     <input
    //                         onChange={(e) => this.handleChange(e)}
    //                         name="file"
    //                         type="file"
    //                         accept="image/*"
    //                     />
    //                     <br />
    //                     <button
    //                         onClick={() => {
    //                             this.upload();
    //                             this.props.loggerFunc();
    //                         }}
    //                     >
    //                         submit
    //                     </button>
    //                 </div>
    //             </div>
    //             <div id="modal-overlay" onClick={this.props.loggerFunc}></div>
    //         </>
    //     );
    // }
}
