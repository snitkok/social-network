import React from "react";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //const [userInput, setUserInput ] = useSttae({});

    //const [error, setError ] = useSttae();
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submit() {
        //add prevent defsult
        fetch("/login.json", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }

    render() {
        return (
            <div id="login" className="flex flex-col items-center">
                <h3 className=" text-4xl animate-bounce">Login!</h3>
                {this.state.error && (
                    <div className="error">
                        Something went wrong. Please try again.
                    </div>
                )}
                <label className="mt-12">Email</label>
            
                <input
                    name="email"
                    placeholder="email"
                    type="email"
                    className="border-2 border-blue-800 rounded"
                    onChange={(e) => this.handleChange(e)}
                />
                <br />
                <label>Password</label>
             
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                    className="border-2 border-blue-800 rounded"
                />
            
                <button
                    className=" mt-4 mb-4 p-1 rounded transition duration-500 ease-in-out bg-gray-400 hover:bg-yellow-300 transform hover:-translate-y-1 hover:scale-110"
                    onClick={() => this.submit()}
                >
                    Login
                </button>
                <br />
                <Link to="/reset" className="hover:text-yellow-400">
                    Click here to reset password
                </Link>
                <br />
                <Link to="/" className="hover:text-yellow-400">
                    Click here to register
                </Link>
            </div>
        );
    }
}
