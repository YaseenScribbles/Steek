import { useEffect, useState, useRef } from "react";
import {
    Button,
    Col,
    Container,
    FloatingLabel,
    Form,
    Row,
    Table,
    Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { HeadersWoToken, Status, URL } from "../assets/common";
import MyPagination from "../components/Pagination";
import { getEmployees } from "../store/EmployeeSlice";
import { useUserContext } from "../context/UserContext";
import { useErrorContext } from "../context/ErrorContext";

export default function Employee() {
    const [loading, setLoading] = useState(false);
    const employeesPerPage = 8;
    const [currentPage, setCurrentpage] = useState(1);
    const dispatch = useDispatch();
    const { user } = useUserContext();
    const { setErrors } = useErrorContext();
    const initialState = { code: "", name: "", role: "", mobile: "" };
    const [employee, setEmployee] = useState(initialState);
    const [editId, setEditId] = useState(0);
    const codeInputRef = useRef(null);

    const {
        data: employees,
        status: employeesStatus,
        meta,
    } = useSelector((s) => s.employees);

    useEffect(() => {
        dispatch(getEmployees({ token: user.token }));
    }, []);

    useEffect(() => {
        dispatch(getEmployees({ token: user.token, currentPage }));
    }, [currentPage]);

    const addEmployee = async () => {
        setLoading(true);

        const headers = {
            ...HeadersWoToken,
            Authorization: `Bearer ${user.token}`,
        };

        let response = null;

        try {
            if (editId === 0) {
                response = await fetch(`${URL}/employee`, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({ ...employee, user_id: user.id }),
                });
            } else {
                response = await fetch(
                    `${URL}/employee/${editId}?_method=PUT`,
                    {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({ ...employee, user_id: user.id }),
                    }
                );
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
        const data = await response.json();

        if (response.status === 200) {
            setEmployee(initialState);
            setEditId(0);
            dispatch(getEmployees({ token: user.token, currentPage }));
        } else {
            const errors = Object.values(data.errors).flatMap((e) => e);
            setErrors(errors);
        }

        setLoading(false);
    };

    const editEmployee = (employee) => {
        setEditId(+employee.id);
        setEmployee({
            code: employee.code,
            name: employee.name,
            role: employee.role || "",
            mobile: employee.mobile || "",
        });
        codeInputRef.current.focus();
    };

    const deactivateEmployee = async (id) => {
        setLoading(true);
        const headers = {
            ...HeadersWoToken,
            Authorization: `Bearer ${user.token}`,
        };

        const response = await fetch(`${URL}/employee/${id}`, {
            method: "DELETE",
            headers: headers,
        });

        if (response.status === 200) {
            dispatch(getEmployees({ token: user.token, currentPage }));
        } else {
            setErrors([response.statusText]);
        }
        setLoading(false);
    };

    return (
        <Container className="employee-page">
            {loading && (
                <div className="text-center">
                    <Spinner variant="secondary" animation="grow" />
                </div>
            )}
            <h3 className="h1 text-center mt-3">Employee </h3>
            <hr />
            <Row className="mb-3">
                <Col xs={2}>
                    <FloatingLabel
                        controlId="code"
                        label="Code"
                        className="text-secondary"
                    >
                        <Form.Control
                            type="text"
                            placeholder="***"
                            value={employee.code}
                            onChange={(e) =>
                                setEmployee({
                                    ...employee,
                                    code: e.target.value,
                                })
                            }
                            autoFocus
                            ref={codeInputRef}
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={4}>
                    <FloatingLabel
                        controlId="name"
                        label="Name"
                        className="text-secondary"
                    >
                        <Form.Control
                            type="text"
                            placeholder="***"
                            value={employee.name}
                            onChange={(e) =>
                                setEmployee({
                                    ...employee,
                                    name: e.target.value,
                                })
                            }
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={2}>
                    <FloatingLabel
                        controlId="role"
                        label="Role"
                        className="text-secondary"
                    >
                        <Form.Control
                            type="text"
                            placeholder="***"
                            value={employee.role}
                            onChange={(e) =>
                                setEmployee({
                                    ...employee,
                                    role: e.target.value,
                                })
                            }
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
                            value={employee.mobile}
                            onChange={(e) =>
                                setEmployee({
                                    ...employee,
                                    mobile: e.target.value,
                                })
                            }
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={2}>
                    <Button
                        className="h-100 w-75"
                        variant="secondary"
                        onClick={addEmployee}
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
                            <th>Code</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Mobile</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeesStatus === Status.Loading ? (
                            <tr>
                                <td className="text-center" colSpan={7}>
                                    Loading...
                                </td>
                            </tr>
                        ) : employeesStatus === Status.Success &&
                          employees.length > 0 ? (
                            employees.map((e, index) => {
                                const serialNumber =
                                    (currentPage - 1) * employeesPerPage +
                                    index +
                                    1;
                                return (
                                    <tr key={index}>
                                        <td>{serialNumber}</td>
                                        <td>{e.code.toUpperCase()}</td>
                                        <td>{e.name.toUpperCase()}</td>
                                        <td>
                                            {e.role && e.role.toUpperCase()}
                                        </td>
                                        <td>{e.mobile && e.mobile}</td>
                                        <td>
                                            {+e.active === 1 ? "YES" : "NO"}
                                        </td>
                                        <td>
                                            <Button
                                                variant="info"
                                                disabled={+e.active !== 1}
                                                onClick={() => editEmployee(e)}
                                            >
                                                EDIT
                                            </Button>
                                            &nbsp;
                                            <Button
                                                variant="danger"
                                                onClick={() =>
                                                    deactivateEmployee(e.id)
                                                }
                                            >
                                                {+e.active !== 1
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
            {employees.length > 0 && meta.last_page > 1 && (
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
