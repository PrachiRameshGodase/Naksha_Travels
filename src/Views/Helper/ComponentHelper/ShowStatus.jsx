import React from 'react'
import { getDateStatus, getDateStatus1 } from '../HelperFunctions'
import { formatDate } from '../DateFormat'

export const ShowStatusInList = ({ quotation }) => {
    return (
        <div> <p className={quotation?.status === "1" ? "approved" : quotation?.status === "2" ? "declined" : quotation?.status == "6" ? "sent" : quotation?.status === "0" ? "draft" : quotation?.status == "7" ? "approved" : quotation?.status === "8" ? "approved" : "declined"} >

            {
                quotation?.status === "1" ? "Approved" :
                    quotation?.status === "2" ? "Declined" :

                        quotation?.status === "6" ?
                            <>
                                {quotation?.sale_order_id ? "Open" :
                                    // this status for quotation
                                    <>
                                        {getDateStatus(formatDate(quotation?.transaction_date), formatDate(quotation?.expiry_date))}
                                    </>
                                }
                            </> :

                            quotation?.status == "0" ? "Draft" : quotation?.status == "4" ? "Invoice In Process" : quotation?.status == "7" ? "Sale Ordered" : quotation?.status === "8" ? "Invoiced" : ""
            }

        </p>
        </div>
    )
}

export const ShowStatusInList1 = ({ quotation }) => {

    return (
        <div> <p className={quotation?.status === "1" ? "approved" : quotation?.status === "2" ? "declined" : quotation?.status === "6" ? "sent" : quotation?.status === "3" ? "sent" : quotation?.status === "0" ? "draft" : quotation?.status === "7" ? "approved" : quotation?.status === "8" ? "approved" : "approved"} >

            {quotation?.is_invoice === "0" ?
                <>
                    {
                        quotation?.status === "0" ? "Draft" : quotation?.status === "6" ? "Open" : quotation?.status === "4" ? "Delivered" : ""
                    }
                </>
                :
                <>
                    {
                        quotation?.status == "1" ?
                            <>
                                <>
                                    {getDateStatus1(formatDate(quotation?.approved_date), formatDate(quotation?.due_date))}
                                </>
                            </>
                            :
                            quotation?.status === "0" ? "Draft" : quotation?.status === "2" ? "Declined" : quotation?.status === "3" ? "Sent For Approval" : quotation?.status === "5" ? "Paid" : ""
                    }

                </>}

        </p>
        </div>
    )
}

