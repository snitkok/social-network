// import React from "react";

// export default class Registration extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {};

//     }
//     handleChange(e) {
//         this.setState({ [e.target.name]: e.target.value });
//     }
//     submit() {
//         console.log("json", JSON);
//         fetch("./registration.json", {
//             method: "Post",
//             headers: {
//                 "content-type": "application/json",
//             },
//             body: JSON.stringify({
//                 first: this.state.first,
//                 last: this.state.last,
//                 email: this.state.email,
//                 password: this.state.password
//             })
//             })
//                 .then((res) => res.json())
//                 .then((data) => {
//                     if (data.success) {
//                         location.replace("/");
//                     } else {
//                         this.setState(
//                             {
//                                 error: true,
//                             },
//                             () => console.log("this.state", this.state)
//                         );
//                     }
//                 }),

//             }

//     render() {
//         return (
//             <div>
//                 <h3>Sign Up!</h3>

//                 {this.state.error && <div className="error">Ooops!</div>}
//                 <input
//                     onChange={(e) => this.handleChange(e)}
//                     name="first"
//                 ></input>
//                 <input
//                     onChange={(e) => this.handleChange(e)}
//                     name="last"
//                 ></input>
//                 <input
//                     onChange={(e) => this.handleChange(e)}
//                     name="email"
//                 ></input>
//                 <input
//                     onChange={(e) => this.handleChange(e)}
//                     name="password"
//                 ></input>
//                 <button onClick={() => this.submit()}>Submit</button>
//             </div>
//         );
//     }

import React from "react";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submit() {
        fetch("/registration.json", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                first: this.state.first,
                last: this.state.last,
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
                <h3>Sign up!</h3>
                {this.state.error && <div className="error">Oops!</div>}
                <input name="first" onChange={(e) => this.handleChange(e)} />
                <input name="last" onChange={(e) => this.handleChange(e)} />
                <input name="email" onChange={(e) => this.handleChange(e)} />
                <input name="password" onChange={(e) => this.handleChange(e)} />
                <button onClick={() => this.submit()}>submit</button>
            </div>
        );
    }
}
