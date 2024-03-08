import {
    Container,
    Table,
    Row,
    Col,
    Form,
    FloatingLabel,
    Button,
    Spinner,
} from "react-bootstrap";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { HeadersWoToken, URL } from "../assets/common";
import { useUserContext } from "../context/UserContext";

export default function Dashboard() {
    const [duration, setDuration] = useState({
        fromDate: new Date().toISOString().split("T")[0],
        toDate: new Date().toISOString().split("T")[0],
    });

    const { user } = useUserContext();

    const [settlement, setSettlement] = useState({
        cash: 0,
        card: 0,
        upi: 0,
        settlement: 0,
    });

    const [customerCount, setCustomerCount] = useState(0);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [bestEmployees, setBestEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        const headers = {
            ...HeadersWoToken,
            Authorization: `Bearer ${user.token}`,
        };

        const response = await fetch(
            `${URL}/dashboard?from_date=${duration.fromDate}&to_date=${duration.toDate}`,
            {
                method: "GET",
                headers: headers,
            }
        );

        const data = await response.json();
        if (response.status === 200) {
            const { settlement, customerCount, employeeCount, bestEmployees } =
                data;
            setSettlement({ ...settlement });
            setCustomerCount(customerCount);
            setEmployeeCount(employeeCount);
            setBestEmployees(bestEmployees);
        } else {
            if (response.status === 401){
                localStorage.removeItem("user");
                window.location.reload();
            }
        }
        setLoading(false)
    };

    return (
        <Container className="dashboard">
            <h3 className="h1 text-center mt-3">Dashboard</h3>
            <hr />
            <Container>
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
                            onClick={loadDashboard}
                        >
                            {loading ? <Spinner variant="light" animation="border" /> : 'GO'}
                        </Button>
                    </Col>
                </Row>
            </Container>
            <hr />
            <Container className="grid-layout">
                <div
                    className={`box settlement ${loading && 'skeleton'}`}
                    style={{ backgroundColor: "#343634" }}
                >
                    <div className="title">
                        <h3>Settlement</h3>
                    </div>
                    <div className="value">
                        <h6 className="h2">{+settlement.settlement || 0}</h6>
                    </div>
                </div>
                <div
                    className={`box customers ${loading && 'skeleton'}`}
                    style={{ backgroundColor: "#4E514E" }}
                >
                    <div className="title">
                        <h3>Employees</h3>
                    </div>
                    <div className="value">
                        <h6 className="h1">{employeeCount || 0}</h6>
                    </div>
                </div>
                <div
                    className={`box employees ${loading && 'skeleton'}`}
                    style={{ backgroundColor: "#616661" }}
                >
                    <div className="title">
                        <h3>Customers</h3>
                    </div>
                    <div className="value">
                        <h6 className="h1">{customerCount || 0}</h6>
                    </div>
                </div>
                <div
                    className={`box settlement-cash ${loading && 'skeleton'}`}
                    style={{ backgroundColor: "#00625A" }}
                >
                    <div className="title">
                        <h3>Cash</h3>
                    </div>
                    <div className="value">
                        <h6 className="h1">{+settlement.cash || 0}</h6>
                    </div>
                </div>
                <div
                    className={`box settlement-card ${loading && 'skeleton'}`}
                    style= {{ backgroundColor: "#1F9589" }}
                >
                    <div className="title">
                        <h3>Card</h3>
                    </div>
                    <div className="value">
                        <h6 className="h1">{+settlement.card || 0}</h6>
                    </div>
                </div>
                <div
                    className={`box settlement-upi ${loading && 'skeleton'}`}
                    style={{ backgroundColor: "#25B5A6" }}
                >
                    <div className="title">
                        <h3>Upi</h3>
                    </div>
                    <div className="value">
                        <h6 className="h1">{+settlement.upi || 0}</h6>
                    </div>
                </div>
                <div className="box employee-list">
                    <div className="title">
                        <h3>Employees</h3>
                    </div>
                    <div className="value dashboard-table">
                        <Table variant="">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Qty</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bestEmployees.map((e, index) => (
                                    <tr key={index}>
                                        <td>{e.employee}</td>
                                        <td>{+e.qty}</td>
                                        <td>{e.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th>
                                        {bestEmployees.reduce(
                                            (acc, e) => acc + +e.qty,
                                            0
                                        )}
                                    </th>
                                    <th>
                                        {bestEmployees
                                            .reduce(
                                                (acc, e) => acc + +e.amount,
                                                0
                                            )
                                            .toFixed(2)}
                                    </th>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>
                </div>
            </Container>
        </Container>
    );
}
