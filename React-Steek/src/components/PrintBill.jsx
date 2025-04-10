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
    const day = String(dateTime.getDate()).padStart(2, "0");
    let hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");

    let ampm = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;

    return (
        <Container className="p-0 mt-0">
            <h2 className="text-center">TAQUA SILKS</h2>
            <p className="text-center mb-1">NO.23, Municipal Office Road,</p>
            <p className="text-center mb-1">Tirupur - 641604</p>
            <p className="text-center">Phone : 0421- 22 42 777</p>
            <h3 className="text-center">Invoice</h3>
            <hr />
            <Row className="text-center mb-1">
                <Col xs={2} className="text-start">
                    Bill No
                </Col>
                <Col xs={1} className="text-start">
                    :
                </Col>
                <Col xs={4} className="text-end pe-5">
                    {billMaster.bill_no}
                </Col>
                <Col xs={2} className="text-start">
                    Customer
                </Col>
                <Col xs={1} className="text-start">
                    :
                </Col>
                <Col xs={2} className="text-end">
                    {customerInfo.name}
                </Col>
            </Row>
            <Row className="text-center">
                <Col xs={2} className="text-start">
                    Bill Date
                </Col>
                <Col xs={1} className="text-start">
                    :
                </Col>
                <Col xs={4} className="text-end pe-5">
                    {formattedDateTime}
                </Col>
                <Col xs={2} className="text-start">
                    Mobile
                </Col>
                <Col xs={1} className="text-start">
                    :
                </Col>
                <Col xs={2} className="text-end">
                    {customerInfo.mobile}
                </Col>
            </Row>
            <hr />
            <Table bordered className="text-center">
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
                                <td>{(+b.rate).toFixed(2)}</td>
                                <td>{(+b.amount).toFixed(2)}</td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <th colSpan={2} className="text-center">
                            Total
                        </th>
                        <th>{totalInfo.totalQty}</th>
                        <th></th>
                        <th>{totalInfo.totalAmount}</th>
                    </tr>
                </tfoot>
            </Table>
            <hr />
            {+setttlementInfo.cash !== 0 && (
                <Row className="text-center">
                    <Col xs={5} className="text-end">
                        CASH
                    </Col>
                    <Col xs={1} className="text-end">
                        :
                    </Col>
                    <Col xs={6} className="text-start">
                        {(+setttlementInfo.cash).toFixed(2)}
                    </Col>
                </Row>
            )}
            {+setttlementInfo.card !== 0 && (
                <Row className="text-center">
                    <Col xs={5} className="text-end">
                        CARD
                    </Col>
                    <Col xs={1} className="text-end">
                        :
                    </Col>
                    <Col xs={6} className="text-start">
                        {(+setttlementInfo.card).toFixed(2)}
                    </Col>
                </Row>
            )}
            {+setttlementInfo.upi !== 0 && (
                <Row className="text-center">
                    <Col xs={5} className="text-end">
                        UPI
                    </Col>
                    <Col xs={1} className="text-end">
                        :
                    </Col>
                    <Col xs={6} className="text-start">
                        {(+setttlementInfo.upi).toFixed(2)}
                    </Col>
                </Row>
            )}
            {+returnAmt !== 0 && (
                <Row className="text-center">
                    <Col xs={5} className="text-end">
                        RETURN
                    </Col>
                    <Col xs={1} className="text-end">
                        :
                    </Col>
                    <Col xs={6} className="text-start">
                        {(+returnAmt).toFixed(2)}
                    </Col>
                </Row>
            )}
            <h4 className="text-center mt-3"> Thank You !!!</h4>
        </Container>
    );
}
