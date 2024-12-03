import React from 'react'
import { currencySymbol, showAmountWithCurrencySymbol, showAmountWithCurrencySymbolWithPoints, showRateWithPercent } from '../../Helper/HelperFunctions'
import ShowMastersValue from '../../Helper/ShowMastersValue'
import { MdArrowOutward } from 'react-icons/md'
import toast from 'react-hot-toast'
import { formatDate } from '../../Helper/DateFormat'

const ItemDetailTable = ({ itemsData }) => {
    const calculateTotalTaxAmount = () => {
        return itemsData?.items?.reduce((total, entry) => {
            return total + ((entry?.tax_amount) ? parseFloat(entry?.tax_amount) : 0);
        }, 0);
    };

    return (
        <>
            <table id="tablex15s56s31s1">
                <thead className="thaedaksx433">
                    <tr>
                        <th className="sfdjklsd1xs2w1">#</th>
                        <th className="sfdjklsd1xs2w2" style={{ width: "12%" }}>Item & Description</th>
                        <th className="sfdjklsd1xs2w4 sfdjklsd1xs2wrate">Rate</th>
                        <th className="sfdjklsd1xs2w3 sfdjklsd1xs2w3qty">Qty</th>
                        {/* <th className="sfdjklsd1xs2w3">Unit</th> */}
                        <th className="sfdjklsd1xs2w3 sfdjklsd1xs2w3Width">Tax Rate</th>
                        <th className="sfdjklsd1xs2w5 sfdjklsd1xs2wamount ">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {itemsData?.items?.map((val, index) => (
                        <tr key={index} className="rowsxs15aksx433">
                            <td className="sfdjklsd1xs2w1">{index + 1}</td>
                            <td className="sfdjklsd1xs2w2">{val?.item?.name || ""}</td>
                            <td className="sfdjklsd1xs2w4 sfdjklsd1xs2wrate">{showAmountWithCurrencySymbol(val?.rate)}</td>
                            <td className="sfdjklsd1xs2w3 sfdjklsd1xs2w3qty">{val?.quantity || ""}{"  "}
                                {val?.unit_id &&
                                    <>
                                        (<ShowMastersValue type="2" id={val?.unit_id} />)
                                    </>
                                }

                            </td>
                            {/* <td className="sfdjklsd1xs2w3"><ShowMastersValue type="2" id={val?.unit_id} /></td> */}
                            <td className="sfdjklsd1xs2w3">{showRateWithPercent(val?.tax_rate)}</td>
                            <td className="sfdjklsd1xs2w5 sfdjklsd1xs2wamount" >{showAmountWithCurrencySymbol(val?.final_amount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="finalcalculateiosxl44s">
                <span><p>Subtotal</p> <h5>{showAmountWithCurrencySymbol(itemsData?.subtotal)}</h5></span>
                <span><p>Total Tax</p> <h5>{showAmountWithCurrencySymbolWithPoints(calculateTotalTaxAmount())}</h5></span>
                <span><p>Adjustment Charge</p> <h5>{showAmountWithCurrencySymbolWithPoints(itemsData?.adjustment_charge)}</h5></span>
                <span><p>Shipping Charge</p> <h5>{showAmountWithCurrencySymbolWithPoints(itemsData?.shipping_charge)}</h5></span>
                {/* <span><p>Total</p> <h5>{showAmountWithCurrencySymbol(((+itemsData?.subtotal) + (+itemsData?.shipping_charge) + (+ itemsData?.adjustment_charge) + calculateTotalTaxAmount()))}</h5></span> */}
                <span><p>Total</p> <h5>{showAmountWithCurrencySymbol(itemsData?.total)}</h5></span>

            </div>

        </>
    )
}

export default ItemDetailTable


export const GrnItemsDetailTable = ({ GRNdetail, showAllImages }) => {
    return (
        <>
            <table id="tablex15s56s31s1">
                <thead className="thaedaksx433">
                    <tr>
                        <th className='sfdjklsd1xs2w1'>#</th>
                        <th className='sfdjklsd1xs2w2' style={{ width: "12%" }}>Item & Description</th>
                        <th className='sfdjklsd1xs2w4 sfdjklsd1xs2wgrate'>Rate</th>
                        {GRNdetail?.purchase_order && <th className='sfdjklsd1xs2w3'>PO QTY</th>}
                        <th className='sfdjklsd1xs2w3' >GRN Qty</th>
                        <th className='sfdjklsd1xs2w3'>Unit</th>
                        <th className='sfdjklsd1xs2w3 sfdjklsd1xs2wgrate' style={{ width: "12%" }}>Charges Weight</th>
                        <th className='sfdjklsd1xs2w3'>Tax Rate</th>
                        <th className='sfdjklsd1xs2w3'>Custom Duty</th>
                        <th className='sfdjklsd1xs2w5 sfdjklsd1xs2wfrate'>Final Amount</th>
                        <th className='sfdjklsd1xs2w5' style={{ textAlign: "right" }}>Attachments</th>
                    </tr>
                </thead>
                <tbody>
                    {GRNdetail?.items?.map((val, index) => (
                        <tr className="rowsxs15aksx433" key={index}>
                            <td className='sfdjklsd1xs2w1'>{index + 1}</td>
                            <td className='sfdjklsd1xs2w2' style={{ width: "120px" }}>{val?.item?.name || ""}</td>
                            <td className='sfdjklsd1xs2w4 sfdjklsd1xs2wgrate'>{showAmountWithCurrencySymbol(val?.rate)}</td>
                            {GRNdetail?.purchase_order && <td className='sfdjklsd1xs2w3'>{val?.po_qty || ""}</td>}
                            <td className='sfdjklsd1xs2w3'>{val?.gr_qty || ""}</td>
                            <td className='sfdjklsd1xs2w3'><ShowMastersValue type="2" id={val?.unit_id} /></td>
                            <td className='sfdjklsd1xs2w3 sfdjklsd1xs2wgrate'>{showAmountWithCurrencySymbol(val?.charges_weight)}</td>
                            <td className='sfdjklsd1xs2w3'>{showRateWithPercent(val?.tax_rate)}</td>
                            <td className='sfdjklsd1xs2w3'>{showRateWithPercent(val?.custom_duty)}</td>
                            <td className='sfdjklsd1xs2w5' style={{ width: "10%", paddingRight: "2%", textAlign: "right" }}>{showAmountWithCurrencySymbol(val?.final_amount)}</td>
                            <td className='sfdjklsd1xs2w4' style={{ textAlign: "right" }}>
                                {(JSON.parse(val?.upload_image))?.length > 1 ? (
                                    <span onClick={() => showAllImages(JSON.parse(val?.upload_image))}>
                                        {(JSON.parse(val?.upload_image))?.length} Images <MdArrowOutward />
                                    </span>
                                ) : (
                                    `${(JSON.parse(val?.upload_image))?.length < 1 ? 'No' : (JSON.parse(val?.upload_image))?.length} Image`
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <br />

            <table id="tablex15s56s31s1">
                <thead className="thaedaksx433">
                    <tr>
                        <th className='sfdjklsd1xs2w1' style={{ padding: "10px 8px" }}>#</th>
                        <th className='sfdjklsd1xs2w2' style={{ width: "22%" }}>Account Name</th>
                        <th className='sfdjklsd1xs2w2' style={{ width: "20%" }}>Vendor Name</th>
                        <th className='sfdjklsd1xs2w4' style={{ width: "10%", paddingRight: "2%", textAlign: "right" }}>Amount</th>
                        <th className='sfdjklsd1xs2w3' style={{ paddingLeft: "145px" }}>Remark</th>
                        <th className='sfdjklsd1xs2w3' style={{ textAlign: "right" }}>Attachments</th>
                    </tr>
                </thead>
                <tbody>
                    {GRNdetail?.charges?.map((val, index) => (
                        <tr className="rowsxs15aksx433" key={index}>
                            <td className='sfdjklsd1xs2w1'>{index + 1}</td>
                            <td className='sfdjklsd1xs2w2' style={{ width: "22%" }}>{val?.account?.account_name || ""}</td>
                            <td className='sfdjklsd1xs2w2' style={{ width: "20%" }}>{(val?.vendor?.display_name || "")}</td>
                            <td className='sfdjklsd1xs2w4' style={{ width: "10%", paddingRight: "2%", textAlign: "right" }}>{showAmountWithCurrencySymbol(val?.amount)}</td>
                            <td className='sfdjklsd1xs2w3' style={{ paddingLeft: "145px" }}>{val?.remarks || ""}</td>
                            <td className='sfdjklsd1xs2w4' style={{ textAlign: "right" }}>
                                {(JSON.parse(val?.upload_image))?.length >= 1 ? (
                                    <span onClick={() => showAllImages(JSON.parse(val?.upload_image))}>
                                        {(JSON.parse(val?.upload_image))?.length} Images <MdArrowOutward />
                                    </span>
                                ) : (
                                    `${(JSON.parse(val?.upload_image))?.length < 1 ? 'No' : (JSON.parse(val?.upload_image))?.length} Image`
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="finalcalculateiosxl44s">
                <span><p>Subtotal</p> <h5>{showAmountWithCurrencySymbol(GRNdetail?.subtotal)}</h5></span>
                <span><p>Adjustment Charge</p> <h5>{showAmountWithCurrencySymbol(GRNdetail?.adjustment_charge)}</h5></span>
                <span><p>Total Charge</p> <h5>{showAmountWithCurrencySymbol(GRNdetail?.total_grn_charges)}</h5></span>
                <span><p>Total</p> <h5>{showAmountWithCurrencySymbol(GRNdetail?.total)}</h5></span>
            </div>

        </>
    )
}

export const PaymentMadeDetailTable = ({ payment }) => {
    return (
        <>
            <table id="tablex15s56s31s1">
                <thead className="thaedaksx433">
                    <tr>
                        <th className='sfdjklsd1xs2w1'>#</th>
                        <th className='sfdjklsd1xs2w2' style={{ width: "15%" }}>Bill Number</th>
                        <th className='sfdjklsd1xs2w3'>Bill Date</th>
                        <th className='sfdjklsd1xs2w4' style={{ textAlign: "right" }}>Shipping Charge</th>
                        <th className='sfdjklsd1xs2w4' style={{ textAlign: "right" }}>Adjustment Charge</th>
                        <th className='sfdjklsd1xs2w4' style={{textAlign:"right"}}>Subtotal</th>
                        <th className='sfdjklsd1xs2w4' style={{ textAlign: "right" }}>Bill Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {payment?.entries?.map((val, index) => (
                        <tr className="rowsxs15aksx433" key={index}>
                            <td className='sfdjklsd1xs2w1'>{index + 1}</td>
                            <td className='sfdjklsd1xs2w2'>{val?.bill?.bill_no || ""}</td>
                            <td className='sfdjklsd1xs2w3'>{val?.bill?.transaction_date || ""}</td>
                            <td className='sfdjklsd1xs2w4' style={{ textAlign: "right" }}>{showAmountWithCurrencySymbol(val?.bill?.shipping_charge)}</td>
                            <td className='sfdjklsd1xs2w4' style={{ textAlign: "right" }}>{showAmountWithCurrencySymbol(val?.bill?.adjustment_charge)}</td>
                            <td className='sfdjklsd1xs2w4' style={{ textAlign: "right" }}>{showAmountWithCurrencySymbol(val?.bill?.subtotal)}</td>
                            <td className='sfdjklsd1xs2w4' style={{ textAlign: "right" }}>{showAmountWithCurrencySymbol(val?.bill?.total) || ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="finalcalculateiosxl44s">
                <span><p>Bank Charges</p> <h5>{showAmountWithCurrencySymbol(payment?.bank_charges)}</h5></span>
                <span><p>Amount In Excess</p> <h5>{showAmountWithCurrencySymbol(payment?.amt_excess)}</h5></span>
                <span><p>Amount Paid</p> <h5>{showAmountWithCurrencySymbol(payment?.credit)}</h5></span>
            </div>


        </>
    )
}

export const Payment_Receive_DetailTable = ({ payment }) => {
    const calculateTotalAmount = () => {
        const total = payment?.entries?.reduce((total, entry) => {
            return (+total) + (entry.amount ? parseFloat(entry.amount) : 0.00);
        }, 0.00);

        // Return "0.00" as a string if the total is 0, otherwise return the total formatted to 2 decimal places
        return (+total) === 0 ? "0.00" : (+total).toFixed(2);
    };
    return (
        <>
            {payment?.entries?.length >= 1 ?
                <table id="tablex15s56s31s1">
                    <thead className="thaedaksx433">
                        <tr>
                            <th className='sfdjklsd1xs2w1' style={{ width: "7%" }}>#</th>
                            <th className='sfdjklsd1xs2w2' style={{ width: "15%" }}>Date</th>
                            <th className='sfdjklsd1xs2w3' style={{ width: "22%" }}>Invoice Number</th>
                            <th className='sfdjklsd1xs2w4'>Invoice Amount</th>
                            <th className='sfdjklsd1xs2w4 '>Amount Due</th>
                            <th className='sfdjklsd1xs2w4' style={{ textAlign: "right", paddingRight: "16px" }}>Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payment?.entries?.map((val, index) => (
                            <tr className="rowsxs15aksx433" key={index}>
                                <td className='sfdjklsd1xs2w1'>{index + 1}</td>
                                <td className='sfdjklsd1xs2w2'>{formatDate(val?.invoice?.transaction_date) || ""}</td>
                                <td className='sfdjklsd1xs2w3'>{val?.invoice?.invoice_id || ""}</td>
                                <td className='sfdjklsd1xs2w4'>{showAmountWithCurrencySymbol(val?.invoice?.total)}</td>
                                <td className='sfdjklsd1xs2w4'>{showAmountWithCurrencySymbol((+val?.invoice?.total) - (+val?.invoice?.amount_paid))}</td>
                                <td className='sfdjklsd1xs2w4 sfdjklsd1xs2wamount' style={{ width: '11%' }}>{showAmountWithCurrencySymbol(val?.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table> :
                <p style={{ textAlign: "center", padding: "20px 0" }}>There are no unpaid invoices associated with this customer.</p>
            }

            <div className="finalcalculateiosxl44s">
                <span><p>Amount Received: ({currencySymbol})</p> <h5>{(payment?.debit)}</h5></span>
                <span>
                    <p>Amount In Excess: ({currencySymbol})</p>
                    <h5>
                        {(+payment?.amt_excess) < 0 ? (
                            <span style={{ color: "rgb(255, 46, 18)" }}>
                                {(+payment?.amt_excess)}
                            </span>
                        ) : (
                            (+payment?.amt_excess)
                        )}
                    </h5>
                </span>
                <span><p>Amount Used For Payment: ({currencySymbol})</p> <h5>{calculateTotalAmount()}</h5></span>
            </div>


        </>
    )
}


export const PaymentRecTable = ({ formData, setFormData, paymentDetail }) => {
    return (
        <>
            <table id="tablex15s56s31s1">
                <thead className="thaedaksx433">
                    <tr>
                        <div style={{ marginLeft: "10px" }}> <th className='sfdjklsd1xs2w1' style={{ width: "9%" }}>#</th></div>
                        <th className='sfdjklsd1xs2w4' style={{ width: "16%", paddingLeft: "40px" }}>Date</th>
                        <div style={{ marginLeft: "80px", width: "100%" }}><th className='sfdjklsd1xs2w4' style={{ width: "100%" }}>Invoice Number</th> </div>
                        <th className='sfdjklsd1xs2w4' style={{ width: "20%", textAlign: "right", paddingLeft: "100px" }}>Invoice Amount</th>
                        <div style={{ marginLeft: "150px", width: "50%" }}>  <th className='sfdjklsd1xs2w4 ' style={{ width: "100%", textAlign: "right" }}>Amount Due</th></div>
                        <th className='sfdjklsd1xs2w4' style={{ textAlign: "right", padding: "15px 40px" }}>Payment</th>
                    </tr>
                </thead>
                <tbody>
                    {formData?.entries?.map((val, index) => (
                        <tr key={index} className="rowsxs15aksx433">
                            {/* <td className="sfdjklsd1xs2w1">
                                {val?.date}</td> */}
                            <div style={{ marginLeft: "10px" }}><td className="sfdjklsd1xs2w1">{index + 1}</td></div>
                            <td className="sfdjklsd1xs2w2" style={{ paddingLeft: "40px" }} >{val?.date}</td>
                            <div style={{ marginLeft: "80px" }}>   <td className="sfdjklsd1xs2w2" >{val?.invoice_no}</td></div>
                            <td className="sfdjklsd1xs2w4" style={{ textAlign: "right" }}>{showAmountWithCurrencySymbol(val?.invoice_amount)}</td>
                            <td className="sfdjklsd1xs2w3" style={{ textAlign: "right" }}>{showAmountWithCurrencySymbol(val?.balance_amount)}</td>
                            <td className="sfdjklsd1xs2w3">

                                <div className="tablsxs1a4" style={{ textAlign: "right", marginRight: "0px" }}>
                                    <div className="tablsxs1a2">
                                        {/* {currencySymbol} */}
                                        <input
                                            style={{ width: "40%", textAlign: "center" }}
                                            type="number"
                                            value={val.amount !== null ? val.amount : ""}
                                            placeholder="0.00"
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                const newValue = inputValue === "" ? null : parseFloat(inputValue);

                                                if (newValue <= (+formData?.debit) || newValue <= (+paymentDetail?.debit)) {
                                                    setFormData((prevFormData) => ({
                                                        ...prevFormData,
                                                        entries: prevFormData?.entries?.map((entry, i) =>
                                                            i === index ? { ...entry, amount: newValue } : entry
                                                        )
                                                    }));
                                                } else if (formData.debit === "") {
                                                    toast('Please set the amount', {
                                                        icon: '👏',
                                                        style: {
                                                            borderRadius: '10px',
                                                            background: '#333',
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                        },
                                                    });
                                                    setFormData((prevFormData) => ({
                                                        ...prevFormData,
                                                        entries: prevFormData?.entries?.map((entry, i) =>
                                                            i === index ? { ...entry, amount: 0 } : entry
                                                        )
                                                    }));
                                                }

                                                else {
                                                    {
                                                        toast('The amount entered here is more than the amount paid by the customer', {
                                                            icon: '👏',
                                                            style: {
                                                                borderRadius: '10px',
                                                                background: '#333',
                                                                color: '#fff',
                                                                fontSize: '14px',
                                                            },
                                                        });


                                                    }
                                                    return;
                                                }
                                            }}
                                        />

                                    </div>
                                </div>


                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >

        </>
    )
}