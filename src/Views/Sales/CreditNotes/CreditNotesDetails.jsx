import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";
import { useDispatch, useSelector } from "react-redux";
import {
  creditNotesDelete,
  creditNotesDetails,
  CreditNotesStatus,
} from "../../../Redux/Actions/notesActions";
import Loader02 from "../../../Components/Loaders/Loader02";
import { quotationStatus } from "../../../Redux/Actions/quotationActions";
import MainScreenFreezeLoader from "../../../Components/Loaders/MainScreenFreezeLoader";
import { Toaster } from "react-hot-toast";

import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import useOutsideClick from "../../Helper/PopupData";
import { generatePDF } from "../../Helper/DateFormat";
import { FromToDetails, MoreInformation } from '../../Common/InsideSubModulesCommon/DetailInfo';
import ItemDetailTable from '../../Common/InsideSubModulesCommon/ItemDetailTable';

const CreditNotesDetails = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownx1, setShowDropdownx1] = useState(false);

  const creditDetails = useSelector((state) => state?.creditNoteDetail);
  const credit = creditDetails?.creditDetail?.data?.CreditNote;
  const creditNoteStatus = useSelector((state) => state?.creditNoteStatus);
  const creditDelete = useSelector((state) => state?.creditNoteDelete);

  const dateObject = new Date(credit?.created_at);
  const formattedDate = dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);
  useOutsideClick(dropdownRef, () => setShowDropdown(false));
  useOutsideClick(dropdownRef1, () => setShowDropdownx1(false));

  const UrlId = new URLSearchParams(location.search).get("id");

  const handleEditThing = (val) => {
    const queryParams = new URLSearchParams();
    queryParams.set("id", UrlId);

    if (val === "edit") {
      queryParams.set("edit", true);
      Navigate(`/dashboard/create-credit-note?${queryParams.toString()}`);
    } else if ("duplicate") {
      queryParams.set("duplicate", true);
      Navigate(`/dashboard/create-credit-note?${queryParams.toString()}`);
    }
  };

  const [callApi, setCallApi] = useState(false);
  const changeStatus = (statusVal) => {
    try {
      const sendData = {
        id: UrlId,
      };
      switch (statusVal) {
        case "accepted":
          sendData.status = 1;
          break;
        case "decline":
          sendData.status = 2;
          break;
        default:
      }

      if (statusVal === "delete") {
        dispatch(creditNotesDelete(sendData, Navigate));
      } else {
        dispatch(CreditNotesStatus(sendData)).then(() => {
          setCallApi((preState) => !preState);
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (UrlId) {
      const queryParams = {
        id: UrlId,
      };
      dispatch(creditNotesDetails(queryParams));
    }
  }, [dispatch, UrlId, callApi]);


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
      {(creditNoteStatus?.loading || creditDelete?.loading) && <MainScreenFreezeLoader />}
      {creditDetails?.loading ? (
        <Loader02 />
      ) : (
        <div ref={componentRef}>
          <div id="Anotherbox" className="formsectionx1">
            <div id="leftareax12">
              <h1 id="firstheading">{creditDetails?.credit_note_id}</h1>
            </div>
            <div id="buttonsdata">
              <div className="mainx1" onClick={() => handleEditThing("edit")}>
                <img src="/Icons/pen-clip.svg" alt="" />
                <p>Edit</p>
              </div>

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
                      onClick={() => generatePDF(invoice?.items)}
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

              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="mainx2"
                ref={dropdownRef}
              >
                <img src="/Icons/menu-dots-vertical.svg" alt="" />
                {showDropdown && (
                  <div className="dropdownmenucustom">
                    {credit?.status === "1" ? (
                      // <div className='dmncstomx1' onClick={() => changeStatus("decline")}>
                      //   {otherIcons?.cross_declined_svg}
                      //   Mark as declined
                      // </div>
                      <></>
                    ) : credit?.status === "2" ? (
                      <div
                        className="dmncstomx1"
                        onClick={() => changeStatus("accepted")}
                      >
                        {otherIcons?.check_accepted_svg}
                        Mark as accepted
                      </div>
                    ) : (
                      <>
                        <div
                          className="dmncstomx1"
                          onClick={() => changeStatus("decline")}
                        >
                          {otherIcons?.cross_declined_svg}
                          Mark as declined
                        </div>
                        <div
                          className="dmncstomx1"
                          onClick={() => changeStatus("accepted")}
                        >
                          {otherIcons?.check_accepted_svg}
                          Mark as accepted
                        </div>
                      </>
                    )}
                    <div
                      className="dmncstomx1"
                      onClick={() => handleEditThing("duplicate")}
                    >
                      {otherIcons?.duplicate_svg}
                      Duplicate
                    </div>
                    {/* <div className='dmncstomx1' >
                      {otherIcons?.convert_svg}
                      Convert</div> */}
                    <div
                      className="dmncstomx1"
                      style={{ cursor: "pointer" }}
                      onClick={() => changeStatus("delete")}
                    >
                      {otherIcons?.delete_svg}
                      Delete
                    </div>
                  </div>
                )}
              </div>

              <Link to={"/dashboard/credit-notes"} className="linkx3">
                <RxCross2 />
              </Link>
            </div>
          </div>
          <div className="listsectionsgrheigh">


            <div className="commonquoatjkx55s" >
              <div className="childommonquoatjkx55s">
                {/* <div className="labeltopleftx456">Sent</div> */}

                <div className=
                  {
                    credit?.status == 0 ? 'convertedClassName' : credit?.status == 1 ? 'approvedClassName' : credit?.status == 2 ? 'declinedClassName' : credit?.status == 3 ? 'sentClassName' : credit?.status == 4 ? 'convertedClassName' : 'defaultClassName'
                  }

                >
                  {credit?.status === "0" ? "Draft" : credit?.status === "1" ? "Approved" : credit?.status == "2" ? "Decline" : credit?.status == "3" ? "Pending" : credit?.status == "4" ? "Overdue" : ""
                  }


                </div>
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
                    <h1>Credit Note</h1>


                    <span><p style={{ width: "105px" }}>Credit Note No:</p> <h3>{credit?.credit_note_id}</h3></span>
                    <span><p style={{ width: "56px" }}>Bill Date:</p> <h3> {formattedDate}</h3></span>
                  </div>
                </div>

                {/* <div className="cjkls5xs1">
                  <h1>Credit to:</h1>
                  <h3>{credit?.customer_name}</h3>
                  <p>
                    {(() => {
                      try {
                        const address = JSON.parse(credit?.address || "{}");
                        const shipping = address?.shipping;
                        if (!shipping) return "Address not available";

                        const {
                          street_1,
                          street_2,
                          city_id,
                          state_id,
                          country_id,
                        } = shipping;
                        return `${street_1 || ""} ${street_2 || ""}, City ID: ${city_id || ""
                          }, State ID: ${state_id || ""}, Country ID: ${country_id || ""
                          }`;
                      } catch (error) {
                        console.error("Failed to parse address JSON:", error);
                        return "Address not available";
                      }
                    })()}
                  </p>
                </div> */}

                <FromToDetails quotation={credit?.customer} section="Credit Note" />
                <ItemDetailTable itemsData={credit} />


              </div>
            </div>

            <MoreInformation sale={credit?.sale_person} note={credit?.customer_note} tc={credit?.terms_and_condition} section="Customer" />
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default CreditNotesDetails;
