import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const ScannedSlice = createSlice({
    name: "ScannedSlice",
    initialState: initialState,
    reducers: {
        add(state, action) {
            const jobworkIndex = state.findIndex(
                (s) => s.code === action.payload.code
            );
            if (jobworkIndex !== -1) {
                state[jobworkIndex] = {
                    ...state[jobworkIndex],
                    qty: state[jobworkIndex].qty + 1,
                    total:
                        (state[jobworkIndex].qty + 1) *
                        +state[jobworkIndex].mrp,
                };
            } else {
                state.push(action.payload);
            }
        },
        remove(state, action) {
            return state.filter((s) => s.code !== action.payload);
        },
        updateQty(state, action) {
            const jobWorkIndex = state.findIndex(
                (s) => s.code === action.payload.code
            );

            if (jobWorkIndex !== -1) {
                state[jobWorkIndex].qty = action.payload.qty;
                state[jobWorkIndex].total =
                    +action.payload.qty * +state[jobWorkIndex].mrp;
            }

            // return state.map((s) => {
            //     if (s.code === action.payload.code) {
            //         return {
            //             ...s,
            //             qty: action.payload.qty,
            //         };
            //     } else {
            //         return s;
            //     }
            // });
        },
        updateEmployee(state, action) {
            return state.map((s) => {
                if (s.empCode === "") {
                    return {
                        ...s,
                        empCode: action.payload,
                    };
                } else {
                    return s;
                }
            });
        },
        updateDisc(state, action) {
            return state.map((s) => {
                return {
                    ...s,
                    disc: action.payload,
                    discValue: (s.qty * s.mrp * action.payload) / 100,
                    saleValue: s.mrp - (s.mrp * action.payload) / 100,
                    total: s.qty * (s.mrp - (s.mrp * action.payload) / 100),
                };
            });
        },
        updateEmployeeByBarcode(state, action) {
            const { empCode, jobWorkCode } = action.payload;
            const jobWorkIndex = state.findIndex((s) => s.code === jobWorkCode);
            if (jobWorkIndex !== -1) {
                state[jobWorkIndex].empCode = empCode;
            }
        },
        clear(state,action){
            return [];
        }
    },
});

export default ScannedSlice.reducer;
export const {
    add,
    remove,
    updateDisc,
    updateEmployee,
    updateQty,
    updateEmployeeByBarcode,
    clear
} = ScannedSlice.actions;
