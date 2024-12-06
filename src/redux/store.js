import {configureStore} from "@reduxjs/toolkit"
import {customAlertReducer} from "./reducers/customAlertReducer.js"

const store = configureStore({
    reducer:{
        customAlert:customAlertReducer,
    },
});
export default store;