import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./userSlice.js";
const store = configureStore({
  reducer: {
    user: useReducer,
  },
});
export default store;
