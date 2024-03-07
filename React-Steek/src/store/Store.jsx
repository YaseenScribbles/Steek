import { configureStore } from "@reduxjs/toolkit";
import JobWorkSlice from "./JobWorkSlice";
import EmployeeSlice from "./EmployeeSlice";
import CustomerSlice from "./CustomerSlice";
import ScannedSlice from "./ScannedSlice";
import BillsSlice from "./BillsSlice";

export const Store = configureStore({
    reducer: {
        jobworks: JobWorkSlice,
        employees: EmployeeSlice,
        customers: CustomerSlice,
        scanned: ScannedSlice,
        bills: BillsSlice,
    },
});
