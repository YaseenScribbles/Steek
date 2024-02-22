import { configureStore } from "@reduxjs/toolkit";
import JobWorkSlice from "./JobWorkSlice";
import EmployeeSlice from "./EmployeeSlice";

export const Store = configureStore({
    reducer: {
        jobworks: JobWorkSlice,
        employees: EmployeeSlice,
    },
});
