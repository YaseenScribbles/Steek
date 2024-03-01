import { Button, FloatingLabel, Form, Modal, Row,Col } from "react-bootstrap";
import { useBillContext } from "../context/BillContext";

export default function CustomerModal({ show, closeCustomerModal }) {
    const { customerInfo, setCustomerInfo } = useBillContext();

    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            centered
            onHide={closeCustomerModal}
            size="sm"
        >
            <Modal.Header closeButton>Customer</Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    <Col>
                        <FloatingLabel
                            controlId="name"
                            label="Name"
                            className="text-secondary"
                        >
                            <Form.Control
                                type="text"
                                placeholder="***"
                                value={
                                    customerInfo.name ? customerInfo.name : ""
                                }
                                onChange={(e) =>
                                    setCustomerInfo({
                                        ...customerInfo,
                                        name: e.target.value,
                                    })
                                }
                                autoFocus
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FloatingLabel
                            controlId="mobile"
                            label="Mobile"
                            className="text-secondary"
                        >
                            <Form.Control
                                type="text"
                                placeholder="***"
                                value={
                                    customerInfo.mobile
                                        ? customerInfo.mobile
                                        : ""
                                }
                                onChange={(e) =>
                                    setCustomerInfo({
                                        ...customerInfo,
                                        mobile: e.target.value,
                                    })
                                }
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeCustomerModal}>Update</Button>
            </Modal.Footer>
        </Modal>
    );
}
