import React from "react";
// import "./insidequotationbox.scss";
import { GrFormNextLink } from "react-icons/gr";

const InsideDebitNotebox = ({ selectedDebitNote }) => {
  return (
    <>
      <div id="boxofquoationsinsdl">

        <div id="pdfformattedbox">
          <div id={selectedDebitNote?.is_approved == 1 ? "approveds545s5" : "drafts545s5"}>
            <p>{selectedDebitNote?.is_approved == 1 ? "Approved" : "Draft"}</p>
          </div>

          <div className="randomheightagain40"></div>
          <div className="randomheightagain40"></div>
          <div className="randomheightagain40"></div>
          <div id="belowboxxlks">
            <div id="belowboxslx1">
              <h1>Credit Note</h1>
              <p>Credit Note Number: {selectedDebitNote?.credit_note_id}</p>
            </div>

            <div id="belowboxslx2">
              <b>Demo Books Organization</b>
              <p>Andaman and Nicobar Islands India</p>
            </div>
          </div>
          <div id="nextfloxlw93">
            <div id="lksdjklfsd58xs3">
              <b>Transaction Date: {selectedDebitNote?.transaction_date}</b>
            </div>
            <div id="xl56s6d66">
              <b>Customer Details:</b>
              <p>Customer Name: {selectedDebitNote?.customer_name}</p>
              <b>view more<GrFormNextLink /></b>
            </div>
          </div>
          <div id="newtableforquoationsxlso">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Item Name</th>
                  <th className="stylerightfloat">Quantity</th>
                  <th className="stylerightfloat">Price</th>
                  <th className="stylerightfloat" >Amount</th>
                  {/* Add more table headers as needed */}
                </tr>
              </thead>
              <tbody>
                {selectedDebitNote?.items?.map((item, index) => (
                  <tr key={item?.id}>
                    <td>{index + 1}</td>
                    <td>{item?.item?.name}</td> {/* Assuming item has a nested object 'item' */}
                    <td className="stylerightfloat">{item?.quantity}</td>
                    <td className="stylerightfloat">{item?.item?.price}/-</td>

                    <td className="stylerightfloat" >{item?.gross_amount}/-</td>
                    {/* Add more table cells for additional item details */}
                  </tr>
                ))}
              </tbody>
            </table>

            <div id="totalcalculateionsxls">
              <p>Sub total: </p>
              <p>{parseFloat(selectedDebitNote?.subtotal).toFixed(2)}/-</p>
            </div>
            <div id="totalcalculateionsxls">
              <p>Shipping Charge: </p>
              <p>+ {parseFloat(selectedDebitNote?.shipping_charge).toFixed(2)}/-</p>
            </div>
            <div id="totalcalculateionsxls">
              <p>Adjustment Charge: </p>
              <p>+ {parseFloat(selectedDebitNote?.adjustment_charge).toFixed(2)}/-</p>
            </div>
            <div id="totalcalculateionsxls" className="finaltotalxls5">
              <p>Total: </p>
              <p>{parseFloat(selectedDebitNote?.total).toFixed(2)}/-</p>
            </div>
          </div>
          <div id="ndwslxo265s465a">
            <p> Customer Note: {selectedDebitNote?.customer_note}</p>
            <p> Terms: {selectedDebitNote?.terms}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InsideDebitNotebox;
