import {createSlice} from "@reduxjs/toolkit"

export const authSlice = createSlice({
    name:"auth",
    initialState:{
        log:false
    },
    reducers:{
        setAuth:(state,action) => {
            state.log = action.payload;
        }
    }
})
export const {setAuth} = authSlice.actions;
export default authSlice.reducer;