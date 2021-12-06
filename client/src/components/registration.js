import React from "react";
import { Link } from "react-router-dom";
// import { useForm } from "useform.js";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
        };
    }

    //const [userInput, setUserInput ] = useSttae({});   do not need it //replace with useform

    //+++++const [userInput, handleChange and other ] = useForm();

    //const [error, setError ] = useSttae(false);
    //+++++++const [submit, error] = useFormSubmit('/register', userInput);

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
            <div className="flex flex-col items-center">
                <h3 className="text-4xl animate-bounce">Sign up!</h3>
                {this.state.error && <div className="error">Oops!</div>}

                <label className="mt-12">First Name</label>

                <input
                    className=" border-2 border-yellow-300 rounded"
                    name="first"
                    placeholder="first name"
                    onChange={(e) => this.handleChange(e)}
                />
                <br />
                <label>Last Name</label>
                <input
                    className="border-2 border-yellow-300 rounded"
                    name="last"
                    placeholder="last name"
                    onChange={(e) => this.handleChange(e)}
                />
                <br />
                <label>Email</label>
                <input
                    className="border-2 border-yellow-300 rounded"
                    name="email"
                    placeholder="email"
                    type="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <br />
                <label>Password</label>
                <input
                    className="border-2 border-yellow-300 rounded"
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button
                    className=" mt-4 mb-4 p-1 rounded transition duration-500 ease-in-out bg-gray-400 hover:bg-yellow-300 transform hover:-translate-y-1 hover:scale-110"
                    onClick={() => this.submit()}
                >
                    Submit
                </button>
                <br />
                <Link to="/login" className="hover:text-yellow-400">
                    Click here to login
                </Link>
            </div>
        );
    }
}
