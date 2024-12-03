import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { Link, useNavigate } from 'react-router-dom'
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { quotationDelete, quotationDetails, quotationStatus } from '../../../Redux/Actions/quotationActions';
import Loader02 from "../../../Components/Loaders/Loader02";
import { Toaster } from 'react-hot-toast';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import { formatDate, formatDate3, formatDate4, generatePDF } from '../../Helper/DateFormat';
import useOutsideClick from '../../Helper/PopupData';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ItemDetailTable from '../../Common/InsideSubModulesCommon/ItemDetailTable';
// import MoreInformation from '../../Common/MoreInformation';
import { FromToDetails, MoreInformation, ShowAllStatus, ShowDropdownContent } from '../../Common/InsideSubModulesCommon/DetailInfo';

const QuotationDetails = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownx1, setShowDropdownx1] = useState(false);
  const [showDropdownx2, setShowDropdownx2] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const quoteDetail = useSelector(state => state?.quoteDetail);
  const quoteStatus = useSelector(state => state?.quoteStatus);
  const quoteDelete = useSelector(state => state?.quoteDelete);
  const quotation = quoteDetail?.data?.data?.quotation;

  const [callApi, setCallApi] = useState(0);

  // console.log("quoteDetail", quoteDetail)
  useOutsideClick(dropdownRef2, () => setShowDropdown(false));
  useOutsideClick(dropdownRef1, () => setShowDropdownx1(false));
  useOutsideClick(dropdownRef, () => setShowDropdownx2(false));

  const UrlId = new URLSearchParams(location.search).get("id");

  const handleEditThing = (val) => {
    const queryParams = new URLSearchParams();
    queryParams.set("id", UrlId);

    if (val === "quotationToSale") {
      queryParams.set("convert", "quotationToSale");
      Navigate(`/dashboard/create-sales-orders?${queryParams.toString()}`);

    } else if (val === "quotationToInvoice") {
      queryParams.set("convert", val);
      Navigate(`/dashboard/create-invoice?${queryParams.toString()}`);

    } else if (val === "edit") {
      queryParams.set("edit", true);
      Navigate(`/dashboard/create-quotations?${queryParams.toString()}`);
    }
  };

  // const [callApi, setCallApi] = useState(false);
  const changeStatus = (statusVal) => {
    try {
      const sendData = {
        id: UrlId
      }
      switch (statusVal) {
        case 'accepted':
          sendData.status = 1
          break;
        case 'decline':
          sendData.status = 2
          break;
        case 'sent':
          sendData.status = 6
          break;
        default:
      }

      if (statusVal === "delete") {
        dispatch(quotationDelete(sendData, Navigate));
      } else {
        dispatch(quotationStatus(sendData, setCallApi))
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    if (UrlId) {
      const queryParams = {
        id: UrlId,
        fy: localStorage.getItem('FinancialYear'),
        warehouse_id: localStorage.getItem('selectedWarehouseId'),
      };
      dispatch(quotationDetails(queryParams));
    }
  }, [dispatch, UrlId, callApi]);

  return (
    <>
      {(quoteStatus?.loading || quoteDelete?.loading) && <MainScreenFreezeLoader />}
      {quoteDetail?.loading ? <Loader02 /> :
        <div ref={componentRef} >
          <div id="Anotherbox" className='formsectionx1'>
            <div id="leftareax12">
              <h1 id="firstheading">{quotation?.quotation_id}</h1>
            </div>
            <div id="buttonsdata">

              {quotation?.status !== "1" && quotation?.status !== "4" &&
                <div className="mainx1" onClick={() => handleEditThing("edit")}>
                  <img src="/Icons/pen-clip.svg" alt="" />
                  <p>Edit</p>
                </div>
              }

              <div onClick={() => setShowDropdownx1(!showDropdownx1)} className="mainx1" ref={dropdownRef1}>
                <p>PDF/Print</p>
                {otherIcons?.arrow_svg}
                {showDropdownx1 && (
                  <div className="dropdownmenucustom">
                    <div className='dmncstomx1 primarycolortext' onClick={() => generatePDF(quotation?.items)}>
                      {otherIcons?.pdf_svg}
                      PDF</div>
                    <div className='dmncstomx1 primarycolortext' onClick={handlePrint} >
                      {otherIcons?.print_svg}
                      Print</div>
                  </div>
                )}
              </div>

              <div className="sepc15s63x63"></div>

              {quotation?.status !== "1" &&
                <div onClick={() => setShowDropdown(!showDropdown)} className="mainx2" ref={dropdownRef2}>
                  <img src="/Icons/menu-dots-vertical.svg" alt="" data-tooltip-id="my-tooltip" data-tooltip-content="More Options" data-tooltip-place='bottom' />
                  {showDropdown && (
                    <ShowDropdownContent quotation={quotation} changeStatus={changeStatus} />
                  )}
                </div>
              }

              <Link to={"/dashboard/quotation"} className="linkx3" data-tooltip-id="my-tooltip" data-tooltip-content="Close" data-tooltip-place='bottom'>
                <RxCross2 />
              </Link>
            </div>
          </div>
          <div className="listsectionsgrheighx21s" id='quotation-content'>
            {quotation?.status == 1 &&
              <div className="commonquoatjkx54s">
                <div className="firstsecquoatjoks45">
                  <div className="detailsbox4x15sfirp">
                    <img src="https://cdn-icons-png.flaticon.com/512/9329/9329876.png" alt="" />
                  </div>
                  <div className="detailsbox4x15s">
                    <h2>Convert and Sent the Quotation</h2>
                    <p>Create an invoice or sales order for this estimate to confirm the sale and bill your customer.</p>
                    <button onClick={() => setShowDropdownx2(!showDropdownx2)} ref={dropdownRef}>Convert {otherIcons?.arrow_svg}
                      {showDropdownx2 && (
                        <div className="dropdownmenucustom5sc51s">

                          <div className='dmncstomx1 btextcolor' onClick={() => handleEditThing("quotationToSale")}>
                            {otherIcons?.print_svg}
                            Convert To Sale Order
                          </div>
                          <div className='dmncstomx1 btextcolor' onClick={() => handleEditThing("quotationToInvoice")}>
                            {otherIcons?.pdf_svg}
                            Convert To Invoice
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
                <ShowAllStatus quotation={quotation} />
                <div className="detailsbox4x15s1">
                  <div className="xhjksl45s">
                    <svg width="24" height="23" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg"><path d="M16.7582 0.894043L18.8566 4.51588L16.7582 8.13771H12.5615L10.4631 4.51588L12.5615 0.894043L16.7582 0.894043Z" /><path d="M6.29509 0.894043L13.5963 13.4842L11.4979 17.1061H7.30116L0 4.51588L2.09836 0.894043L6.29509 0.894043Z" /></svg>
                    <p>Accounts</p>
                  </div>
                  <div className="xhjksl45s2">
                    <h1>Quotation</h1>
                    <span><p style={{ width: "105px" }}>Quotation No:</p> <h3>{quotation?.quotation_id}</h3></span>
                    <span><p style={{ width: "96px" }}>Quotation Date:</p> <h3> {formatDate3(quotation?.transaction_date)}</h3></span>
                  </div>
                </div>

                <FromToDetails quotation={quotation?.customer} section="Quotation" />
                <ItemDetailTable itemsData={quotation} />

              </div>
            </div>

            <MoreInformation sale={quotation?.sale_person} note={quotation?.customer_note} tc={quotation?.terms_and_condition} section="Customer" />

          </div>
        </div>}
      <Toaster />
    </>
  )
}

export default QuotationDetails
