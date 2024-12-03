import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./SendMail.scss";
import {
  purchasesDetails,
  purchasesSendMail,
} from "../../Redux/Actions/purchasesActions";
import { useDispatch, useSelector } from "react-redux";
import {
  MultiImageUpload,
  MultiImageUploadEmail,
} from "../../Views/Helper/ComponentHelper/ImageUpload";
import MainScreenFreezeLoader from "../Loaders/MainScreenFreezeLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { BodyContent, SubjectContent } from "./ShowMailContent";
import { Toaster } from "react-hot-toast";
import { generatePDF1 } from "../../Views/Helper/DateFormat";
import { FaFilePdf } from "react-icons/fa";
import {
  quotationDetails,
  quotationSend,
} from "../../Redux/Actions/quotationActions";

import Loader02 from "../Loaders/Loader02";
import {
  saleOrderDetails,
  saleOrderSend,
} from "../../Redux/Actions/saleOrderActions";
import { orgnizationEmail } from "../../Views/Helper/HelperFunctions";
import { creditNotesDetails, creditnoteSend } from "../../Redux/Actions/notesActions";
import { paymentRecSend, paymentRecDetail } from "../../Redux/Actions/PaymentRecAction";
import { invoiceSend } from "../../Redux/Actions/invoiceActions";
const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ align: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const SendMail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [freezLoadingImg, setFreezLoadingImg] = useState(false);
  const [imgLoader, setImgeLoader] = useState("");
  const purchaseEmail = useSelector((state) => state?.purchseSend);
  const quotationEmail = useSelector((state) => state?.quoteSend);
  const saleSend = useSelector((state) => state?.saleSend);
  const quoteDetail = useSelector((state) => state?.quoteDetail);

  const data = location.state?.data || {};
  const [detail_api_data, setDetail_api_data] = useState(null);

  const [formData, setFormData] = useState({
    from: orgnizationEmail,
    to: "",
    subject: "",
    body: "",
    upload_documents: [],
  });
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPdfChecked, setIsPdfChecked] = useState(true);


  useEffect(() => {
    if (data?.transaction?.purchase_order_id) {
      dispatch(
        purchasesDetails({ id: data?.transaction?.id }, setDetail_api_data)
      );
    } else if (data?.quotation_id) {
      dispatch(quotationDetails({ id: data?.id }, setDetail_api_data));
    } else if (data?.sale_order_id) {
      dispatch(saleOrderDetails({ id: data?.id }, setDetail_api_data));

    } else if (data?.credit_note_id) {
      dispatch(creditNotesDetails({ id: data?.id }, setDetail_api_data));
    }
    else if (data?.payment_id) {
      dispatch(paymentRecDetail({ id: data?.id }, setDetail_api_data));
    }
    else if (data?.invoice_id) {
      setDetail_api_data(data);
    }
    else if (data?.purchase_order_id) {
      setDetail_api_data(data);
    }
    else if (data?.bill_no) {
      setDetail_api_data(data);
    }
    else if (data?.debit_note_id) {
      setDetail_api_data(data);
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (detail_api_data) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        to: detail_api_data?.email || "",
        subject: SubjectContent({ detail_api_data }) || "",
        body: BodyContent({ detail_api_data }) || "",
      }));
    }
  }, [detail_api_data]);

  useEffect(() => {
    const generateAndDisplayPDF = async () => {
      if (detail_api_data) {
        try {
          const url = await generatePDF1(detail_api_data.items);
          setPdfUrl(url);
        } catch (error) {
          console.error("Failed to generate PDF:", error);
        }
      }
    };

    generateAndDisplayPDF();
  }, [detail_api_data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleBodyChange = (value) => {
    setFormData((prevFormData) => ({ ...prevFormData, body: value }));
  };

  const handleSend = () => {
    try {
      const sendData = {
        id: detail_api_data?.id,
        from: formData.from,
        to_email: formData.to,
        subject: formData.subject,
        body: formData.body,
        upload_documents: JSON.stringify(formData.upload_documents),
      };

      if (detail_api_data?.purchase_order_id) {
        dispatch(purchasesSendMail(sendData, navigate));
      } else if (detail_api_data?.quotation_id) {
        dispatch(quotationSend(sendData, navigate));
      }
      else if (detail_api_data?.sale_order_id) {
        dispatch(saleOrderSend(sendData, navigate));
      } else if (detail_api_data?.credit_note_id) {
        dispatch(creditnoteSend(sendData, navigate));
      }
      else if (detail_api_data?.payment_id) {
        dispatch(paymentRecSend(sendData, navigate));
      }
      else if (detail_api_data?.invoice_id) {
        dispatch(invoiceSend(sendData, navigate))
      }
      else if (detail_api_data?.purchase_order_id) {
        dispatch(purchasesSendMail(sendData, navigate))
      }
      // else if (detail_api_data?.purchase_order_id) {
      //   dispatch(purchasesSendMail(sendData, navigate))
      // }

      // else if (detail_api_data?.bill_no) {
      //   dispatch(purchasesSendMail(sendData, navigate))
      // }

    } catch (e) {
      console.error("Error sending email:", e);
    }
  };

  const handleCancel = (data) => {
    if (data?.purchase_order_id) {
      navigate("/dashboard/purchase");
    } else if (data?.quotation_id) {
      navigate("/dashboard/quotation");
    } else if (data?.invoice_id) {
      navigate("/dashboard/invoices");
    } else if (data?.credit_note_id) {
      navigate("/dashboard/credit-note");
    }
    else if (data?.payment_id) {
      navigate("/dashboard/payment-recieved");
    }
    else if (data?.debit_note_id) {
      navigate("/dashboard/debit-notes");
    }
  };
  const handleCheckboxChange = (e) => {
    setIsPdfChecked(e.target.checked);
  };

  return (
    <div className='formsectionsgrheigh'>
      <div id="Anotherbox" className='formectionx2send'>
        <div id="leftareax12">
          <h1 id="firstheading">
            <svg id="fi_2625867" height="512" viewBox="0 0 60 60" width="512" xmlns="http://www.w3.org/2000/svg"><g fill="#346d92"><path d="m14 2.014v2.019a.994.994 0 0 1 -.87.99 9 9 0 0 0 -5.67 3 6 6 0 1 1 -6.46 5.977 13.041 13.041 0 0 1 11.9-13 1.011 1.011 0 0 1 1.1 1.014z"></path><path d="m30 2.014v2.019a.994.994 0 0 1 -.87.99 9 9 0 0 0 -5.67 3 6 6 0 1 1 -6.46 5.977 13.041 13.041 0 0 1 11.9-13 1.011 1.011 0 0 1 1.1 1.014z"></path><path d="m46 57.986v-2.019a.994.994 0 0 1 .87-.99 9 9 0 0 0 5.67-3 6 6 0 1 1 6.46-5.977 13.041 13.041 0 0 1 -11.9 13 1.011 1.011 0 0 1 -1.1-1.014z"></path><path d="m30 57.986v-2.019a.994.994 0 0 1 .87-.99 9 9 0 0 0 5.67-3 6 6 0 1 1 6.46-5.977 13.041 13.041 0 0 1 -11.9 13 1.011 1.011 0 0 1 -1.1-1.014z"></path></g><circle cx="19" cy="30" fill="#b9bfcc" r="3"></circle><circle cx="30" cy="30" fill="#b9bfcc" r="3"></circle><circle cx="41" cy="30" fill="#b9bfcc" r="3"></circle><path d="m59.707 28.293a1 1 0 0 0 -1.414 0l-1.293 1.293v-9.586a10.011 10.011 0 0 0 -10-10h-9a1 1 0 0 0 0 2h9a8.009 8.009 0 0 1 8 8v9.586l-1.293-1.293a1 1 0 0 0 -1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0 0-1.414z" fill="#ccd0da"></path><path d="m22 48h-9a8.009 8.009 0 0 1 -8-8v-9.586l1.293 1.293a1 1 0 1 0 1.414-1.414l-3-3a1 1 0 0 0 -1.414 0l-3 3a1 1 0 0 0 1.414 1.414l1.293-1.293v9.586a10.011 10.011 0 0 0 10 10h9a1 1 0 0 0 0-2z" fill="#ccd0da"></path></svg>
            Email To:{" "}
            {`${detail_api_data?.customer?.first_name || ""} ${detail_api_data?.customer?.last_name || ""
              }`}

          </h1>
        </div>
      </div>

      {quoteDetail?.loading ? (
        <Loader02 />
      ) : (
        <>
          <div id="formofcreateitems2" style={{
            padding: "12px 20px",
            lineHeight: 2,
            width: "60vw",
            marginTop: "7%"
          }}>

            {freezLoadingImg && <MainScreenFreezeLoader />}
            {(quotationEmail?.loading || purchaseEmail?.loading || saleSend?.loading) && <MainScreenFreezeLoader />}

            {/* <h1 id='EmailHeading'>Email To: {${detail_api_data?.customer?.first_name || ""} ${detail_api_data?.customer?.cusData?.last_name || ""}}</h1>
            <hr style={{marginBottom:"20px",width:"930px"}} /> */}

            {detail_api_data && (
              <>
                <div
                  className="section"
                  style={{
                    border: "1px solid #d3d3d3",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  <div
                    className="input-group"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        textAlign: "center",
                        alignItems: "center",
                      }}
                    >
                      <label>From</label>
                      <h3 style={{ marginLeft: "22px" }}>:</h3>
                      <span style={{ marginLeft: "6px" }}>
                        {" "}
                        {formData?.from}
                      </span>
                    </div>

                    {/* <input
                      type="email"
                      name="from"
                      value= {formData.from}
                      onChange={handleChange}
                      readOnly
                    /> */}

                  </div>
                  <hr style={{ border: "1px solid #d3d3d3" }} />

                  <div
                    className="input-group"
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      textAlign: "center",
                    }}
                  >
                    <label>Send To</label>
                    <h3>:</h3>
                    <input
                      type="email"
                      name="to"
                      value={formData.to}
                      onChange={handleChange}
                      style={{ border: "none", background: "#e8e1e1" }}
                    />
                  </div>
                  <hr style={{ border: "1px solid #d3d3d3" }} />
                  <div
                    className="input-group"
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      textAlign: "center",
                    }}
                  >
                    <label style={{ width: "63px" }}>Subject</label>
                    <h3>:</h3>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      style={{ border: "none", background: "#e8e1e1" }}
                    />
                  </div>
                </div>
                <div className="section">
                  <div style={{ marginBottom: "10px", borderRadius: "8px" }}>
                    <label>Mail Body:</label>
                  </div>

                  <div style={{ height: "410px" }}>
                    <ReactQuill
                      value={formData.body}
                      onChange={handleBodyChange}
                      modules={modules}
                      style={{ height: '351px', }} /* Applies to the entire editor */
                    />
                  </div>
                </div>


                <div
                  className="section"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "20px",
                    backgroundColor: "rgb(200 214 227)",
                    // marginRight: "10px",
                  }}
                >
                  <div style={{ paddingTop: "7px" }}>
                    <input
                      type="checkbox"
                      checked={isPdfChecked}
                      onChange={handleCheckboxChange}
                      style={{ marginRight: "5px" }}
                    />
                    Attached Quote PDF
                  </div>
                  {isPdfChecked && pdfUrl && (
                    <div className="pdf-download" style={{ gap: "5px", borderRadius: "8px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon align-text-bottom" width="25" height="25" onClick={() => window.open(pdfUrl, "_blank")}
                        id="FaFilePDF"
                        title="Click to view/download PDF"><path fill="#F91D0A" d="M349.3 302.3c-12.5-7.2-25.4-15-35.4-24.5-27.1-25.4-49.8-60.6-63.9-99.2.9-3.6 1.7-6.8 2.4-10.1 0 0 15.3-86.9 11.3-116.2-.6-4-.9-5.2-2-8.3l-1.3-3.4c-4.2-9.6-12.3-20.8-25.1-20.2l-7.5-1.2h-.2c-14.3 0-25.9 8.3-28.9 19.2-9.3 34.2.3 85.8 17.6 152.1l-4.4 11c-12.4 30.3-28 60.9-41.7 87.8l-1.8 3.6c-14.4 28.3-27.6 52.3-39.4 72.6l-12.3 6.5c-.9.5-21.9 11.6-26.8 14.5-41.8 25-69.5 53.3-74.2 75.9-1.4 7.2-.4 16.4 7.1 20.6l11.9 6c5.1 2.6 10.6 3.9 16.1 3.9 29.8 0 64.4-37.1 112-120.2 55-18 117.6-32.8 172.5-41 41.8 23.5 93.3 39.9 125.8 39.9 5.8 0 10.7-.6 14.8-1.6 6.2-1.6 11.5-5.2 14.7-10 6.3-9.5 7.6-22.5 5.9-36-.5-4-3.7-8.9-7.1-12.2-9.6-9.5-31-14.5-63.5-14.9-22.3-.4-48.8 1.5-76.6 5.4zM44.2 470.2c5.4-14.8 26.9-44.2 58.7-70.3 2-1.6 6.9-6.2 11.4-10.5-33.2 53.1-55.5 74.2-70.1 80.8zM232.5 36.5c9.6 0 15 24.1 15.5 46.8.4 22.6-4.9 38.5-11.4 50.3-5.4-17.4-8.1-44.8-8.1-62.8 0 0-.4-34.3 4-34.3zm-56.2 309.1c6.7-11.9 13.6-24.6 20.7-37.9 17.3-32.7 28.2-58.3 36.3-79.3 16.2 29.4 36.3 54.4 60 74.5 3 2.5 6.1 5 9.4 7.5-48.1 9.5-89.7 21.1-126.4 35.2zm289.2-17.8c17.1 4.3 17.3 13.2 14.4 15.1-2.9 1.8-11.3 2.9-16.7 2.9-17.4 0-39-8-69.3-21 11.6-.9 22.3-1.3 31.8-1.3 17.5 0 22.7 0 39.8 4.3z"></path ></svg>
                      <input
                        type="text"
                        style={{
                          border: "1px solid #d3d3d3",
                          padding: "10px",
                          width: "250px",
                          borderRadius: "8px"
                        }}
                        readOnly
                        value={formData.subject}
                      />
                    </div>
                  )}
                </div>
                <div className="section file-upload" id="imgurlanddesc">

                  <MultiImageUploadEmail
                    formData={formData}
                    setFormData={setFormData}
                    setFreezLoadingImg={setFreezLoadingImg}
                    imgLoader={imgLoader}
                    setImgeLoader={setImgeLoader}
                    setImage={true}
                    pdfUrl={pdfUrl}
                    isPdfChecked={isPdfChecked}
                  />

                </div>
                <div className="buttons">
                  <button onClick={handleSend}>Send</button>
                  <button onClick={() => handleCancel(detail_api_data)}>
                    Cancel
                  </button>
                </div>
              </>
            )}
            <Toaster />
          </div>
        </>
      )}
    </div>
  );
};

export default SendMail;
