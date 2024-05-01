import { createSlice } from "@reduxjs/toolkit";

const langSlice = createSlice({
    name:"lang",
    initialState:{
        lang:"Español"
    },
    reducers:{
        setLang:(state,action) => {
            state.lang = action.payload;
        }
    }
})
export const { setLang } = langSlice.actions;
export default langSlice.reducer;