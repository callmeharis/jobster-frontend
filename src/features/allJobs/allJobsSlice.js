import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import customFetch from "../../utils/axios"

const initialFilterState = {
    search:'',
    searchStatus:'all',
    searchType:'all',
    sort:'latest',
    sortOptions:['latest', 'oldest', 'a-z', 'z-a']
}
const initialState = {
    isLoading:true,
    jobs:[],
    totalJobs:0,
    numberOfPages:1,
    page:1,
    stats:{},
    monthlyApplications:[],
    ...initialFilterState
}

export const getAllJobs = createAsyncThunk('allJobs/getJobs', async(_, thunkAPI)=>{
    let url = '/jobs'
    try {
        const resp = await customFetch.get(url, {
            headers:{
                authorization: `Bearer ${thunkAPI.getState().user.user.token}`
            }
        })
        return resp.data;
    } catch (error) {
        return thunkAPI.rejectWithValue('There was an error')
    }
})
export const deleteJob = createAsyncThunk('job/deleteJob', async(jobId, thunkAPI)=>{
    thunkAPI.dispatch(showLoading())
    try {
        const resp = await customFetch.delete(`/jobs/${jobId}`, {
            headers:{
                authorization: `Bearer ${thunkAPI.getState().user.user.token}`
            }
        })
        thunkAPI.dispatch(getAllJobs())
        return resp.data;
    } catch (error) {
        thunkAPI.dispatch(hideLoading())
        return thunkAPI.rejectWithValue(error.response.data.msg)
    }
})

const allJobsSlice = createSlice({
    name:'allJobs',
    initialState,
    reducers:{
        showLoading:(state)=>{
            state.isLoading = true
        },
        hideLoading:(state)=>{
            state.isLoading = false
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllJobs.pending, (state)=>{
            state.isLoading = true;
        }).addCase(getAllJobs.fulfilled, (state, {payload})=>{
            state.isLoading = false;
            state.jobs = payload.jobs;
        }).addCase(getAllJobs.rejected, (state, {payload})=>{
            state.isLoading = false;
            toast.error(payload)
        }).addCase(deleteJob.fulfilled, (state, {payload})=>{
            toast.success('Success! Job removed')
        }).addCase(deleteJob.rejected, (state, {payload})=>{
            toast.error(payload)
        })
    }
})
export const { showLoading, hideLoading } = allJobsSlice.actions
export default allJobsSlice.reducer;