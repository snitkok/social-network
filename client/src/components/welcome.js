import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

export default class Welcome extends Component {
    render() {
        return (
            <div id="welcome">
                <img src="/welcome.png" className="logo" />
                <BrowserRouter>
                    <div>
                        <Route exact path="/">
                            <Registration />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
