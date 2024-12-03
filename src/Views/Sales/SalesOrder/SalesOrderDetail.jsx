import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { Link, useNavigate } from 'react-router-dom'
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import { saleOrderDelete, saleOrderDetails, saleOrderStatus } from '../../../Redux/Actions/saleOrderActions';
import { useDispatch, useSelector } from 'react-redux';
import Loader02 from '../../../Components/Loaders/Loader02';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import { Toaster } from 'react-hot-toast';
import { formatDate, generatePDF } from '../../Helper/DateFormat';

import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import useOutsideClick from '../../Helper/PopupData';
import ItemDetailTable from '../../Common/InsideSubModulesCommon/ItemDetailTable';
import { FromToDetails, MoreInformation, ShowAllStatus, ShowDropdownContent } from '../../Common/InsideSubModulesCommon/DetailInfo';

const SalesOrderDetail = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownx1, setShowDropdownx1] = useState(false);
  const saleStatus = useSelector(state => state?.saleStatus);
  const saleDelete = useSelector(state => state?.saleDelete);
  const saleDetail = useSelector(state => state?.saleDetail);
  const sale = saleDetail?.data?.data?.salesOrder;
  // console.log("sale", sale)

  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);



  useOutsideClick(dropdownRef2, () => setShowDropdown(false));
  useOutsideClick(dropdownRef1, () => setShowDropdownx1(false));



  const UrlId = new URLSearchParams(location.search).get("id");

  const handleEditThing = (val) => {
    const queryParams = new URLSearchParams();
    queryParams.set("id", UrlId);

    if (val === "edit") {
      queryParams.set("edit", true);
      Navigate(`/dashboard/create-sales-orders?${queryParams.toString()}`);
    } else if (val === "convert") {
      queryParams.set("convert", "saleToInvoice");
      Navigate(`/dashboard/create-invoice?${queryParams.toString()}`);
    }

  };

  const [callApi, setCallApi] = useState(false);
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
        dispatch(saleOrderDelete(sendData, Navigate)).then(() => {
          setCallApi((preState) => !preState);
        });
      } else {
        dispatch(saleOrderStatus(sendData)).then(() => {
          setCallApi((preState) => !preState);
        });
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
      dispatch(saleOrderDetails(queryParams));
    }
  }, [dispatch, UrlId, callApi]);

  const totalFinalAmount = sale?.items?.reduce((acc, item) => acc + parseFloat(item?.final_amount), 0);

  // pdf & print
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // const generatePDF = () => {
  //   const input = document.getElementById('quotation-content');
  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF();
  //     pdf.addImage(imgData, 'PNG', 0, 0);
  //     pdf.save('quotation.pdf');
  //   });
  // };
  // pdf & print





  return (
    <>
      {saleStatus?.loading && <MainScreenFreezeLoader />}
      {saleDelete?.loading && <MainScreenFreezeLoader />}
      {saleDetail.loading ? <Loader02 /> :
        <div ref={componentRef}>

          <div id="Anotherbox" className='formsectionx1'>
            <div id="leftareax12">
              <h1 id="firstheading">{sale?.sale_order_id}</h1>
            </div>
            <div id="buttonsdata">
              {sale?.status !== "1" && sale?.status !== "4" &&
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
              {sale?.status !== "1" &&
                <div onClick={() => setShowDropdown(!showDropdown)} className="mainx2" ref={dropdownRef2}>
                  <img src="/Icons/menu-dots-vertical.svg" alt="" data-tooltip-id="my-tooltip" data-tooltip-content="More Options" data-tooltip-place='bottom' />

                  {showDropdown && (
                    <ShowDropdownContent quotation={sale} changeStatus={changeStatus} />
                  )}

                </div>
              }
              <Link to={"/dashboard/sales-orders"} className="linkx3" data-tooltip-id="my-tooltip" data-tooltip-content="Close" data-tooltip-place='bottom'>
                <RxCross2 />
              </Link>
            </div>
          </div>
          <div className="listsectionsgrheigh" id='quotation-content'>
            {sale?.status == 1 &&
              <div className="commonquoatjkx54s">
                <div className="firstsecquoatjoks45">
                  <div className="detailsbox4x15sfirp">
                    <img src="https://cdn-icons-png.flaticon.com/512/9329/9329876.png" alt="" />
                  </div>
                  <div className="detailsbox4x15s">
                    <h2>Fulfill the Sales Order</h2>
                    <p>You have the flexibility to generate packages, shipments, or invoices (in any order you prefer) to fulfill this sales order.</p>
                    <button onClick={() => handleEditThing("convert")}>
                      Convert To Invoice
                    </button>
                  </div>
                </div>
              </div>
            }
            <div className="commonquoatjkx55s">
              <div className="childommonquoatjkx55s">
                <ShowAllStatus quotation={sale} />

                <div className="detailsbox4x15s1">
                  <div className="xhjksl45s">
                    <svg width="24" height="23" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg"><path d="M16.7582 0.894043L18.8566 4.51588L16.7582 8.13771H12.5615L10.4631 4.51588L12.5615 0.894043L16.7582 0.894043Z" /><path d="M6.29509 0.894043L13.5963 13.4842L11.4979 17.1061H7.30116L0 4.51588L2.09836 0.894043L6.29509 0.894043Z" /></svg>
                    <p>Accounts</p>
                  </div>
                  <div className="xhjksl45s2">
                    <h1>Sales Order</h1>
                    <span><p>Sales Order:</p> <h3>{sale?.sale_order_id}</h3></span>
                    <span><p>Sales-Order Date:</p> <h3>{formatDate(sale?.transaction_date)}</h3></span>
                  </div>
                </div>
                <FromToDetails quotation={sale?.customer} section="Sales Orders" />
                <ItemDetailTable itemsData={sale} />

              </div>
            </div>

            <MoreInformation sale={sale?.sale_person} note={sale?.customer_note} tc={sale?.terms_and_condition} section="Customer" />

          </div>
        </div>}
      <Toaster />
    </>
  )
}

export default SalesOrderDetail;