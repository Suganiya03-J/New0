import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import InvoiceItem from "./reusable/InvoiceItem";
import InvoiceModal from "./reusable/invoiceModal";

export default function InvoiceForm() {
  const [invoiceData, setInvoiceData] = useState({
    isOpen: false,
    currency: "₹",
    currentDate: "",
    invoiceNumber: 12345678,
    billTo: "",
    billToPhone: "",
    billToAddress: "",
    billToEmail: "",
    billFrom: "Altech IT Hub",
    billFromEmail: "altechithub@gmail.com",
    billFromAddress: "Colombo, Sri Lanka",
    billFromPhone: "0219578341",
    notes: "",
    subTotal: "0.00",
    taxRate: 0,
    taxAmount: "0.00",
    discountRate: 0,
    discountAmount: "0.00",
    billToBillingId: "",
    billToAccountId: "",
  });

  const [total, setTotal] = useState(0.0);
  const [invoiceItems, setInvoiceItems] = useState([
    {
      id: "0",
      name: "",
      description: "",
      price: 1.0,
      quantity: 1,
    },
  ]);

  const onChange = (event) => {
    setInvoiceData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onCurrencyChange = (event) => {
    setInvoiceData((prev) => ({
      ...prev,
      currency: event.target.value,
    }));
  };

  const onItemizedItemEdit = (event) => {
    const { id, name, value } = event.target;
    const updatedItems = invoiceItems.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setInvoiceItems(updatedItems);
  };

  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id,
      name: "",
      description: "",
      price: 1.0,
      quantity: 1,
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const handleRowDel = (item) => {
    if (invoiceItems.length > 1) {
      const updatedItems = invoiceItems.filter((i) => i.id !== item.id);
      setInvoiceItems(updatedItems);
    } else {
      setInvoiceItems([
        {
          id: "0",
          name: "",
          description: "",
          price: 1.0,
          quantity: 1,
        },
      ]);
    }
  };

  useEffect(() => {
    const subtotal = invoiceItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + price * quantity;
    }, 0);

    const taxAmount = subtotal * (invoiceData.taxRate / 100);
    const discountAmount = subtotal * (invoiceData.discountRate / 100);
    const total = subtotal + taxAmount - discountAmount;

    setInvoiceData((prev) => ({
      ...prev,
      subTotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
    }));

    setTotal(total.toFixed(2));
  }, [invoiceItems, invoiceData.taxRate, invoiceData.discountRate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setInvoiceData((prev) => ({ ...prev, isOpen: true }));
  };

  const closeModal = () => {
    setInvoiceData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mt-3">
        <Col md={8} lg={9}>
          <Card className="d-flex flex p-4 p-xl-5 mb-3">
            {/* Logo and Invoice Header */}
            <div className="d-flex flex-row align-items-center justify-content-between mb-4">
              <img src="/logo.png" alt="Company Logo" style={{ height: "80px" }} />
              <div className="text-end">
                <div>
                  <span className="fw-bold">Current Date:&nbsp;</span>
                  <span className="current-date">{new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="fw-bold">Invoice Number:&nbsp;</span>
                  <span className="invoice-number">{invoiceData.invoiceNumber}</span>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            {/* Customer Details */}
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Customer Details:</Form.Label>
                <Form.Control
                  placeholder="Enter Name"
                  value={invoiceData.billTo}
                  type="text"
                  name="billTo"
                  className="my-2"
                  onChange={onChange}
                  required
                />
                <Form.Control
                  placeholder="Enter Email"
                  value={invoiceData.billToEmail}
                  type="email"
                  name="billToEmail"
                  className="my-2"
                  onChange={onChange}
                />
                <Form.Control
                  placeholder="Enter Address"
                  value={invoiceData.billToAddress}
                  type="text"
                  name="billToAddress"
                  className="my-2"
                  onChange={onChange}
                  required
                />
                <Form.Control
                  placeholder="Enter Phone Number"
                  value={invoiceData.billToPhone}
                  type="text"
                  name="billToPhone"
                  className="my-2"
                  onChange={onChange}
                />
              </Col>
            </Row>

            {/* Invoice Details */}
            <hr />

            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Invoice Details:</Form.Label>
                <Form.Control
                  placeholder="Enter Billing ID"
                  value={invoiceData.billToBillingId}
                  type="text"
                  name="billToBillingId"
                  className="my-2"
                  onChange={onChange}
                />
                <Form.Control
                  placeholder="Enter Account ID"
                  value={invoiceData.billToAccountId}
                  type="text"
                  name="billToAccountId"
                  className="my-2"
                  onChange={onChange}
                />
              </Col>
            </Row>

            {/* Items Table */}
            <InvoiceItem
              items={invoiceItems}
              onItemizedItemEdit={onItemizedItemEdit}
              onRowAdd={handleAddEvent}
              onRowDel={handleRowDel}
              currency={invoiceData.currency}
            />

            {/* Totals */}
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>
                    {invoiceData.currency} {invoiceData.subTotal}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    {invoiceData.discountRate}% {invoiceData.currency}
                    {invoiceData.discountAmount}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    {invoiceData.taxRate}% {invoiceData.currency}
                    {invoiceData.taxAmount}
                  </span>
                </div>
                <hr />
                <div className="d-flex flex-row align-items-start justify-content-between fs-5">
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">
                    {invoiceData.currency} {total}
                  </span>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Sidebar Controls */}
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4 mb-3">
            <Button
              variant="primary"
              type="submit"
              className="d-block w-100 mb-4"
            >
              Review Invoice
            </Button>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                value={invoiceData.currency}
                onChange={onCurrencyChange}
                className="btn btn-light"
              >
                <option value="$">USD</option>
                <option value="Rs">LKR</option>
                <option value="₹">INR</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tax Rate:</Form.Label>
              <InputGroup>
                <Form.Control
                  name="taxRate"
                  type="number"
                  value={invoiceData.taxRate}
                  onChange={onChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  max="100"
                />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Discount Rate:</Form.Label>
              <InputGroup>
                <Form.Control
                  name="discountRate"
                  type="number"
                  value={invoiceData.discountRate}
                  onChange={onChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  max="100"
                />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
        </Col>
      </Row>

      {/* Modal Preview */}
      <InvoiceModal
        showModal={invoiceData.isOpen}
        closeModal={closeModal}
        info={invoiceData}
        items={invoiceItems}
        total={total}
        currency={invoiceData.currency}
        subTotal={invoiceData.subTotal}
        taxAmount={invoiceData.taxAmount}
        discountAmount={invoiceData.discountAmount}
      />
    </Form>
  );
}
