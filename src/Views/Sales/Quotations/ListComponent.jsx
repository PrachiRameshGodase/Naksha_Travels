import React from 'react'
import { formatDate, formatDate2, formatDate3, todayDate } from '../../Helper/DateFormat'
import { getDateStatus, getDateStatus1, showAmountWithCurrencySymbol } from '../../Helper/HelperFunctions';
import { ShowStatusInList, ShowStatusInList1 } from '../../Helper/ComponentHelper/ShowStatus';
import { IoMailOpenOutline } from "react-icons/io5";


const ListComponent = ({ quotation, selectedRows, handleCheckboxChange, handleRowClicked, section, approval }) => {

    return (
        <>

            <div
                className={`table-rowx12 ${selectedRows.includes(quotation.id)
                    ? "selectedresult"
                    : ""
                    }`}
            >
                <div
                    className="table-cellx12 checkboxfx1"
                    id="styl_for_check_box"
                >
                    <input
                        checked={selectedRows.includes(quotation.id)}
                        type="checkbox"
                        onChange={() => handleCheckboxChange(quotation.id)}
                    />
                    <div className="checkmark"></div>
                </div>
                <div
                    onClick={() => handleRowClicked(quotation)}
                    className="table-cellx12 quotiosalinvlisxs1"
                >
                    {quotation.created_at
                        ? formatDate3(quotation.created_at)
                        : ""}
                </div>

                <div
                    onClick={() => handleRowClicked(quotation)}
                    className="table-cellx12 quotiosalinvlisxs2"
                >
                    {section === "invoice" ? quotation.invoice_id : section === "quotation" ? quotation?.quotation_id : quotation.sale_order_id || ""}
                    <span className='sent_mailx121'> {section === "invoice" && quotation?.is_mail_sent === "1" && <IoMailOpenOutline />}</span>
                </div>

                <div
                    onClick={() => handleRowClicked(quotation)}
                    className="table-cellx12 quotiosalinvlisxs3"
                >
                    {quotation?.display_name === "0" ? "" : quotation?.display_name || ""}
                </div>
                <div
                    onClick={() => handleRowClicked(quotation)}
                    className="table-cellx12 quotiosalinvlisxs4"
                >
                    {quotation.reference_no == 0 ? "" : quotation.reference_no || ""}
                </div>
                <div
                    onClick={() => handleRowClicked(quotation)}
                    className="table-cellx12 quotiosalinvlisxs5_item"
                >
                    <p>  {showAmountWithCurrencySymbol(quotation?.total)}</p>
                </div>
                <div
                    onClick={() => handleRowClicked(quotation)}
                    className="table-cellx12 quotiosalinvlisxs6 sdjklfsd565 s25x85werse5d4rfsd"
                >
                    {approval === "invoice_approval" ? <p className='pending'> Pending</p> : <>
                        {quotation?.invoice_id ? <ShowStatusInList1 quotation={quotation} /> : <ShowStatusInList quotation={quotation} />}
                    </>}
                </div>

            </div>

        </>

    )
}

export default ListComponent;

