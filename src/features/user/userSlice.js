import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from "../../utils/localStorage";
import customFetch from '../../utils/axios'

const initialState = {
    isLoading:false,
    isSidebarOpen: false,
    user: getUserFromLocalStorage()
}

export const registerUser = createAsyncThunk("user/register", async(user, thunkAPI)=>{
    try {
        const resp = await customFetch.post('/auth/register', user)
        return resp.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg)
    }
})
export const loginUser = createAsyncThunk("user/login", async(user, thunkAPI)=>{
    try {
        const resp = await customFetch.post('/auth/login', user)
        return resp.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg)
    }
})
export const updateUser = createAsyncThunk("user/updateUser", async(user, thunkAPI)=>{
    try {
        const resp = await customFetch.patch('/auth/updateUser', user, {
            headers:{
                authorization: `Bearer ${thunkAPI.getState().user.user.token}`
            }
        })
        return resp.data;
    } catch (error) {
        if (error.response.status===401) {
            thunkAPI.dispatch(logoutUser())
            return thunkAPI.rejectWithValue('Unauthorized! Logging Out...')
        }
        return thunkAPI.rejectWithValue(error.response.data.msg)
    }
})

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        logoutUser:(state)=>{
            state.user = null;
            state.isSidebarOpen = false;
            removeUserFromLocalStorage();
        },
        toggleSidebar:(state)=>{
            state.isSidebarOpen = !state.isSidebarOpen
        }  
    },
    extraReducers:(builder)=>{
        builder.addCase(registerUser.pending, (state)=>{
            state.isLoading = true;
        }).addCase(registerUser.fulfilled, (state, { payload })=>{
            state.isLoading = false;
            const { user } = payload;
            state.user = user;
            addUserToLocalStorage(user)
            toast.success(`Hello there ${user.name}`)
        }).addCase(registerUser.rejected, (state, { payload })=>{
            state.isLoading = false;
            toast.error(payload)
        }).addCase(loginUser.pending, (state)=>{
            state.isLoading = true;
        }).addCase(loginUser.fulfilled, (state, { payload })=>{
            state.isLoading = false;
            const { user } = payload;
            state.user = user;
            addUserToLocalStorage(user)
            toast.success(`Welcome back ${user.name}`)
        }).addCase(loginUser.rejected, (state, { payload })=>{
            state.isLoading = false;
            toast.error(payload)
        }).addCase(updateUser.pending, (state)=>{
            state.isLoading = true;
        }).addCase(updateUser.fulfilled, (state, { payload })=>{
            const { user } = payload;
            state.isLoading = false;
            state.user = user;
            addUserToLocalStorage(user)
            toast.success(`User Updated`)
        }).addCase(updateUser.rejected, (state, { payload })=>{
            state.isLoading = false;
            toast.error(payload)
        })
    }
})

export const { toggleSidebar, logoutUser } = userSlice.actions;
export default userSlice.reducer;