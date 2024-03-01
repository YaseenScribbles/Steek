import { useState } from "react";
import { FloatingLabel, Modal, Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { updateQty } from "../store/ScannedSlice";
import { useErrorContext } from "../context/ErrorContext";

export default function QtyModal({ show, closeQtyModal, code }) {
    const [qty, setQty] = useState(0);
    const dispatch = useDispatch();
    const { setErrors } = useErrorContext();
    return (
        <Modal
            show={show}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={closeQtyModal}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Update Qty
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <FloatingLabel
                            controlId="qty"
                            label="Enter Qty"
                            className="text-secondary"
                        >
                            <Form.Control
                                type="text"
                                placeholder="***"
                                value={qty === 0 ? "" : qty}
                                onChange={(e) => setQty(+e.target.value)}
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
                        if (qty === 0) {
                            setErrors(["Qty cannot be zero"]);
                            return;
                        }
                        dispatch(
                            updateQty({
                                code: code,
                                qty: qty,
                            })
                        );
                        setQty(0);
                        closeQtyModal();
                    }}
                >
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
