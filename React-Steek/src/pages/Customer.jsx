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
import { useUserContext } from "../context/UserContext";
import { useErrorContext } from "../context/ErrorContext";
import { useDispatch, useSelector } from "react-redux";
import MyPagination from "../components/Pagination";
import { Status, HeadersWoToken, URL } from "../assets/common";
import { getCustomers } from "../store/CustomerSlice";

export default function Customer() {
    const [loading, setLoading] = useState(false);
    const initialState = {
        name: "",
        mobile: "",
        address: "",
    };
    const [customer, setCustomer] = useState(initialState);
    const [editId, setEditId] = useState(0);
    const { user } = useUserContext();
    const { setErrors } = useErrorContext();
    const dispatch = useDispatch();
    const {
        status: customersStatus,
        data: customers,
        meta,
    } = useSelector((s) => s.customers);
    const customersPerPage = 8;
    const [currentPage, setCurrentpage] = useState(1);
    const headers = {
        ...HeadersWoToken,
        Authorization: `Bearer ${user.token}`,
    };

    useEffect(() => {
        dispatch(getCustomers({ token: user.token }));
    }, []);

    useEffect(() => {
        dispatch(getCustomers({ token: user.token, currentPage }));
    }, [currentPage]);

    const addCustomer = async () => {
        setLoading(true);

        let response = null;

        if (editId === 0) {
            response = await fetch(`${URL}/customer`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ ...customer, user_id: user.id }),
            });
        } else {
            response = await fetch(`${URL}/customer/${editId}?_method=PUT`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ ...customer, user_id: user.id }),
            });
        }

        const data = await response.json();

        if (response.status === 200) {
            setCustomer(initialState);
            dispatch(getCustomers({ token: user.token, currentPage }));
            setEditId(0);
        } else {
            const errors = Object.values(data.errors).flatMap((e) => e);
            setErrors(errors);
        }

        setLoading(false);
    };

    const editCustomer = (c) => {
        setEditId(+c.id);
        setCustomer({
            name: c.name,
            mobile: c.mobile,
            address: c.address || "",
        });
    };

    const deactivateCustomer = async (id) => {
        setLoading(true);
        const response = await fetch(`${URL}/customer/${id}`, {
            method: "DELETE",
            headers: headers,
        });

        if (response.status === 200) {
            dispatch(getCustomers({ token: user.token, currentPage }));
        } else {
            setErrors([response.statusText]);
        }
        setLoading(false);
    };

    return (
        <Container className="customer-page">
            {loading && (
                <div className="text-center">
                    <Spinner variant={"secondary"} animation={"grow"} />
                </div>
            )}
            <h3 className="h1 text-center mt-3">Customer </h3>
            <hr />
            <Row className="mb-3">
                <Col xs={3}>
                    <FloatingLabel
                        controlId="name"
                        label="Name"
                        className="text-secondary"
                    >
                        <Form.Control
                            type="text"
                            placeholder="***"
                            value={customer.name}
                            onChange={(e) =>
                                setCustomer({
                                    ...customer,
                                    name: e.target.value,
                                })
                            }
                            autoFocus
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={2}>
                    <FloatingLabel
                        controlId="mobile"
                        label="Mobile"
                        className="text-secondary"
                    >
                        <Form.Control
                            type="text"
                            placeholder="***"
                            value={customer.mobile}
                            onChange={(e) =>
                                setCustomer({
                                    ...customer,
                                    mobile: e.target.value,
                                })
                            }
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={4}>
                    <FloatingLabel
                        controlId="address"
                        label="Address"
                        className="text-secondary"
                    >
                        <Form.Control
                            type="text"
                            placeholder="***"
                            value={customer.address}
                            onChange={(e) =>
                                setCustomer({
                                    ...customer,
                                    address: e.target.value,
                                })
                            }
                            as={"textarea"}
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={3}>
                    <Button
                        variant={"secondary"}
                        className="h-100 w-50"
                        onClick={addCustomer}
                    >
                        {editId > 0 ? "UPDATE" : "ADD"}
                    </Button>
                </Col>
            </Row>
            <hr />
            <Row>
                <h3 className="text-center h1">List</h3>
            </Row>
            <hr />
            <Container className="table">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Address</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customersStatus === Status.Loading ? (
                            <tr>
                                <td className="text-center" colSpan={7}>
                                    Loading...
                                </td>
                            </tr>
                        ) : customersStatus === Status.Success &&
                          customers.length > 0 ? (
                            customers.map((c, index) => {
                                const serialNumber =
                                    (currentPage - 1) * customersPerPage +
                                    index +
                                    1;
                                return (
                                    <tr key={index}>
                                        <td>{serialNumber}</td>
                                        <td>{c.name.toUpperCase()}</td>
                                        <td>{c.mobile && c.mobile}</td>
                                        <td>
                                            {c.address &&
                                                c.address.toUpperCase()}
                                        </td>
                                        <td>
                                            {+c.active === 1 ? "YES" : "NO"}
                                        </td>
                                        <td>
                                            <Button
                                                variant="info"
                                                disabled={+c.active !== 1}
                                                onClick={() => editCustomer(c)}
                                            >
                                                EDIT
                                            </Button>
                                            &nbsp;
                                            <Button
                                                variant="danger"
                                                onClick={() =>
                                                    deactivateCustomer(c.id)
                                                }
                                            >
                                                {+c.active !== 1
                                                    ? "ACTIVATE"
                                                    : "SUSPEND"}
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td className="text-center" colSpan={7}>
                                    No Data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
            {customers.length > 0 && meta.last_page > 1 && (
                <Container className="d-flex justify-content-end">
                    <MyPagination
                        currentPage={currentPage}
                        totalPages={meta.last_page}
                        onPageChange={(page) => setCurrentpage(page)}
                    />
                </Container>
            )}
        </Container>
    );
}
