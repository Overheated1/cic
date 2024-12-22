import {configureStore} from "@reduxjs/toolkit"
import {customAlertReducer} from "./reducers/customAlertReducer.js"
import { selectedRowsReducer } from "./reducers/selectedRowsNumberReducer.js";

const store = configureStore({
    reducer:{
        customAlert:customAlertReducer,
        selectedRows: selectedRowsReducer,
    },
});
export default store;