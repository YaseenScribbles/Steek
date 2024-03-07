import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HeadersWoToken, Status, URL } from "../assets/common";

const initialState = {
    status: Status.Success,
    data: [],
    meta: {},
};

export const BillsSlice = createSlice({
    name: "BillsSlice",
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getBills.pending, (state, action) => {
                state.status = Status.Loading;
            })
            .addCase(getBills.fulfilled, (state, action) => {
                state.status = Status.Success;
                state.data = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(getBills.rejected, (state, action) => {
                state.status = Status.Error;
                state.data = [];
                state.meta = {};
            });
    },
});

export const getBills = createAsyncThunk(
    "bills",
    async ({ token, currentPage = 1, fromDate, toDate }) => {
        const headers = { ...HeadersWoToken, Authorization: `Bearer ${token}` };
        const response = await fetch(
            `${URL}/bill?page=${currentPage}&from_date=${fromDate}&to_date=${toDate}`,
            { method: "GET", headers: headers }
        );
        const result = await response.json();
        return result;
    }
);

export default BillsSlice.reducer;
export const {} = BillsSlice.actions;
