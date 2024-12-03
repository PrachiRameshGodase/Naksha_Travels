import React from 'react';
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons'
import { activeOrg_details, getDateStatus, getDateStatus1 } from '../../Helper/HelperFunctions';
import { formatDate } from '../../Helper/DateFormat';


export const ShowAllStatus = ({ quotation }) => {
    return (
        <div className=
            {
                quotation?.status == 0 ? 'convertedClassName' : quotation?.status == 1 ? 'approvedClassName' : quotation?.status == 2 ? 'declinedClassName' : quotation?.status == 3 ? 'sentClassName' : quotation?.status == 4 ? 'sentClassName' : quotation?.status == 6 ? 'convertedClassName' : quotation?.status == "7" ? "approvedClassName" : quotation?.status == "8" ? "approvedClassName" : 'defaultClassName'
            }

        >
            {quotation?.status === "0" ? "Draft" : quotation?.status === "1" ? "Approved" : quotation?.status == "2" ? "Decline" : quotation?.status == "3" ? "Pending" : quotation?.status == "4" ? "Invoice in Progress" :


                quotation?.status == "6" ?
                    <>
                        {quotation?.sale_order_id ? "Open" :
                            <>
                                {getDateStatus(formatDate(quotation?.transaction_date), formatDate(quotation?.expiry_date))}
                            </>

                        }

                    </>


                    : quotation?.status == "7" ? "Sale Ordered" : quotation?.status == "8" ? "Invoiced" : ""}

        </div>
    )
}
export const ShowAllStatusPurchase = ({ quotation }) => {
    return (
        <div className=
            {
                quotation?.status == 0 ? 'convertedClassName' : quotation?.status == 1 ? 'approvedClassName' : quotation?.status == 2 ? 'declinedClassName' : quotation?.status == 3 ? 'sentClassName' : quotation?.status == 4 ? 'convertedClassName' : quotation?.status == 6 ? 'convertedClassName' : quotation?.status == "7" ? "approvedClassName" : quotation?.status == "8" ? "approvedClassName" : 'defaultClassName'
            }

        >
            {quotation?.status === "0" ? "Draft" : quotation?.status === "1" ? "Approved" : quotation?.status == "2" ? "Decline" : quotation?.status == "3" ? "Transfer To GRN" : quotation?.status == "4" ? "Billed" : quotation?.status == "6" ? "Open" : ""}


        </div>
    )
}
export const ShowAllStatus1 = ({ quotation, section }) => {

    return (
        <div className=
            {
                quotation?.status == 0
                    ? 'convertedClassName'
                    : quotation?.status == 1
                        ? 'approvedClassName'
                        : quotation?.status == 2
                            ? 'declinedClassName'
                            : quotation?.status == 3
                                ? section === "invoice_approval"
                                    ? "sentClassName2"
                                    : "sentClassName"
                                : quotation?.status == 4
                                    ? 'approvedClassName'
                                    : quotation?.status == 5
                                        ? 'paidClassName'
                                        : quotation?.status == 6
                                            ? 'convertedClassName'
                                            : quotation?.status == 7
                                                ? 'approvedClassName'
                                                : quotation?.status == 8
                                                    ? 'approvedClassName'
                                                    : 'defaultClassName'
            }


        >
            {section === "invoice_approval" ? "Pending" : <>
                {
                    quotation?.status == "1" ?
                        <>
                            <>
                                {getDateStatus1(formatDate(quotation?.transaction_date), formatDate(quotation?.due_date))}
                            </>
                        </>
                        :
                        quotation?.status === "0" ? "Draft" : quotation?.status === "2" ? "Declined" : quotation?.status === "1" ? "Approved" : quotation?.status === "6" ? "Open" : quotation?.status === "3" ? "Send for approval" : quotation?.status === "4" ? "Delivered" : quotation?.status === "5" ? "Paid" : ""
                }
            </>}

        </div>
    )
}

export const ShowDropdownContent = ({ quotation, changeStatus }) => {

    return (
        <div className="dropdownmenucustom">
            {quotation?.status === "0" ?
                <div className='dmncstomx1' onClick={() => changeStatus("sent")}>
                    {otherIcons?.check_accepted_svg}
                    {quotation?.sale_order_id ? "Mark As Confirmed" : "Mark As Sent"}
                </div>
                :
                <>
                    {quotation?.status === "6" ? (
                        <>
                            <div className='dmncstomx1' onClick={() => changeStatus("decline")}>
                                {otherIcons?.cross_declined_svg}
                                Mark As Declined
                            </div>
                            <div className='dmncstomx1' onClick={() => changeStatus("accepted")}>
                                {otherIcons?.check_accepted_svg}
                                Mark As Accepted
                            </div>
                        </>
                    ) : quotation?.status === "2" ? (
                        <div className='dmncstomx1' onClick={() => changeStatus("accepted")}>
                            {otherIcons?.check_accepted_svg}
                            Mark As Accepted
                        </div>
                    ) :
                        ""

                    }
                </>
            }
            {!(quotation?.status === "1" || quotation?.status === "4") && (
                <div className='dmncstomx1' style={{ cursor: "pointer" }} onClick={() => changeStatus("delete")}>
                    {otherIcons?.delete_svg} Delete
                </div>
            )}
        </div>
    )
}

export const MoreInformation = ({ sale, note, tc, section }) => {
    const formatValue = value => value == 0 ? "" : value;

    return (
        <div className="accounting-info-section">
            <h2>More Information</h2>
            {/* <div className="info-item">
                <span className="label"> <b>Sale Person:</b></span>
                <span className="value">{formatValue(sale)}</span>
            </div> */}
            <div className="info-item">
                <span className="label" ><b style={{ width: section === "Customer" ? "104px" : "87px",  display: "flex" }}>{section} Note :</b></span>
                <span className="value">{formatValue(note)}</span>
            </div>
            <div className="info-item">
                <span className="label"><b style={{ width: "149px", display: "flex" }}> Terms And Conditions : </b></span>
                <span className="value">{formatValue(tc)}</span>
            </div>
        </div>
    );
};

export const FromToDetails = ({ quotation, section }) => {
    const active_orgnization = activeOrg_details;

    return (
        <div className="detailsbox4x15s2">
            <div className="cjkls5xs1">
                <h1>{section} From</h1>

                <p>
                    <span> <b>{active_orgnization?.name || ""}</b></span><br />
                    <span>{active_orgnization?.email || ""}</span><br />
                    <span>{active_orgnization?.mobile_no || ""}</span><br />
                    <span>{active_orgnization?.street2 || ""}</span><br />
                    <span>{active_orgnization?.street1 || ""}</span><br />
                </p>
            </div>
            <div className="cjkls5xs2">
                <h1>{section} To</h1>
                <p><b> {`${quotation?.display_name || ""}`}</b></p>
                {quotation?.registration_type === "Registered" ?
                    <>
                        <p>VAT Number: {quotation?.gst_no || ""}</p>
                        <p>Bussiness Leagal Name: {quotation?.business_leagal_name || "business_leagal_name"}</p>
                    </> : ""

                }
            </div>
        </div>
    )
}

