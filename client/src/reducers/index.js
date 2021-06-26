import saveUser from "./saveUser.reducer"
import { combineReducers } from "redux"

const rootReducer = combineReducers({
    User: saveUser,
});

export default rootReducer;