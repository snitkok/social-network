import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Reset from "./reset";

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
                        <Route path="/reset">
                            <Reset />
                        </Route>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
