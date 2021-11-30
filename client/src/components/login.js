import React from "react";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //const [userInput, setUserInput ] = useSttae({});

    //const [error, setError ] = useSttae(false);
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
            <div>
                <h3>Login!</h3>
                {this.state.error && (
                    <div className="error">
                        Something went wrong. Please try again.
                    </div>
                )}
                <label>Email</label>
                <br />
                <input
                    name="email"
                    placeholder="email"
                    type="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <br />
                <label>Password</label>
                <br />
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <br />
                <button onClick={() => this.submit()}>Login</button>
                <br />
                <Link to="/reset">Click here to reset password</Link>
                <br />
                <Link to="/">Click here to register</Link>
            </div>
        );
    }
}
