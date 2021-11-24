import ReactDOM from "react-dom";
import Welcome from "./components/welcome";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(
                <img src="/welcome.png" alt="logo" className="logo" />,
                document.querySelector("main")
            );
        }
    });
