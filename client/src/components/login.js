// import { Link } from "react-router-dom";
// export default function Login() {
//     return (
//         <div>
//             Login page
//             <Link to="/">Click here to register</Link>
//         </div>
//     );
// }

import React from "react";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
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
                <Link to="/reset">Click here to reset password</Link><br/>
                <Link to="/">Click here to register</Link>
            </div>
        );
    }
}
