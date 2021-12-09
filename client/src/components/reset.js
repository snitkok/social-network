import React from "react";
import { Link } from "react-router-dom";

export default class Reset extends React.Component {
    constructor(props) {
        // 🔴 Can’t use `this` yet
        super(props);
        // ✅ Now it’s okay though
        this.state = {
            stage: 1,
            error: false,
            email: "",
            code: "",
            password: "",
        };
    }
    submitStart() {
        fetch("/password/reset/start", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data) {
                    this.setState({ stage: 2 });
                    this.setState({ code: data });
                } else {
                    this.setState({
                        error: true,
                    });
                }
                console.log("response sent", this.state.email);
                console.log("resp.json________", data);
            });
    }
    submitConfirm() {
        fetch("/password/reset/confirm", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                code: this.state.code,
                password: this.state.password,
            }),
        })
            .then((resp) => resp.json())
            .then((success) => {
                if (success) {
                    this.setState({ stage: 3 });
                } else {
                    this.setState({
                        error: true,
                    });
                }
                console.log("response sent", this.state.email);
                console.log("resp.json________", success);
            });
    }

    handleEmail(e) {
        this.setState({ [e.target.email]: e.target.value });
    }
    handleCode(e) {
        this.setState({ [e.target.code]: e.target.value });
    }
    handlePassword(e) {
        this.setState({ [e.target.password]: e.target.value });
    }

    showStage() {
        if (this.state.stage === 1) {
            return (
                <div>
                    {this.state.error && <div className="error">Oops!</div>}
                    <label>Reset your password here</label>
                    <br />
                    <input
                        className="border-2 border-blue-800 rounded"
                        key="email"
                        name="email"
                        placeholder="email"
                        type="email"
                        onChange={(e) => this.handleEmail(e)}
                    />
                    <br />
                    <button
                        className=" mt-4 mb-4 p-1 rounded transition duration-500 ease-in-out bg-gray-400 hover:bg-yellow-300 transform hover:-translate-y-1 hover:scale-110"
                        onClick={() => this.submitStart()}
                    >
                        Submit
                    </button>
                </div>
            );
        } else if (this.state.stage === 2) {
            return (
                <div>
                    {this.state.error && <div className="error">Oops!</div>}
                    <label>Please enter the code you received </label>
                    <br />
                    <input
                        className="border-2 border-blue-800 rounded"
                        key="code"
                        name="code"
                        placeholder="code"
                        type="string"
                        onChange={(e) => this.handleCode(e)}
                    />
                    <br />
                    <label>Please enter a new password </label>
                    <br />
                    <input
                        className="border-2 border-blue-800 rounded"
                        name="password"
                        placeholder="password"
                        type="password"
                        onChange={(e) => this.handlePassword(e)}
                    />
                    <br />
                    <button
                        className=" mt-4 mb-4 p-1 rounded transition duration-500 ease-in-out bg-gray-400 hover:bg-yellow-300 transform hover:-translate-y-1 hover:scale-110"
                        onClick={() => this.submitConfirm()}
                    >
                        Submit
                    </button>
                </div>
            );
        } else if (this.state.stage === 3) {
            return (
                <div className="flex flex-col justify-center items-center">
                    <br />
                    <h1 className="mt-12 text-4xl animate-bounce">
                        Succeeeeeessssssss!!!
                    </h1>
                    <img
                        style={{ width: "20rem", height: "auto" }}
                        src="/giphy.gif"
                    />
                    <Link
                        className="mt-2 text-4xl hover:text-yellow-400"
                        to="/login"
                    >
                        Log In
                    </Link>
                </div>
            );
        }
    }

    render() {
        return <div>{this.showStage()}</div>;
    }
}
