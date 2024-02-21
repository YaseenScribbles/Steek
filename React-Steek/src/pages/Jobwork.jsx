import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    FloatingLabel,
    Form,
    Button,
    Table,
    Spinner,
    Pagination,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getJobWorks } from "../store/JobWorkSlice";
import { Status, URL, HeadersWoToken } from "../assets/common";
import { useUserContext } from "../context/UserContext";
import { useErrorContext } from "../context/ErrorContext";

export default function Jobwork() {
    const dispatch = useDispatch();
    const {
        data: jobworks,
        status: jobWorksStatus,
        meta,
    } = useSelector((s) => s.jobworks);

    const [jobWork, setJobWork] = useState({
        code: "",
        description: "",
        price: "",
    });

    const { user } = useUserContext();
    const { setErrors } = useErrorContext();
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentpage] = useState(1);
    const [edit, setEdit] = useState(false);
    const [editId, setEditId] = useState(0);

    useEffect(() => {
        dispatch(getJobWorks({ token: user.token, currentPage: currentPage }));
    }, [currentPage]);

    useEffect(() => {
        setCurrentpage(1);
        dispatch(getJobWorks({ token: user.token }));
    }, []);

    async function addJobWork() {
        setLoading(true);

        const headers = {
            ...HeadersWoToken,
            Authorization: `Bearer ${user.token}`,
        };

        let options = {};
        let response = null;

        if (edit) {
            options = {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    ...jobWork,
                    user_id: user.id,
                }),
            };
            response = await fetch(
                `${URL}/jobwork/${editId}?_method=PUT`,
                options
            );
        } else {
            options = {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ ...jobWork, user_id: user.id }),
            };
            response = await fetch(`${URL}/jobwork`, options);
        }

        const data = await response.json();

        if (response.status !== 200) {
            setLoading(false);
            const errors = Object.values(data.errors).flatMap((e) => e);
            setErrors(errors);
        } else {
            setJobWork({
                code: "",
                description: "",
                price: "",
            });
            setEdit(false);
            setEditId(0);
            dispatch(getJobWorks({ token: user.token, currentPage }));
        }
        setLoading(false);
    }

    const editJobWork = (id) => {
        const jobWork = jobworks.find((w) => +w.id === +id);
        setJobWork({
            code: jobWork.code,
            description: jobWork.description,
            price: jobWork.price,
        });
        setEdit(true);
        setEditId(+id);
    };

    const deactivateJobWork = async (id) => {
        setLoading(true);

        const headers = {
            ...HeadersWoToken,
            Authorization: `Bearer ${user.token}`,
        };

        const options = {
            method: "DELETE",
            headers: headers,
        };

        const response = await fetch(`${URL}/jobwork/${id}`, options);

        if (response.ok) {
            dispatch(getJobWorks({ token: user.token, currentPage }));
        } else {
            const errors = Object.values(data.errors).flatMap((e) => e);
            setErrors(errors);
        }
        setLoading(false);
    };

    return (
        <Container>
            {loading && (
                <div className="text-center">
                    <Spinner variant="secondary" animation="grow" />
                </div>
            )}
            <h3 className="text-center h1 mt-3">Jobwork</h3>
            <hr />
            <Row className="mb-3">
                <Col xs={"2"}>
                    <FloatingLabel
                        className="text-secondary"
                        controlId="code"
                        label="Code"
                    >
                        <Form.Control
                            placeholder="****"
                            type="text"
                            value={jobWork.code}
                            onChange={(e) =>
                                setJobWork({ ...jobWork, code: e.target.value })
                            }
                            autoFocus
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={"6"}>
                    <FloatingLabel
                        className="text-secondary"
                        controlId="desc"
                        label="Description"
                    >
                        <Form.Control
                            type="text"
                            placeholder="***"
                            value={jobWork.description}
                            onChange={(e) =>
                                setJobWork({
                                    ...jobWork,
                                    description: e.target.value,
                                })
                            }
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={"2"}>
                    <FloatingLabel
                        className="text-secondary"
                        controlId="price"
                        label="Price"
                    >
                        <Form.Control
                            type="text"
                            placeholder="****"
                            value={jobWork.price}
                            onChange={(e) =>
                                setJobWork({
                                    ...jobWork,
                                    price: e.target.value,
                                })
                            }
                        />
                    </FloatingLabel>
                </Col>
                <Col xs="2">
                    <Button
                        className="h-100 w-50"
                        variant="secondary"
                        onClick={addJobWork}
                    >
                        {edit ? "UPDATE" : "ADD"}
                    </Button>
                </Col>
            </Row>
            <hr />
            <Row>
                <h3 className="h1 text-center">List</h3>
            </Row>
            <hr />
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Active</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {jobworks && jobworks.length > 0 ? (
                        jobworks.map((w, index) => {
                            const serialNumber =
                                (currentPage - 1) * 8 + index + 1;
                            return jobWorksStatus === Status.Loading ? (
                                <tr key={index}>
                                    <td colSpan={6} className="text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                <tr key={index}>
                                    <td>{serialNumber}</td>
                                    <td>{w.code.toUpperCase()}</td>
                                    <td>{w.description.toUpperCase()}</td>
                                    <td>{(+w.price).toFixed(2)}</td>
                                    <td>{+w.active === 1 ? "YES" : "NO"}</td>
                                    <td>
                                        <Button
                                            variant="info"
                                            onClick={() => editJobWork(w.id)}
                                        >
                                            EDIT
                                        </Button>
                                        &nbsp;
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                deactivateJobWork(w.id);
                                            }}
                                            disabled = {+w.active !== 1}
                                        >
                                            DELETE
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center">
                                {jobWorksStatus === Status.Loading
                                    ? "Loading..."
                                    : "No Data"}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Container className="d-flex justify-content-end">
                <Pagination>
                    <Pagination.Prev
                        onClick={() =>
                            setCurrentpage((prevPage) =>
                                Math.max(prevPage - 1, 1)
                            )
                        }
                        disabled={currentPage === 1}
                    />
                    {Array.from(
                        { length: meta.last_page ? meta.last_page : 1 },
                        (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => {
                                    setCurrentpage(index + 1);
                                }}
                            >
                                {index + 1}
                            </Pagination.Item>
                        )
                    )}
                    <Pagination.Next
                        onClick={() =>
                            setCurrentpage((prevPage) =>
                                Math.max(prevPage + 1, meta.last_page)
                            )
                        }
                        disabled={currentPage === meta.last_page}
                    />
                </Pagination>
            </Container>
        </Container>
    );
}
