import ReactDOM from "react-dom";
import Welcome from "./components/welcome";
import App from "./components/app";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        // console.log("*****************", data.userId);
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(<App />, document.querySelector("main"));
        }
    });
