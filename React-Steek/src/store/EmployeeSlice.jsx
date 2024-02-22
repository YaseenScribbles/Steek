import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status, HeadersWoToken, URL } from "../assets/common";

const initialState = {
    status: Status.Loading,
    data: [],
    meta: {},
};

export const EmployeeSlice = createSlice({
    name: "EmployeeSlice",
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getEmployees.pending, (state, action) => {
                state.status = Status.Loading;
            })
            .addCase(getEmployees.fulfilled, (state, action) => {
                state.status = Status.Success;
                const { data, meta } = action.payload;
                state.data = data;
                state.meta = meta;
            })
            .addCase(getEmployees.rejected, (state, action) => {
                state.status = Status.Error;
                state.data = [];
                state.meta = {};
            });
    },
});

export const getEmployees = createAsyncThunk(
    "employees",
    async ({ token, currentPage = 1 }) => {
        const headers = { ...HeadersWoToken, Authorization: `Bearer ${token}` };
        const options = {
            method: "GET",
            headers: headers,
        };
        const response = await fetch(`${URL}/employee?page=${currentPage}`,options);
        const data = await response.json();
        return data;
    }
);

export default EmployeeSlice.reducer;
export const {} = EmployeeSlice.actions;
