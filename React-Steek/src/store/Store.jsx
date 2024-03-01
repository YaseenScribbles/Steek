import { configureStore } from "@reduxjs/toolkit";
import JobWorkSlice from "./JobWorkSlice";
import EmployeeSlice from "./EmployeeSlice";
import CustomerSlice from "./CustomerSlice";
import ScannedSlice from "./ScannedSlice";

export const Store = configureStore({
    reducer: {
        jobworks: JobWorkSlice,
        employees: EmployeeSlice,
        customers: CustomerSlice,
        scanned: ScannedSlice,
    },
});
