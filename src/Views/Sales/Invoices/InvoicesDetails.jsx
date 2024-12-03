import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { Link, useNavigate } from 'react-router-dom'
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { invoiceDetailes, invoiceMailSend, invoicesDelete, invoiceSend, invoicesStatus } from '../../../Redux/Actions/invoiceActions';
import Loader02 from '../../../Components/Loaders/Loader02';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import { Toaster } from 'react-hot-toast';
import { formatDate, generatePDF } from '../../Helper/DateFormat';

import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import useOutsideClick from '../../Helper/PopupData';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import ItemDetailTable from '../../Common/InsideSubModulesCommon/ItemDetailTable';
import { FromToDetails, MoreInformation, ShowAllStatus, ShowAllStatus1 } from '../../Common/InsideSubModulesCommon/DetailInfo';
import { IoMailOpenOutline } from 'react-icons/io5';
import { parseJSON } from 'date-fns';
import { parseJSONofString, showRealatedText } from '../../Helper/HelperFunctions';


const InvoicesDetails = ({ section }) => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [showDropdownx2, setShowDropdownx2] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownx1, setShowDropdownx1] = useState(false);
  const invoiceDetail = useSelector(state => state?.invoiceDetail);
  const invoiceStatus = useSelector(state => state?.invoicesStatus);
  const invoiceDelete = useSelector(state => state?.invoicesDelete);
  const invoiceSent = useSelector(state => state?.invoiceSent);
  const invoice = invoiceDetail?.data?.data?.Invoice;
  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);


  useOutsideClick(dropdownRef, () => setShowDropdown(false));
  useOutsideClick(dropdownRef1, () => setShowDropdownx1(false));
  useOutsideClick(dropdownRef2, () => setShowDropdown(false));
  useOutsideClick(dropdownRef1, () => setShowDropdownx1(false));
  useOutsideClick(dropdownRef, () => setShowDropdownx2(false));

  const UrlId = new URLSearchParams(location.search).get("id");

  const handleEditThing = (val) => {
    const queryParams = new URLSearchParams();
    queryParams.set("id", UrlId);

    if (val === "edit") {
      queryParams.set(val, true);
      if (section === "delivery_challan") {
        Navigate(`/dashboard/create-delivery-challans?${queryParams.toString()}`);
      } else {
        Navigate(`/dashboard/create-invoice?${queryParams.toString()}`);
      }
    } else if (val == "duplicate") {
      queryParams.set(val, true);
      Navigate(`/dashboard/create-invoice?${queryParams.toString()}`);

    } else if (val === "toCredit") {
      queryParams.set("convert", val);
      Navigate(`/dashboard/create-credit-note?${queryParams.toString()}`);

    } else if (val === "toPayment") {
      queryParams.set("convert", val);
      Navigate(`/dashboard/create-payment-rec?${queryParams.toString()}`);

    } else if (val === "challanToInvoice") {
      queryParams.set("convert", val);
      Navigate(`/dashboard/create-invoice?${queryParams.toString()}`);
    }
  };

  const [callApi, setCallApi] = useState(false);

  const changeStatus = (statusVal) => {
    try {
      const sendData = {
        id: UrlId, // Ensure UrlId is correctly set and not undefined
        is_invoice: section === "delivery_challan" ? 0 : 1,
      };

      switch (statusVal) {
        case 'approved':
          sendData.status = "3"
          break;
        case 'decline':
          sendData.status = "2"
          break;
        case 'accepted':
          sendData.status = "1"
          break;
        case 'open':
          sendData.status = "6"
          break;
          break;
        case 'delivered':
          sendData.status = "4"
          break;
        default:
      }

      if (statusVal === "delete") {
        dispatch(invoicesDelete(sendData, Navigate));
      } else if (statusVal === "sendMail") {
        const queryParams = new URLSearchParams();
        queryParams.set("inovice_send", true);
        Navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: invoice } });
      }
      else {
        dispatch(invoicesStatus(sendData, setCallApi, Navigate, parseJSONofString(invoice?.tracking_details)))
      }
    } catch (error) {
      console.log("error", error);
    }
  }


  useEffect(() => {
    if (UrlId) {
      const queryParams = {
        id: UrlId,
        is_invoice: section === "delivery_challan" ? 0 : 1,
      };
      dispatch(invoiceDetailes(queryParams));
    }
  }, [dispatch, UrlId, callApi]);

  const totalFinalAmount = invoice?.items?.reduce((acc, item) => acc + parseFloat(item?.final_amount), 0);


  // pdf & print
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // const handleGeneratePDF = async () => {
  //   const pdfBytes = await generatePDF(invoice?.items);
  //   const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  //   const url = URL.createObjectURL(blob);
  //   window.open(url);
  // };
  // pdf & print

  return (
    <>
      {(invoiceStatus?.loading || invoiceDelete?.loading || invoiceSent?.loading) && <MainScreenFreezeLoader />}

      {invoiceDetail?.loading ? <Loader02 /> :
        <div ref={componentRef}>
          <Toaster />
          <div id="Anotherbox" className='formsectionx1'>
            <div id="leftareax12">
              <h1 id="firstheading">{invoice?.invoice_id}</h1>
            </div>
            <div id="buttonsdata">

              {!section ?
                <>

                  {
                    invoice?.status === "1" || invoice?.status === "3" || invoice?.status === "5" ? "" : <div className="mainx1 s1d2f14s2d542maix4ws" onClick={() => changeStatus("approved")} >
                      <p>Sent For Approval</p>
                    </div>
                  }


                  {invoice?.is_mail_sent === "0" && invoice?.status === "1" &&
                    <div className="mainx1" onClick={() => changeStatus("sendMail")}>
                      <IoMailOpenOutline />
                      <p>Send</p>
                    </div>
                  }
                </> :
                <>
                  {section === "invoice_approval" && <>
                    {invoice?.status === "2" || invoice?.status === "1" ? "" : <div className="mainx1 s1d2f14s2d542maix4ws" onClick={() => changeStatus("accepted")} >
                      <p>Approve</p>
                    </div>}


                    {invoice?.status === "1" || invoice?.status === "2" ? "" : <div className="mainx1 s1d2f14s2d542maix5ws" onClick={() => changeStatus("decline")} >
                      <p>Decline</p>
                    </div>}
                  </>}
                </>
              }
              {invoice?.status !== "1" || invoice?.status !== "4" && invoice?.status !== "3" && (
                <div className="mainx1" onClick={() => handleEditThing("edit")}>
                  <img src="/Icons/pen-clip.svg" alt="" />
                  <p>Edit</p>
                </div>
              )}

              <div onClick={() => setShowDropdownx1(!showDropdownx1)} className="mainx1" ref={dropdownRef1}>
                <p>PDF/Print</p>
                {otherIcons?.arrow_svg}
                {showDropdownx1 && (
                  <div className="dropdownmenucustom">
                    <div className='dmncstomx1 primarycolortext' onClick={() => generatePDF(invoice?.items)} >
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
                  <>
                    <div className="dropdownmenucustom">
                      {section === "delivery_challan" &&
                        <>
                          {invoice?.status !== "4" && <>
                            {invoice?.status === "6" ?
                              <>
                                <div className='dmncstomx1' onClick={() => changeStatus("delivered")}>
                                  {otherIcons?.check_accepted_svg}
                                  Mark as Delivered</div>
                              </>
                              :
                              <div className='dmncstomx1' onClick={() => changeStatus("open")}>
                                {otherIcons?.check_accepted_svg}
                                Mark as Open</div>
                            }

                          </>}

                          <div className='dmncstomx1' onClick={() => handleEditThing("challanToInvoice")}>
                            {otherIcons?.convert_svg}
                            Convert to Invoice</div>
                        </>
                      }
                      <>

                        {section !== "delivery_challan" &&
                          <div className='dmncstomx1' onClick={() => handleEditThing("dublicate")}>
                            {otherIcons?.duplicate_svg}
                            Duplicate</div>
                        }

                        {!(invoice?.status === "1" || invoice?.status === "2" || invoice?.status === "4" || invoice?.status === "5") && (
                          <div className='dmncstomx1' style={{ cursor: "pointer" }} onClick={() => changeStatus("delete")}>
                            {otherIcons?.delete_svg} Delete
                          </div>
                        )}

                      </>
                    </div>
                  </>
                )}
              </div>

              <Link to={`/dashboard/${showRealatedText(section, "invoice_receive", "invoice-approval", "delivery_challan", "delivery_challan", "invoices")}`} className="linkx3">
                <RxCross2 />
              </Link>
            </div>
          </div>
          <div className="listsectionsgrheigh">
            {invoice?.status == 1 &&
              <div className="commonquoatjkx54s">
                <div className="firstsecquoatjoks45">
                  <div className="detailsbox4x15sfirp">
                    <img src="https://cdn-icons-png.flaticon.com/512/9329/9329876.png" alt="" />
                  </div>
                  <div className="detailsbox4x15s">
                    <h2>Invoice</h2>
                    <p>Create a creadit note or make payment for this estimate/invoice of your customer.</p>
                    <button onClick={() => setShowDropdownx2(!showDropdownx2)} ref={dropdownRef}>Convert {otherIcons?.arrow_svg}
                      {showDropdownx2 && (
                        <div className="dropdownmenucustom5sc51s">

                          <div className='dmncstomx1 btextcolor' onClick={() => handleEditThing("toCredit")}>
                            {otherIcons?.print_svg}
                            Create Credit Note
                          </div>
                          <div className='dmncstomx1 btextcolor' onClick={() => handleEditThing("toPayment")}>
                            {otherIcons?.pdf_svg}
                            Make Payment
                          </div>
                        </div>
                      )}
                    </button>

                  </div>
                </div>
              </div>
            }

            <div className="commonquoatjkx55s">
              <div className="childommonquoatjkx55s">
                <ShowAllStatus1 quotation={invoice} section={section} />

                <div className="detailsbox4x15s1">
                  <div className="xhjksl45s">
                    <svg width="24" height="23" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg"><path d="M16.7582 0.894043L18.8566 4.51588L16.7582 8.13771H12.5615L10.4631 4.51588L12.5615 0.894043L16.7582 0.894043Z" /><path d="M6.29509 0.894043L13.5963 13.4842L11.4979 17.1061H7.30116L0 4.51588L2.09836 0.894043L6.29509 0.894043Z" /></svg>
                    <p>Accounts</p>
                  </div>
                  <div className="xhjksl45s2">
                    <h1>Invoice</h1>
                    <span><p>Invoice No:</p> <h3>{invoice?.invoice_id}</h3></span>
                    <span><p>Invoice Date:</p> <h3> {formatDate(invoice?.transaction_date)}</h3></span>
                  </div>
                </div>

                {/* <div className="detailsbox4x15s2" id='quotation-content'>
                </div> */}
                <FromToDetails quotation={invoice?.customer} section="Invoice" />

                <ItemDetailTable itemsData={invoice} />
              </div>
            </div>

            <MoreInformation sale={invoice?.sale_person} note={invoice?.customer_note} tc={invoice?.terms_and_condition} section="Customer" />

          </div>
        </div >}
    </>
  )
}

export default InvoicesDetails;