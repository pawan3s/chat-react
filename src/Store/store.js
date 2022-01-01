import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { userLoginReducer } from "./reducers/userReducer";

const reducer = combineReducers({
  userLogin: userLoginReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.stringify(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: {
    loading: false,
    userInfo: userInfoFromStorage,
    error: null,
  },
};

const middlewares = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
