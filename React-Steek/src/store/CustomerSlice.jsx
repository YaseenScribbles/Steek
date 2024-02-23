import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status, URL, HeadersWoToken } from "../assets/common";

const initialState = {
    status: Status.Loading,
    data: [],
    meta: {},
};

export const CustomerSlice = createSlice({
    name: "CustomerSlice",
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.pending, (state, action) => {
                state.status = Status.Loading;
            })
            .addCase(getCustomers.fulfilled, (state, action) => {
                const { data, meta } = action.payload;
                state.status = Status.Success;
                state.data = data;
                state.meta = meta;
            })
            .addCase(getCustomers.rejected, (state, action) => {
                state.status = Status.Error;
                state.data = [];
                state.meta = {};
            });
    },
});

export const getCustomers = createAsyncThunk(
    "customers",
    async ({ token: token, currentPage = 1 }) => {
        const response = await fetch(`${URL}/customer?page=${currentPage}`, {
            method: "GET",
            headers: {
                ...HeadersWoToken,
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        return data;
    }
);

export default CustomerSlice.reducer;
export const {} = CustomerSlice.actions;
