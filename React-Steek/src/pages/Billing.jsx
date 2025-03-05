import { useEffect, useRef, useState } from "react";
import {
    Col,
    Container,
    FloatingLabel,
    Form,
    FormLabel,
    Row,
    Spinner,
    Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useErrorContext } from "../context/ErrorContext";
import { useUserContext } from "../context/UserContext";
import { add, clear, remove, updateEmployee } from "../store/ScannedSlice";
import { getJobWorks } from "../store/JobWorkSlice";
import { getCustomers } from "../store/CustomerSlice";
import { getEmployees } from "../store/EmployeeSlice";
import "boxicons";
import QtyModal from "../components/QtyModal";
import EmployeeModal from "../components/EmployeeModal";
import { useBillContext } from "../context/BillContext";
import DiscountModal from "../components/DiscountModal";
import SettlementModal from "../components/SettlementModal";
import "./Billing.css";
import { HeadersWoToken, Status, URL } from "../assets/common";
import CustomerModal from "../components/CustomerModal";
import PrintBill from "../components/PrintBill";
import ReactDOMServer from "react-dom/server";

export default function Billing() {
    const [loading, setLoading] = useState(false);
    const { data: employees, status: employeeStatus } = useSelector(
        (s) => s.employees
    );
    const { data: customers, status: customerStatus } = useSelector(
        (s) => s.customers
    );
    const { data: jobworks, status: jobworkStatus } = useSelector(
        (s) => s.jobworks
    );
    const scanned = useSelector((s) => s.scanned);
    const { setErrors } = useErrorContext();
    const { user } = useUserContext();
    const [universal, setUniversal] = useState("");
    const dispatch = useDispatch();
    const [showQtyModal, setShowQtyModal] = useState(false);
    const [jobWorkCode, setJobWorkCode] = useState("");
    const [showEmpModal, setShowEmpModal] = useState(false);
    const {
        totalInfo,
        setTotalInfo,
        discountInfo,
        setDiscountInfo,
        customerInfo,
        setCustomerInfo,
        settlementInfo,
        setSettlementInfo,
    } = useBillContext();
    const [showDiscModal, setShowDiscModal] = useState(false);
    const [showSettlementModal, setShowSettlmentModal] = useState(false);
    const lastRowRef = useRef();
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const inpuRef = useRef();

    const headers = {
        ...HeadersWoToken,
        Authorization: `Bearer ${user.token}`,
    };

    useEffect(() => {
        dispatch(getJobWorks({ token: user.token, currentPage: 0 }));
        dispatch(getCustomers({ token: user.token, currentPage: 0 }));
        dispatch(getEmployees({ token: user.token, currentPage: 0 }));
    }, []);

    useEffect(() => {
        const totalQty = scanned.reduce((acc, currValue) => {
            return acc + +currValue.qty;
        }, 0);
        const totalValue = scanned.reduce((acc, currValue) => {
            return acc + +currValue.mrp * +currValue.qty - +currValue.discValue;
        }, 0);
        const discValue = scanned.reduce((acc, currValue) => {
            return acc + +currValue.discValue;
        }, 0);
        const grossValue = scanned.reduce((acc, currValue) => {
            return acc + +currValue.mrp * +currValue.qty;
        }, 0);

        setTotalInfo({
            totalQty: totalQty,
            totalAmount: parseFloat(totalValue.toFixed(2)),
            grossAmount: grossValue,
        });
        setDiscountInfo({ ...discountInfo, discValue: discValue });

        if (lastRowRef.current) {
            lastRowRef.current.scrollIntoView({ behaviour: "smooth" });
        }
    }, [scanned]);

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            if (universal) {
                let employee = null;
                let customer = null;
                let jobwork = null;

                if (universal.length === 1 && universal.slice(0, 1) === "D") {
                    if (scanned.length > 0) {
                        setShowDiscModal(true);
                        return;
                    }
                }

                if (universal.length === 1 && universal.slice(0, 1) === "0") {
                    if (scanned.length > 0) {
                        setShowSettlmentModal(true);
                        return;
                    }
                }

                if (universal.length === 1 && universal.slice(0, 1) === "C") {
                    if (scanned.length > 0) {
                        setShowCustomerModal(true);
                        return;
                    }
                }

                if (universal.slice(0, 1) === ".") {
                    employee = employees.find(
                        (e) => e.code === universal.slice(1)
                    );
                    if (!employee) {
                        setErrors(["Employee not found"]);
                    } else {
                        if (scanned.length > 0) {
                            dispatch(updateEmployee(employee.code));
                        } else {
                            setErrors(["Please add jobworks"]);
                        }
                        setUniversal("");
                    }
                    return;
                }

                const regexPattern = /^\d{10}$/;
                if (universal.length === 10 && regexPattern.test(universal)) {
                    customer = customers.find((c) => c.mobile === universal);
                    if (!customer) {
                        setCustomerInfo({
                            id: 0,
                            mobile: universal,
                            name: "",
                        });
                    } else {
                        setCustomerInfo({
                            id: customer.id,
                            mobile: customer.mobile,
                            name: customer.name,
                        });
                    }
                    setUniversal("");
                    return;
                }

                jobwork = jobworks.find((w) => w.code === universal);
                if (!jobwork) {
                    setErrors(["Jobwork not found"]);
                } else {
                    dispatch(
                        add({
                            code: jobwork.code.toUpperCase(),
                            description: jobwork.description.toUpperCase(),
                            qty: 1,
                            mrp: jobwork.price,
                            disc: 0,
                            discValue: 0,
                            saleValue: 1 * jobwork.price,
                            total: 1 * jobwork.price,
                            empCode: "",
                        })
                    );
                    setUniversal("");
                }
            }
        }
    };

    // Function to rename keys in array of objects
    function renameKeys(arrayOfObjects, keyMap) {
        return arrayOfObjects.map((object) => {
            const newObject = {};
            for (const oldKey in object) {
                const newKey = keyMap[oldKey] || oldKey; // Use the new key if provided in key map, otherwise keep the old key
                newObject[newKey] = object[oldKey];
            }
            return newObject;
        });
    }

    const saveBill = async (returnAmt) => {
        setLoading(true);

        // Define key map to rename keys
        const keyMap = {
            saleValue: "rate",
            total: "amount",
            disc: "disc_perc",
            discValue: "disc_value",
            empCode: "emp_code",
        };

        // Rename keys in the array of objects using the key map
        const bill_details = renameKeys(scanned, keyMap);

        const body = {
            total_qty: totalInfo.totalQty,
            total_amount: Math.round(totalInfo.totalAmount),
            disc_perc: discountInfo.discPerc,
            disc_amount: discountInfo.discValue,
            customer_id: customerInfo.id,
            remarks: "",
            user_id: user.id,
            bill_details: bill_details,
            ...settlementInfo,
            return: returnAmt,
            customer_name: customerInfo.name,
            customer_mobile: customerInfo.mobile,
        };

        const response = await fetch(`${URL}/bill`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.status === 200) {
            setErrors([data.message]);
            const billMaster = data.billMaster;

            const printBillElement = ReactDOMServer.renderToStaticMarkup(
            <PrintBill
                billMaster={billMaster}
                billDetail={bill_details}
                customerInfo={customerInfo}
                setttlementInfo={settlementInfo}
                totalInfo={totalInfo}
                returnAmt={returnAmt}
            />
            );
            const BillContent = `
            <html lang="en">
                <head>
                    <title>Steek</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
                    rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
                    crossorigin="anonymous">
                    <style>
                        * {
                            padding: 0;
                            margin: 0,
                            box-sizing: border-box;
                        }

                        body, html {
                            padding: 0;
                            margin: 0;
                        }

                        body {
                            font-family: monospace;
                            font-weight:900;
                        }

                        #bill-content {
                            color: #000;
                            margin-top:0;
                        }

                        hr {
                            opacity:1
                        }

                        tfoot {
                            font-family: monospace;
                        }

                        @media print {
                            /* Adjustments for printing */
                            body, html {
                                padding: 0;
                                margin: 0;
                            }
                        }

                    </style>
                </head>
                <body>
                    <div id="bill-content">
                        ${printBillElement}
                    </div>
                </body>
            </html>`;

            const printWindow = window.open("", "_blank");
            printWindow.document.write(BillContent);
            printWindow.document.close();

            resetForm();
            inpuRef.current.focus();
        } else {
            try {
                const errors = Object.values(data.errors).flatMap((e) => e);
                setErrors(errors);
            } catch (error) {
                if (error) {
                    setErrors([error]);
                } else {
                    setErrors([data.message]);
                }
            }
        }

        setLoading(false);
    };

    const resetForm = async () => {
        dispatch(getCustomers({ token: user.token, currentPage: 0 }));
        dispatch(clear());
        setCustomerInfo({
            id: 0,
            name: "",
            mobile: "",
        });
        setDiscountInfo({
            discPerc: 0,
            discValue: 0,
        });
        setSettlementInfo({
            cash: 0,
            card: 0,
            upi: 0,
        });
        setTotalInfo({
            totalQty: 0,
            totalAmount: 0,
        });
    };

    return (
        <Container className="billing">
            {(loading ||
                jobworkStatus === Status.Loading ||
                employeeStatus === Status.Loading ||
                customerStatus === Status.Loading) && (
                <div className="text-center">
                    <Spinner variant={"secondary"} animation={"grow"} />
                </div>
            )}
            <h3 className="h1 text-center mt-3">POS</h3>
            <hr />
            <Row className="d-flex justify-content-between w-100">
                <Col xs="3">
                    <FloatingLabel
                        controlId="universal"
                        label="Code / Mobile / Employee"
                        className="text-secondary"
                    >
                        <Form.Control
                            type="text"
                            placeholder="***"
                            onKeyDown={(e) => handleKeyDown(e)}
                            value={universal}
                            onChange={(e) => setUniversal(e.target.value)}
                            autoFocus
                            ref={inpuRef}
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={4}>
                    <Row className="text-end">
                        <Col xs={5}>
                            <FormLabel>Customer Name</FormLabel>
                        </Col>
                        <Col xs={2}>
                            <FormLabel>:</FormLabel>
                        </Col>
                        <Col xs={5}>
                            <span className="text-danger">
                                {customerInfo.name
                                    ? customerInfo.name.toUpperCase()
                                    : ""}
                            </span>
                        </Col>
                    </Row>
                    <Row className="text-end">
                        <Col xs={5}>
                            <FormLabel>Mobile</FormLabel>
                        </Col>
                        <Col xs={2}>
                            <FormLabel>:</FormLabel>
                        </Col>
                        <Col xs={5}>
                            <span className="text-danger">
                                {customerInfo.mobile ? customerInfo.mobile : ""}
                            </span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <hr />
            <Container fluid className="billing-table p-0">
                <Table variant="secondary" striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>MRP</th>
                            <th>Disc %</th>
                            <th>Disc Value</th>
                            <th>Sale Price</th>
                            <th>Total</th>
                            <th>Employee</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scanned.map((s, index) => {
                            return (
                                <tr
                                    key={index}
                                    className=""
                                    ref={
                                        index === scanned.length - 1
                                            ? lastRowRef
                                            : null
                                    }
                                >
                                    <td className="" style={{ width: "1rem" }}>
                                        {index + 1}
                                    </td>
                                    <td className="" style={{ width: "3rem" }}>
                                        {s.code}
                                    </td>
                                    <td className="" style={{ width: "5rem" }}>
                                        {s.description}
                                    </td>
                                    <td
                                        className="text-end"
                                        style={{ width: "2rem" }}
                                    >
                                        {s.qty}
                                    </td>
                                    <td
                                        className="text-end"
                                        style={{ width: "2rem" }}
                                    >
                                        {s.mrp}
                                    </td>
                                    <td
                                        className="text-end"
                                        style={{ width: "2rem" }}
                                    >
                                        {(+s.disc).toFixed(2)}
                                    </td>
                                    <td
                                        className="text-end"
                                        style={{ width: "2rem" }}
                                    >
                                        {(+s.discValue).toFixed(2)}
                                    </td>
                                    <td
                                        className="text-end"
                                        style={{ width: "2rem" }}
                                    >
                                        {(+s.saleValue).toFixed(2)}
                                    </td>
                                    <td
                                        className="text-end"
                                        style={{ width: "2rem" }}
                                    >
                                        {(+s.total).toFixed(2)}
                                    </td>
                                    <td className="" style={{ width: "3rem" }}>
                                        {s.empCode !== ""
                                            ? employees.find(
                                                  (e) => e.code === s.empCode
                                              ).name
                                            : ""}
                                    </td>
                                    <td style={{ width: "8.5rem" }}>
                                        &nbsp; &nbsp;
                                        <div
                                            className="d-inline"
                                            onClick={() => {
                                                setJobWorkCode(s.code);
                                                setShowQtyModal(true);
                                            }}
                                        >
                                            <box-icon
                                                name="cart-add"
                                                type="regular"
                                                size="sm"
                                                color="#0DCAF0"
                                            ></box-icon>
                                        </div>
                                        &nbsp; &nbsp;
                                        <div
                                            onClick={() => {
                                                setJobWorkCode(s.code);
                                                setShowEmpModal(true);
                                            }}
                                        >
                                            <box-icon
                                                name="user"
                                                type="regular"
                                                size="sm"
                                                color="#0DCAF0"
                                            ></box-icon>
                                        </div>
                                        &nbsp; &nbsp;
                                        <div
                                            onClick={() =>
                                                dispatch(remove(s.code))
                                            }
                                        >
                                            <box-icon
                                                name="message-square-x"
                                                type="regular"
                                                size="sm"
                                                color="red"
                                            ></box-icon>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th className="text-end">{totalInfo.totalQty}</th>
                            <th></th>
                            <th></th>
                            <th className="text-end">
                                {(+discountInfo.discValue).toFixed(2)}
                            </th>
                            <th></th>
                            <th className="text-end">
                                {(+totalInfo.totalAmount).toFixed(2)}
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                    </tfoot>
                </Table>
            </Container>
            <hr />
            <h5 className="h4 text-center">Summary</h5>
            <Container className="d-flex justify-content-center mt-2 mb-3">
                <div
                    className="border-end d-flex justify-content-center align-items-center"
                    style={{ height: "75px", width: "200px" }}
                >
                    <h4 className="h1">{totalInfo.totalQty}</h4>
                </div>
                <div
                    className="border-start d-flex justify-content-center align-items-center"
                    style={{ height: "75px", width: "200px" }}
                >
                    <h4 className="h1">{Math.round(totalInfo.totalAmount)}</h4>
                </div>
            </Container>
            <QtyModal
                show={showQtyModal}
                closeQtyModal={() => setShowQtyModal(false)}
                code={jobWorkCode}
            />
            <EmployeeModal
                show={showEmpModal}
                code={jobWorkCode}
                closeEmpModal={() => setShowEmpModal(false)}
            />
            <DiscountModal
                show={showDiscModal}
                closeDiscModal={() => {
                    setShowDiscModal(false);
                    setUniversal("");
                }}
            />
            <SettlementModal
                show={showSettlementModal}
                closeSettlementModal={() => {
                    setShowSettlmentModal(false);
                    setUniversal("");
                }}
                saveBill={saveBill}
            />
            <CustomerModal
                show={showCustomerModal}
                closeCustomerModal={() => {
                    setShowCustomerModal(false);
                    setUniversal("");
                }}
                customers={customers}
            />
        </Container>
    );
}
