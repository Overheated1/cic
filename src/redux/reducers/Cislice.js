import {createSlice} from "@reduxjs/toolkit"

export const ciSlice = createSlice({
    name:"auth",
    initialState:{
        ci:""
    },
    reducers:{
        setCi:(state,action) => {
            state.ci = action.payload;
        }
    }
})
export const {setCi} = ciSlice.actions;
export default ciSlice.reducer;