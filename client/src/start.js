import ReactDOM from "react-dom";
import Welcome from "./components/welcome";
import App from "./components/app";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import reducer from "./redux/reducer.js";
import { composeWithDevTools } from "redux-devtools-extension";
//
import "../style.css";
import { init } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

const elem = (
    <Provider store={store}>
        <App />
    </Provider>
);

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        // console.log("*****************", data.userId);
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            init(store);
            ReactDOM.render(elem, document.querySelector("main"));
        }
    });
