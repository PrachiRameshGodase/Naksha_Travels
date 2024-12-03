import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";
// import { purchaseOrderDelete, purchaseOrderDetails, purchaseOrderStatus } from '../../../Redux/Actions/purchaseOrderActions';
import { useDispatch, useSelector } from "react-redux";
import Loader02 from "../../../Components/Loaders/Loader02";
import MainScreenFreezeLoader from "../../../Components/Loaders/MainScreenFreezeLoader";
import toast, { Toaster } from "react-hot-toast";
import {
  formatDate,
  formatDate2,
  formatDate3,
  formatDate4,
  generatePDF,
} from "../../Helper/DateFormat";

import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import useOutsideClick from "../../Helper/PopupData";
import {
  purchasesDelete,
  purchasesDetails,
  purchasesStatus
} from "../../../Redux/Actions/purchasesActions";
import ShowMastersValue from "../../Helper/ShowMastersValue";
import {
  showAmountWithCurrencySymbol,
  showRateWithPercent,
} from "../../Helper/HelperFunctions";
import ItemDetailTable from "../../Common/InsideSubModulesCommon/ItemDetailTable";
import {
  MoreInformation,
  FromToDetails,
  ShowAllStatus,
  ShowDropdownContent,
  ShowAllStatusPurchase
} from "../../Common/InsideSubModulesCommon/DetailInfo";
const PurchaseOrderDetails = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();


  const purchaseStatus = useSelector((state) => state?.purchseStatus);
  const purchaseDelete = useSelector((state) => state?.deletePurchase);
  const purchaseDetail = useSelector((state) => state?.detailsPurchase);
  const purchase = purchaseDetail?.data?.purchaseOrder;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownx1, setShowDropdownx1] = useState(false);
  const [showDropdownx2, setShowDropdownx2] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);

  useOutsideClick(dropdownRef2, () => setShowDropdown(false));
  useOutsideClick(dropdownRef1, () => setShowDropdownx1(false));
  useOutsideClick(dropdownRef, () => setShowDropdownx2(false));

  const UrlId = new URLSearchParams(location.search).get("id");
  const [callApi, setCallApi] = useState(false);

  const handleEditThing = (val) => {
    const queryParams = new URLSearchParams();
    queryParams.set("id", UrlId);
    if (val === "edit") {
      queryParams.set("edit", true);
      Navigate(`/dashboard/create-purchases?${queryParams.toString()}`);
    }
    else if (val === "purchase_to_bill") {
      queryParams.set("convert", "purchase_to_bill");
      Navigate(`/dashboard/create-bills?${queryParams.toString()}`);
    }
    else if (val === "purchase_to_grn") {
      queryParams.set("convert", "purchase_to_grn");
      Navigate(`/dashboard/new-grn?${queryParams.toString()}`);
    }
    else if (val === "duplicate") {
      queryParams.set("duplicate", true);
      Navigate(`/dashboard/create-purchases?${queryParams.toString()}`);
    } else if (val === "approved") {
      dispatch(purchasesStatus({ id: UrlId, status: 1 }, setCallApi));
    } else if (val === "delete") {
      dispatch(purchasesDelete({ id: UrlId }, Navigate));
    }
  };

  useEffect(() => {
    if (UrlId) {
      const queryParams = {
        id: UrlId,
      };
      dispatch(purchasesDetails(queryParams));
    }
  }, [dispatch, UrlId, callApi]);

  const totalFinalAmount = purchase?.items?.reduce(
    (acc, item) => acc + parseFloat(item?.final_amount),
    0
  );

  // pdf & print
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


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
        dispatch(purchaseDelete(sendData, Navigate)).then(() => {
          setCallApi((preState) => !preState);
        });
      } else {
        dispatch(purchasesStatus(sendData)).then(() => {
          setCallApi((preState) => !preState);
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  return (
    <>
      {(purchaseDelete?.loading || purchaseStatus?.loading) && <MainScreenFreezeLoader />}
      {purchaseDetail?.loading ? (
        <Loader02 />
      ) : (
        <div ref={componentRef}>
          <div id="Anotherbox" className="formsectionx1">
            <div id="leftareax12">
              <h1 id="firstheading">{purchase?.purchase_order_id}</h1>
            </div>
            <div id="buttonsdata">

              {purchase?.status == 1 ? (
                ""
              ) : (
                <div
                  className="mainx1"
                  onClick={() => handleEditThing("edit")}
                  data-tooltip-place="bottom"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Edit"
                >
                  <img src="/Icons/pen-clip.svg" alt="" />
                  <p>Edit</p>
                </div>
              )}
              <div
                onClick={() => setShowDropdownx1(!showDropdownx1)}
                className="mainx1"
                ref={dropdownRef1}
              >
                <p>PDF/Print</p>
                {otherIcons?.arrow_svg}
                {showDropdownx1 && (
                  <div className="dropdownmenucustom">
                    <div
                      className="dmncstomx1 primarycolortext"
                      onClick={() => generatePDF(purchase?.items)}
                    >
                      {otherIcons?.pdf_svg}
                      PDF
                    </div>
                    <div
                      className="dmncstomx1 primarycolortext"
                      onClick={handlePrint}
                    >
                      {otherIcons?.print_svg}
                      Print
                    </div>
                  </div>
                )}
              </div>

              <div className="sepc15s63x63"></div>
              <div onClick={() => setShowDropdown(!showDropdown)} className="mainx2" ref={dropdownRef2}>
                <img src="/Icons/menu-dots-vertical.svg" alt="" data-tooltip-id="my-tooltip" data-tooltip-content="More Options" data-tooltip-place='bottom' />
                {showDropdown && (
                  <ShowDropdownContent quotation={purchase}
                    changeStatus={changeStatus}
                  />
                )}
              </div>

              <Link
                to={"/dashboard/purchase"}
                className="linkx3"
                data-tooltip-place="bottom"
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Close"
              >
                <RxCross2 />
              </Link>
            </div>
          </div>

          <div className="listsectionsgrheigh" id="quotation-content">
            {purchase?.status === "1" && (
              <div className="commonquoatjkx54s">
                <div className="firstsecquoatjoks45">
                  <div className="detailsbox4x15sfirp">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/9329/9329876.png"
                      alt=""
                    />
                  </div>
                  <div className="detailsbox4x15s">
                    <h2>Convert and Sent the Purchase Order</h2>
                    <p>
                      Create GRN for this estimate to confirm the sale and bill
                      your customer.
                    </p>
                    <button onClick={() => setShowDropdownx2(!showDropdownx2)} ref={dropdownRef}>Convert {otherIcons?.arrow_svg}
                      {showDropdownx2 && (
                        <div className="dropdownmenucustom5sc51s">
                          <div
                            className="dmncstomx1 btextcolor"
                            onClick={() => handleEditThing("purchase_to_grn")}
                          >
                            {otherIcons?.print_svg}
                            GRN
                          </div>
                          <div
                            className="dmncstomx1 btextcolor"
                            onClick={() =>
                              handleEditThing("purchase_to_bill")
                            }
                          >
                            {otherIcons?.pdf_svg}
                            Bill
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="commonquoatjkx55s">
              <div className="childommonquoatjkx55s">
                <ShowAllStatusPurchase quotation={purchase} />
                <div className="detailsbox4x15s1">
                  <div className="xhjksl45s">
                    <svg
                      width="24"
                      height="23"
                      viewBox="0 0 19 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16.7582 0.894043L18.8566 4.51588L16.7582 8.13771H12.5615L10.4631 4.51588L12.5615 0.894043L16.7582 0.894043Z" />
                      <path d="M6.29509 0.894043L13.5963 13.4842L11.4979 17.1061H7.30116L0 4.51588L2.09836 0.894043L6.29509 0.894043Z" />
                    </svg>
                    <p>Accounts</p>
                  </div>
                  <div className="xhjksl45s2">
                    <h1>PURCHASE ORDER</h1>
                    <span>
                      <p>Purchase Order No:</p>
                      <h3>{purchase?.purchase_order_id}</h3>
                    </span>
                    <span>
                      <p>Purchase Date:</p>
                      <h3>{formatDate4(purchase?.transaction_date)}</h3>
                    </span>
                  </div>
                </div>
                <br />

                <FromToDetails
                  quotation={purchase?.vendor}
                  section="Purchase Order"
                />
                <ItemDetailTable itemsData={purchase} />
              </div>
            </div>

            <MoreInformation
              sale={purchase?.sale_person}
              note={purchase?.vendor_note}
              tc={purchase?.terms_and_condition}
              section="Vendor"
            />
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default PurchaseOrderDetails;
