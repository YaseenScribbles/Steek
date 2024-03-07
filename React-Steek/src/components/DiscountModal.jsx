import { FloatingLabel, Modal, Row, Col, Form, Button } from "react-bootstrap";
import { useBillContext } from "../context/BillContext";
import { useDispatch } from "react-redux";
import { updateDisc } from "../store/ScannedSlice";

export default function DiscountModal({ show, closeDiscModal }) {
    const { discountInfo, setDiscountInfo, totalInfo } = useBillContext();
    const dispatch = useDispatch();

    const updateDiscValue = (totalValue, discPerc) => {
        const discValue = totalValue * (discPerc / 100);
        setDiscountInfo({
            discPerc: +discPerc || 0,
            discValue: +discValue || 0,
        });
    };

    const updateDiscPerc = (totalValue, discValue) => {
        const discPerc = (discValue / totalValue) * 100;
        setDiscountInfo({
            discPerc: +discPerc || 0,
            discValue: +discValue || 0,
        });
    };

    return (
        <Modal
            centered
            backdrop="static"
            keyboard={false}
            size="sm"
            onHide={closeDiscModal}
            show={show}
        >
            <Modal.Header closeButton>
                <Modal.Title>Discount</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={5}>
                        <FloatingLabel
                            controlId="DiscInPerc"
                            label="Disc in %"
                            className="text-secondary"
                        >
                            <Form.Control
                                type="text"
                                placeholder="***"
                                value={
                                    discountInfo.discPerc == 0
                                        ? ""
                                        : discountInfo.discPerc
                                }
                                onChange={(e) => {
                                    updateDiscValue(
                                        totalInfo.grossAmount,
                                        +e.target.value
                                    );
                                }}
                                autoFocus
                            />
                        </FloatingLabel>
                    </Col>
                    <Col xs={7}>
                        <FloatingLabel
                            controlId="DiscInValue"
                            label="Disc in value"
                            className="text-secondary"
                        >
                            <Form.Control
                                type="text"
                                placeholder="***"
                                value={
                                    discountInfo.discValue == 0
                                        ? ""
                                        : discountInfo.discValue
                                }
                                onChange={(e) =>
                                    updateDiscPerc(
                                        totalInfo.grossAmount,
                                        +e.target.value
                                    )
                                }
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        dispatch(updateDisc(discountInfo.discPerc));
                        closeDiscModal();
                    }}
                >
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