export const ListComponent2 = ({ quotation, selectedRows, handleCheckboxChange, handleRowClicked, section }) => {

    return (
        <div
            className={`table-rowx12 ${selectedRows.includes(quotation.id)
                ? "selectedresult"
                : ""
                }`}

        >
            <div
                className="table-cellx12 checkboxfx1"
                id="styl_for_check_box"
            >
                <input
                    checked={selectedRows.includes(quotation.id)}
                    type="checkbox"
                    onChange={() => handleCheckboxChange(quotation.id)}
                />
                <div className="checkmark"></div>
            </div>
            <div
                onClick={() => handleRowClicked(quotation)}
                className="table-cellx12 quotiosalinvlisxs1"
            >
                {quotation.created_at
                    ? formatDate3(quotation.created_at)
                    : ""}
            </div>

            <div
                onClick={() => handleRowClicked(quotation)}
                className="table-cellx12 quotiosalinvlisxs2"
            >
                {section === "debit" ? <> {quotation.debit_note_id || ""}</> : <> {quotation.credit_note_id || ""}</>}
            </div>
            <div
                onClick={() => handleRowClicked(quotation)}
                className="table-cellx12 quotiosalinvlisxs3"
            >

                {section === "debit" ? <> {quotation?.display_name==="0"?"":quotation?.display_name || ""}</> : <>  {quotation?.customer?.display_name || ""}</>}
            </div>
            <div
                onClick={() => handleRowClicked(quotation)}
                className="table-cellx12 quotiosalinvlisxs4"
            >

                {section === "debit" ? <> {quotation.bill?.bill_no || ""}</> : <> {quotation.invoice?.invoice_id || ""}</>}

            </div>
            <div
                onClick={() => handleRowClicked(quotation)}
                className="table-cellx12 quotiosalinvlisxs5_item"
            >
                <p style={{ width: "37%" }}>  {showAmountWithCurrencySymbol(quotation?.total)}</p>
            </div>

            <div
                onClick={() => handleRowClicked(quotation)}
                className="table-cellx12 quotiosalinvlisxs6 sdjklfsd565"
            >
                <p className={quotation?.status === "1" ? "approved" : quotation?.status === "2" ? "declined" : quotation?.status == "3" ? "sent" : quotation?.status === "0" ? "draft" : "declined"} >

                    {quotation?.status === "1" ? "Approved" : quotation?.status === "2" ? "Rejected" : quotation?.status == "3" ? "Sent" : quotation?.status == "0" ? "Draft" : quotation?.status == "4" ? "Expired" : ""
                    }
                </p>
            </div>
        </div>
    )
}

export const ListComponent3 = ({ quotation, selectedRows, handleCheckboxChange, handleRowClicked, value }) => {
    return (
        <div
            className={`table-rowx12 ${selectedRows.includes(quotation.id) ? "selectedresult" : ""}`}

        >
            <div className="table-cellx12 checkboxfx1" id="styl_for_check_box">
                <input
                    checked={selectedRows.includes(quotation.id)}
                    type="checkbox"
                    onChange={() => handleCheckboxChange(quotation.id)}
                />
                <div className="checkmark"></div>
            </div>
            <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                {/* {quotation.created_at ? formatDate(quotation.created_at) : ""} */}
                {quotation.created_at
                        ? formatDate3(quotation.created_at)
                        : ""}
            </div>

            <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs2">
                {quotation.bill_no || ""}
            </div>
            <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs3">
                {quotation.vendor?.display_name === "0" ? "" : quotation?.vendor?.display_name || ""}
            </div>
            <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs4">
                {quotation.reference_no == 0 ? "" : quotation.reference_no || ""}
            </div>

            <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs5_item">
                <p>
                    {showAmountWithCurrencySymbol(quotation.total)}
                </p>
            </div>

            {value === "bills" ?
                <div
                    onClick={() => handleRowClicked(quotation)}
                    className="table-cellx12 quotiosalinvlisxs6 sdjklfsd565"
                >
                    <p
                        className={quotation?.status === "1" ? "open" : quotation?.status === "0" ? "draft" : quotation?.status == "2" ? "declined" : quotation?.status === "3" ? "pending" : quotation?.status === "4" ? "overdue" :
                            quotation?.status === "5" ? "open" :
                                ""}
                    >

                        {quotation?.status === "0" ? "Draft" : quotation?.status === "1" ? "Approved" : quotation?.status == "2" ? "Rejected" : quotation?.status == "3" ? "Pending" : quotation?.status == "4" ? "Overdue" :
                            quotation?.status == "5" ? "Paid" :
                                ""
                        }
                    </p>
                </div>
                :
                <div
                    onClick={() => handleRowClicked(quotation)}
                    className="table-cellx12 quotiosalinvlisxs6 sdjklfsd565"
                >
                    <p className={quotation?.status === "1" ? "approved" : quotation?.status === "2" ? "declined" : quotation?.status == "3" ? "sent" : quotation?.status === "0" ? "draft" : "declined"}>

                        {quotation?.status === "1" ? "Approved" : quotation?.status === "2" ? "Rejected" : quotation?.status == "3" ? "Sent" : quotation?.status == "0" ? "Draft" : ""
                        }
                    </p>
                </div>

            }


        </div>
    )
}