import {
    Button,
    Col,
    FloatingLabel,
    Form,
    FormLabel,
    Modal,
    Row,
} from "react-bootstrap";
import { useBillContext } from "../context/BillContext";
import { useErrorContext } from "../context/ErrorContext";
import { useEffect, useState } from "react";

export default function SettlementModal({
    show,
    closeSettlementModal,
    saveBill,
}) {
    const { settlementInfo, setSettlementInfo, totalInfo } = useBillContext();
    const { setErrors } = useErrorContext();
    const [returnAmount, setReturnAmount] = useState(0);

    useEffect(() => {
        const { cash, card, upi } = settlementInfo;
        let returnAmt = cash + card + upi - Math.round(totalInfo.totalAmount);
        setReturnAmount(returnAmt);
    }, [settlementInfo]);

    const updateSettlement = (type, value) => {
        const { card, upi } = settlementInfo;
        let adjustedValue = 0;
        if (type === "card" || type === "upi") {
            if (type === "card") {
                adjustedValue = value - card;
            } else {
                adjustedValue = value - upi;
            }
            if (card + upi + adjustedValue > totalInfo.totalAmount) {
                setErrors(["card and upi must not exceed required amount"]);
                return;
            }
        }

        setSettlementInfo({
            ...settlementInfo,
            [type]: value || 0,
        });
    };

    return (
        <Modal
            show={show}
            centered
            backdrop="static"
            keyboard={false}
            onHide={closeSettlementModal}
            size="sm"
        >
            <Modal.Header closeButton>
                <Modal.Title>Settlement ({Math.round(totalInfo.totalAmount)})</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    <Col>
                        <FloatingLabel
                            controlId="cash"
                            label="CASH"
                            className="text-secondary"
                        >
                            <Form.Control
                                type="text"
                                placeholder="***"
                                value={
                                    settlementInfo.cash === 0
                                        ? ""
                                        : settlementInfo.cash
                                }
                                onChange={(e) =>
                                    updateSettlement("cash", +e.target.value)
                                }
                                autoFocus
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <FloatingLabel
                            controlId="card"
                            label="CARD"
                            className="text-secondary"
                        >
                            <Form.Control
                                type="text"
                                placeholder="***"
                                value={
                                    settlementInfo.card === 0
                                        ? ""
                                        : settlementInfo.card
                                }
                                onChange={(e) =>
                                    updateSettlement("card", +e.target.value)
                                }
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <FloatingLabel
                            controlId="upi"
                            label="UPI"
                            className="text-secondary"
                        >
                            <Form.Control
                                type="text"
                                placeholder="***"
                                value={
                                    settlementInfo.upi === 0
                                        ? ""
                                        : settlementInfo.upi
                                }
                                onChange={(e) =>
                                    updateSettlement("upi", +e.target.value)
                                }
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormLabel className="h4 ms-1">
                            Return :
                            <span className="text-danger ms-2 mt-2">
                                {returnAmount > 0 ? returnAmount : ""}
                            </span>
                        </FormLabel>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        saveBill(returnAmount);
                        closeSettlementModal();
                    }}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
