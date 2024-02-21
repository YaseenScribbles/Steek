import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status, HeadersWoToken, URL } from "../assets/common";

const initialState = {
    status: Status.Loading,
    data: [],
    meta: {},
};

const JobWorkSlice = createSlice({
    name: "JobWorkSlice",
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getJobWorks.fulfilled, (state, action) => {
                state.status = Status.Success;
                const { data, meta } = action.payload;
                state.data = data;
                state.meta = meta;
            })
            .addCase(getJobWorks.pending, (state, action) => {
                state.status = Status.Loading;
            })
            .addCase(getJobWorks.rejected, (state, action) => {
                state.status = Status.Error;
                state.data = [];
                state.meta = {};
            });
    },
});

export const getJobWorks = createAsyncThunk(
    "jobworks",
    async ({token, currentPage = 1}) => {
        const headers = {
            ...HeadersWoToken,
            Authorization: `Bearer ${token}`,
        };
        const options = {
            method: "GET",
            headers: headers,
        };
        const response = await fetch(
            `${URL}/jobwork?page=${currentPage}`,
            options
        );
        const data = await response.json();
        return data;
    }
);

export default JobWorkSlice.reducer;
export const {} = JobWorkSlice.actions;
