import { Col, Container, Row, Table } from "react-bootstrap";

export default function PrintBill({
    billMaster,
    billDetail,
    totalInfo,
    customerInfo,
    setttlementInfo,
    returnAmt,
}) {
    const dateTime = new Date(billMaster.created_at);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate() + 1).padStart(2, "0");
    let hours = String(dateTime.getHours() + 1).padStart(2, "0");
    const minutes = String(dateTime.getMinutes() + 1).padStart(2, "0");

    let ampm = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;

    return (
        <Container fluid className="p-0 mt-0">
            <h2 className="text-center">Invoice</h2>
            <hr />
            <Row>
                <Col xs={5} className="text-start">
                    Bill No
                </Col>
                <Col xs={1} className="text-end">
                    :
                </Col>
                <Col xs={6} className="text-end">
                    {billMaster.bill_no}
                </Col>
            </Row>
            <Row>
                <Col xs={5} className="text-start">
                    Bill Date
                </Col>
                <Col xs={1} className="text-end">
                    :
                </Col>
                <Col xs={6} className="text-end">
                    {formattedDateTime}
                </Col>
            </Row>
            <Row>
                <Col xs={5} className="text-start">
                    Customer
                </Col>
                <Col xs={1} className="text-end">
                    :
                </Col>
                <Col xs={6} className="text-end">
                    {customerInfo.name}
                </Col>
            </Row>
            <Row>
                <Col xs={5} className="text-start">
                    Mobile
                </Col>
                <Col xs={1} className="text-end">
                    :
                </Col>
                <Col xs={6} className="text-end">
                    {customerInfo.mobile}
                </Col>
            </Row>
            <hr />
            <Table borderless className="w-100">
                <thead>
                    <tr>
                        <th>S No</th>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {billDetail.map((b, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{b.description.toUpperCase()}</td>
                                <td>{b.qty}</td>
                                <td>{b.rate}</td>
                                <td>{b.amount}</td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <th colSpan={2} className="text-center">Total</th>
                        <th>
                            <h6>{totalInfo.totalQty}</h6>
                        </th>
                        <th></th>
                        <th>
                            <h6>{totalInfo.totalAmount}</h6>
                        </th>
                    </tr>
                </tfoot>
            </Table>
            <hr />
            {setttlementInfo.cash !== 0 && (
                <Row className="text-center">
                    <Col xs={5} className="text-end">
                        CASH
                    </Col>
                    <Col xs={1} className="text-end">
                        :
                    </Col>
                    <Col xs={6} className="text-start">
                        {setttlementInfo.cash}
                    </Col>
                </Row>
            )}
            {setttlementInfo.card !== 0 && (
                <Row className="text-center">
                    <Col xs={5} className="text-end">
                        CARD
                    </Col>
                    <Col xs={1} className="text-end">
                        :
                    </Col>
                    <Col xs={6} className="text-start">
                        {setttlementInfo.card}
                    </Col>
                </Row>
            )}
            {setttlementInfo.upi !== 0 && (
                <Row className="text-center">
                    <Col xs={5} className="text-end">
                        UPI
                    </Col>
                    <Col xs={1} className="text-end">
                        :
                    </Col>
                    <Col xs={6} className="text-start">
                        {setttlementInfo.upi}
                    </Col>
                </Row>
            )}
            {returnAmt !== 0 && (
                <Row className="text-center">
                    <Col xs={5} className="text-end">
                        RETURN
                    </Col>
                    <Col xs={1} className="text-end">
                        :
                    </Col>
                    <Col xs={6} className="text-start">
                        {returnAmt}
                    </Col>
                </Row>
            )}
            <h4 className="text-center mt-3"> Thank You !!!</h4>
        </Container>
    );
}
