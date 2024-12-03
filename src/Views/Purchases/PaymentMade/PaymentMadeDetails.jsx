import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { Link, useNavigate } from 'react-router-dom'
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import { useDispatch, useSelector } from 'react-redux';
import Loader02 from '../../../Components/Loaders/Loader02';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import { Toaster } from 'react-hot-toast';
import { formatDate, generatePDF } from '../../Helper/DateFormat';
import { paymentRecDelete, paymentRecDetail, paymentRecStatus } from '../../../Redux/Actions/PaymentRecAction';


import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import useOutsideClick from '../../Helper/PopupData';
import { showAmountWithCurrencySymbol } from '../../Helper/HelperFunctions';
import { PaymentMadeDetailTable } from '../../Common/InsideSubModulesCommon/ItemDetailTable';
import { MoreInformation } from '../../Common/InsideSubModulesCommon/DetailInfo';

const PaymentMadeDetails = () => {
    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdownx1, setShowDropdownx1] = useState(false);
    const paymentDetail = useSelector(state => state?.paymentRecDetail);
    // const paymentStatus = useSelector(state => state?.paymentRecStatus);
    const paymentDelete = useSelector(state => state?.paymentRecDelete);
    const payment = paymentDetail?.data?.data?.payment;

    // console.log("paymentDelete", paymentDelete);
    // console.log("paymentStatus", paymentStatus);
    // console.log("paymentDetail", payment);


    const dropdownRef = useRef(null);
    const dropdownRef1 = useRef(null);
    useOutsideClick(dropdownRef, () => setShowDropdown(false));
    useOutsideClick(dropdownRef1, () => setShowDropdownx1(false));



    const UrlId = new URLSearchParams(location.search).get("id");

    const handleEditThing = (val) => {
        const queryParams = new URLSearchParams();
        queryParams.set("id", UrlId);

        if (val === "edit") {
            queryParams.set(val, true);
            Navigate(`/dashboard/create-payment-made?${queryParams.toString()}`);
        } else if (val == "duplicate") {
            queryParams.set(val, true);
            Navigate(`/dashboard/create-payment-made?${queryParams.toString()}`);
        }

    };

    const changeStatus = (statusVal) => {
        try {
            const sendData = {
                id: UrlId
            }
            if (statusVal === "delete") {
                dispatch(paymentRecDelete(sendData, Navigate, "payment_made"))
            }
        } catch (error) {
            console.log("error", error);
        }
    }


    useEffect(() => {
        if (UrlId) {
            const queryParams = {
                id: UrlId,
            };
            dispatch(paymentRecDetail(queryParams));
        }
    }, [dispatch, UrlId]);

    const totalFinalAmount = payment?.items?.reduce((acc, item) => acc + parseFloat(item?.final_amount), 0);


    // pdf & print
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // const generatePDF = () => {
    //     const input = document.getElementById('quotation-content');
    //     html2canvas(input).then((canvas) => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf = new jsPDF();
    //         pdf.addImage(imgData, 'PNG', 0, 0);
    //         pdf.save('quotation.pdf');
    //     });
    // };
    // pdf & print

    return (
        <>
            {paymentDelete?.loading && <MainScreenFreezeLoader />}
            {paymentDetail?.loading ? <Loader02 /> :
                <div ref={componentRef} >
                    <Toaster />
                    <div id="Anotherbox" className='formsectionx1'>
                        <div id="leftareax12">
                            <h1 id="firstheading">{payment?.payment_id}</h1>
                        </div>
                        <div id="buttonsdata">

                            {/* {
                                payment?.status == 1 || payment?.status == 3 ? "" : <div className="mainx1 s1d2f14s2d542maix4ws" onClick={() => handleEditThing("approved")} >
                                    <p>Approve</p>
                                </div>
                            } */}

                            <div className="mainx1" onClick={() => handleEditThing("edit")}>
                                <img src="/Icons/pen-clip.svg" alt="" />
                                <p>Edit</p>
                            </div>

                            <div onClick={() => setShowDropdownx1(!showDropdownx1)} className="mainx1" ref={dropdownRef1}>

                                <p>PDF/Print</p>
                                {otherIcons?.arrow_svg}
                                {showDropdownx1 && (
                                    <div className="dropdownmenucustom">
                                        <div className='dmncstomx1 primarycolortext' onClick={() => generatePDF(invoice?.items)}>
                                            {otherIcons?.pdf_svg}
                                            PDF</div>
                                        <div className='dmncstomx1 primarycolortext' onClick={handlePrint}>
                                            {otherIcons?.print_svg}
                                            Print</div>

                                    </div>
                                )}

                            </div>

                            <div className="sepc15s63x63"></div>

                            <div onClick={() => setShowDropdown(!showDropdown)} className="mainx2" ref={dropdownRef}>
                                <img src="/Icons/menu-dots-vertical.svg" alt="" />
                                {showDropdown && (
                                    <div className="dropdownmenucustom">

                                        <div className='dmncstomx1' onClick={() => handleEditThing("duplicate")}>
                                            {otherIcons?.duplicate_svg}
                                            Duplicate</div>

                                        <div className='dmncstomx1' style={{ cursor: "pointer" }} onClick={() => changeStatus("delete")}>
                                            {otherIcons?.delete_svg}
                                            Delete
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link to={"/dashboard/quotation"} className="linkx3">
                                <RxCross2 />
                            </Link>
                        </div>
                    </div>
                    <div className="listsectionsgrheigh">


                        <div className="commonquoatjkx55s">
                            <div className="childommonquoatjkx55s">
                                {/* <div className="labeltopleftx456">Open</div> */}
                                <div className="detailsbox4x15s1">
                                    <div className="xhjksl45s">
                                        <svg width="24" height="23" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg"><path d="M16.7582 0.894043L18.8566 4.51588L16.7582 8.13771H12.5615L10.4631 4.51588L12.5615 0.894043L16.7582 0.894043Z" /><path d="M6.29509 0.894043L13.5963 13.4842L11.4979 17.1061H7.30116L0 4.51588L2.09836 0.894043L6.29509 0.894043Z" /></svg>
                                        <p>Accounts</p>
                                    </div>
                                    <div className="xhjksl45s2">
                                        <h1>payment receipt</h1>
                                        <span><p>Payment Number:</p> <h3>{payment?.payment_id}</h3></span>
                                        <span><p>Bill Date:</p> <h3> {formatDate(payment?.transaction_date)}</h3></span>
                                    </div>
                                </div>


                                <br />

                                <PaymentMadeDetailTable payment={payment} />

                            </div>
                        </div>
                        {/* <div className="lastseck4x5s565">
                            <p>More information</p>
                            <p>Vendor Note:   {payment?.vendor_note == 0 ? "" : payment?.vendor_note || ""} </p>
                            <p>Terms And Conditions:   {payment?.terms_and_condition == 0 ? "" : payment?.terms_and_condition || ""} </p>
                        </div> */}
                        <MoreInformation sale={payment?.sale_person} note={payment?.vendor_note} tc={payment?.terms_and_condition} section="Vendor"/>
                    </div >
                </div >}
        </>
    )
}

export default PaymentMadeDetails;