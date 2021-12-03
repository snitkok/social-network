import { combineReducers } from "redux";
import friendsReducer from "./friends/slice.js";

const rootReducer = combineReducers({
    friendsAndWannabes: friendsReducer,
});

export default rootReducer;
