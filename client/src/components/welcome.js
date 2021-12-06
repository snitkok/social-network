import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Reset from "./reset";

export default class Welcome extends Component {
    render() {
        return (
            <div id="welcome " className="m-4">
                <img
                    src="/welcome.gif "
                    className="logo h-64 w-64 object-center"
                />
                <BrowserRouter>
                    <div>
                        <Route exact path="/">
                            <Registration />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/reset">
                            <Reset />
                        </Route>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
