import { useEffect, useState } from "react";
import {
    Button,
    Col,
    Container,
    FloatingLabel,
    Form,
    Row,
    Spinner,
    Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getBills } from "../store/BillsSlice";
import { useUserContext } from "../context/UserContext";
import { useErrorContext } from "../context/ErrorContext";
import MyPagination from "../components/Pagination";
import { HeadersWoToken, Status, URL } from "../assets/common";
import PrintBill from "../components/PrintBill";
import ReactDOMServer from 'react-dom/server'

export default function Bills() {
    const [loading, setLoading] = useState(false);
    const { user } = useUserContext();
    const { setErrors } = useErrorContext();
    const dispatch = useDispatch();
    const [duration, setDuration] = useState({
        fromDate: new Date().toISOString().split("T")[0],
        toDate: new Date().toISOString().split("T")[0],
    });
    const {
        data: bills,
        status: billsStatus,
        meta,
    } = useSelector((s) => s.bills);
    const [currentPage, setCurrentpage] = useState(1);
    const numberOfResults = 8;
    const headers = {
        ...HeadersWoToken,
        Authorization: `Bearer ${user.token}`,
    };

    const loadBills = async () => {
        dispatch(
            getBills({
                token: user.token,
                currentPage: currentPage,
                fromDate: duration.fromDate,
                toDate: duration.toDate,
            })
        );
    };

    useEffect(() => {
        dispatch(
            getBills({
                token: user.token,
                currentPage: currentPage,
                fromDate: duration.fromDate,
                toDate: duration.toDate,
            })
        );
    }, []);

    useEffect(() => {
        dispatch(
            getBills({
                token: user.token,
                currentPage: currentPage,
                fromDate: duration.fromDate,
                toDate: duration.toDate,
            })
        );
    }, [currentPage]);

    const changeStatus = async (id) => {
        setLoading(true);
        const response = await fetch(`${URL}/bill/${id}`, {
            method: "DELETE",
            headers: headers,
        });
        if (response.status === 200) {
            dispatch(
                getBills({
                    token: user.token,
                    currentPage: currentPage,
                    fromDate: duration.fromDate,
                    toDate: duration.toDate,
                })
            );
        } else {
            setErrors([response.statusText]);
        }
        setLoading(false);
    };

    const printBill = async (id) => {
        setLoading(true);
        const response = await fetch(`${URL}/bill/${id}`, {
            method: "GET",
            headers: headers,
        });

        const data = await response.json();

        if (response.status === 200) {
            const { billMasters, billDetails, billSettlements, customer } =
                data;

            const printBillElement = ReactDOMServer.renderToString(
                <PrintBill
                    billMaster={billMasters}
                    billDetail={billDetails}
                    setttlementInfo={billSettlements[0]}
                    customerInfo={customer}
                    returnAmt={billSettlements[0].return}
                    totalInfo={{
                        totalQty: billMasters.total_qty,
                        totalAmount: billMasters.total_amount,
                    }}
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
        } else {
            setErrors([response.statusText]);
        }

        setLoading(false)
    };

    return (
        <Container className="bills">
            {(loading || billsStatus === Status.Loading) && (
                <div className="text-center">
                    <Spinner variant="secondary" animation="grow" />
                </div>
            )}
            <h3 className="h1 text-center mt-3">Bills </h3>
            <hr />
            <Row className="mb-3">
                <Col xs={2}>
                    <FloatingLabel
                        controlId="fromDate"
                        label="From"
                        className="text-secondary"
                    >
                        <Form.Control
                            type="date"
                            placeholder="***"
                            value={duration.fromDate}
                            onChange={(e) => {
                                setDuration({
                                    ...duration,
                                    fromDate: e.target.value,
                                });
                            }}
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={2}>
                    <FloatingLabel
                        controlId="toDate"
                        label="To"
                        className="text-secondary"
                    >
                        <Form.Control
                            type="date"
                            placeholder="***"
                            value={duration.toDate}
                            onChange={(e) =>
                                setDuration({
                                    ...duration,
                                    toDate: e.target.value,
                                })
                            }
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={2}>
                    <Button
                        variant="secondary"
                        className="h-100 w-50"
                        onClick={loadBills}
                    >
                        GO
                    </Button>
                </Col>
            </Row>
            <hr />
            <h3 className="h1 text-center mt-3">List</h3>
            <hr />
            <Container className="table">
                <Table bordered striped hover responsive>
                    <thead>
                        <tr>
                            <th>S No</th>
                            <th>Bill No</th>
                            <th>Bill Date</th>
                            <th>Total Qty</th>
                            <th>Total Amount</th>
                            <th>Customer</th>
                            <th>User</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billsStatus === Status.Loading ? (
                            <tr>
                                <td colSpan={9} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : bills.length > 0 ? (
                            bills.map((b, index) => {
                                const serialNumber =
                                    (currentPage - 1) * numberOfResults +
                                    index +
                                    1;
                                return (
                                    <tr key={index}>
                                        <td>{serialNumber}</td>
                                        <td>{b.billNo.toUpperCase()}</td>
                                        <td>
                                            {new Date(
                                                b.billDate
                                            ).toDateString()}
                                        </td>
                                        <td>{b.totalQty}</td>
                                        <td>{b.totalAmount}</td>
                                        <td>{b.customer.toUpperCase()}</td>
                                        <td>{b.user.toUpperCase()}</td>
                                        <td>
                                            {+b.active === 1 ? "YES" : "NO"}
                                        </td>
                                        <td>
                                            &nbsp; &nbsp;
                                            <Button
                                                variant="info"
                                                onClick={() => printBill(b.id)}
                                            >
                                                VIEW
                                            </Button>
                                            &nbsp; &nbsp;
                                            <Button
                                                variant="danger"
                                                onClick={() =>
                                                    changeStatus(b.id)
                                                }
                                            >
                                                {+b.active === 1
                                                    ? "SUSPEND"
                                                    : "ACTIVATE"}
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center">
                                    No Data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
            {bills.length > 0 && meta.last_page > 1 && (
                <Container className="d-flex justify-content-end">
                    <MyPagination
                        currentPage={currentPage}
                        totalPages={meta.last_page}
                        onPageChange={(p) => setCurrentpage(p)}
                    />
                </Container>
            )}
        </Container>
    );
}
