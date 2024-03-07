import { useState } from "react";
import { Button, FloatingLabel, Form, Modal, Row, Col } from "react-bootstrap";
import { useErrorContext } from "../context/ErrorContext";
import { useDispatch } from "react-redux";
import { updateEmployeeByBarcode } from "../store/ScannedSlice";
import { useSelector } from "react-redux";

export default function ({ show, closeEmpModal, code }) {
    const [empCode, setEmpCode] = useState("");
    const { setErrors } = useErrorContext();
    const dispatch = useDispatch();

    const { data: employees } = useSelector(
        (s) => s.employees
    );

    return (
        <Modal
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
            onHide={closeEmpModal}
            show={show}
        >
            <Modal.Header closeButton>
                <Modal.Title>Update Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <FloatingLabel
                            controlId="employee"
                            label="Enter Employee Code"
                            className="text-center"
                        >
                            <Form.Control
                                type="text"
                                placeholder="***"
                                value={empCode}
                                onChange={(e) => setEmpCode(e.target.value)}
                                autoFocus
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        if (empCode === "") {
                            setErrors(["Please enter employee code"]);
                            return;
                        }
                        if (empCode.slice(0, 1) === ".") {
                            setErrors(["Do not add . at start"]);
                            return;
                        }

                        if (employees.findIndex((e) => e.code === empCode) === -1){
                            setErrors(["Employee not found"]);
                            return;
                        }

                        dispatch(
                            updateEmployeeByBarcode({
                                empCode: empCode,
                                jobWorkCode: code,
                            })
                        );
                        setEmpCode("");
                        closeEmpModal();
                    }}
                >
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
