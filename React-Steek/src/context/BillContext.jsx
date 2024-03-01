import { createContext, useContext, useState } from "react";

const BillContext = createContext({
    customerInfo: {},
    setCustomerInfo: () => {},
    settlementInfo: {},
    setSettlementInfo: () => {},
    discountInfo: {},
    setDiscountInfo: () => {},
    totalInfo: {},
    setTotalInfo: () => {}
});

export const useBillContext = () => useContext(BillContext);

export function BillContextProvider({ children }) {
    const [customerInfo, setCustomerInfo] = useState({
        id: 0,
        name: "",
        mobile: "",
    });

    const [settlementInfo, setSettlementInfo] = useState({
        cash: 0,
        card: 0,
        upi: 0,
    });

    const [discountInfo, setDiscountInfo] = useState({
        discPerc: 0,
        discValue: 0,
    });

    const [totalInfo, setTotalInfo] = useState({
        totalQty: 0,
        totalAmount: 0,
    })

    return (
        <BillContext.Provider
            value={{
                customerInfo,
                setCustomerInfo,
                settlementInfo,
                setSettlementInfo,
                discountInfo,
                setDiscountInfo,
                totalInfo,
                setTotalInfo
            }}
        >
            {children}
        </BillContext.Provider>
    );
}
