import { configureStore } from "@reduxjs/toolkit";
import JobWorkSlice from "./JobWorkSlice";

export const Store = configureStore({
    reducer: {
        jobworks: JobWorkSlice,
    },
});
