import React from "react";
import { Row, Col, Modal, Table, Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/logo.png"; 

export default function InvoiceModal(props) {
  const {
    showModal,
    closeModal,
    info,
    total,
    currency,
    items,
    subTotal,
    taxAmount,
    discountAmount,
  } = props;

  const generateInvoice = () => {
    html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [612, 792],
      });

      pdf.internal.scaleFactor = 1;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
  };

  return (
    <Modal show={showModal} onHide={closeModal} size="lg" centered>
      <div id="invoiceCapture">
        <div className="d-flex justify-content-between align-items-center p-3">
          <div>
            <img src={logo} alt="Company Logo" style={{ height: "80px" }} />
          </div>
          <div className="text-end">
            <h4 className="fw-bold m-0">Invoice</h4>
            <h6 className="fw-bold text-secondary mb-1">
              Invoice #: {info.invoiceNumber || "12345678"}
            </h6>
          </div>
        </div>

        <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-3">
          <div className="w-100">
            <p className="text-muted m-0">{info.billFrom}</p>
            <p className="text-muted m-0">{info.billFromAddress}</p>
            <p className="text-muted m-0">{info.billFromEmail}</p>
            <p className="text-muted m-0">Phone: {info.billFromPhone}</p>
          </div>

          <div className="text-end ms-4">
            <h6 className="fw-bold mt-1 mb-2">Amount Due:</h6>
            <h5 className="fw-bold text-secondary">
              {currency} {total}
            </h5>
          </div>
        </div>

        <div className="p-4">
          <Row className="mb-4">
            <Col md={6}>
              <div className="fw-bold">Billed To:</div>
              <div>{info.billTo}</div>
              <div>{info.billToAddress}</div>
              <div>{info.billToEmail}</div>
              <div>{info.billToPhone}</div>
            </Col>

            <Col md={6}>
              <div className="fw-bold">Invoice Details:</div>
              <div>Invoice Number: {info.invoiceNumber}</div>
              <div>Date Of Issue: {new Date().toLocaleDateString()}</div>
              <div>Billing ID: {info.billToBillingId || "N/A"}</div>
              <div>Account ID: {info.billToAccountId || "N/A"}</div>
            </Col>
          </Row>

          <Table className="mb-0">
            <thead>
              <tr>
                <th>QTY</th>
                <th>DESCRIPTION</th>
                <th className="text-end">PRICE</th>
                <th className="text-end">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td>{item.quantity}</td>
                  <td>
                    {item.name} - {item.description}
                  </td>
                  <td className="text-end">
                    {currency} {item.price}
                  </td>
                  <td className="text-end">
                    {currency} {item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Table>
            <tbody>
              <tr className="text-end">
                <td></td>
                <td className="fw-bold">SUBTOTAL</td>
                <td className="text-end">
                  {currency} {subTotal}
                </td>
              </tr>
              <tr className="text-end">
                <td></td>
                <td className="fw-bold">TAX</td>
                <td className="text-end">
                  {currency} {taxAmount}
                </td>
              </tr>
              {discountAmount !== "0.00" && (
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold">DISCOUNT</td>
                  <td className="text-end">
                    {currency} {discountAmount}
                  </td>
                </tr>
              )}
              <tr className="text-end">
                <td></td>
                <td className="fw-bold">TOTAL</td>
                <td className="text-end">
                  {currency} {total}
                </td>
              </tr>
            </tbody>
          </Table>

          {info.notes && (
            <div className="bg-light py-3 px-4 rounded mt-3">
              <strong>Notes:</strong>
              <div>{info.notes}</div>
            </div>
          )}
        </div>
      </div>

      <div className="pb-4 px-4">
        <Button
          variant="primary"
          className="d-block w-100 mt-3 mt-md-0"
          onClick={generateInvoice}
        >
          Download
        </Button>
      </div>
    </Modal>
  );
}
