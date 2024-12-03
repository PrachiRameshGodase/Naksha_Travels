import React, { useState, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
// import './Customer.scss';
import CustomerAddress from "../Customer/CustomerAddress";
import CustomerContactDetail from "../Customer/CustomerContactDetail";
import DisableEnterSubmitForm from "../../Helper/DisableKeys/DisableEnterSubmitForm";
import MainScreenFreezeLoader from "../../../Components/Loaders/MainScreenFreezeLoader";
import {
  createVerndors,
  vendorssView,
} from "../../../Redux/Actions/vendonsActions";
import { MdOutlineDeleteForever } from "react-icons/md";
import VendorBasicDetails from "./VendorBasicDetails";
import BankDetails from "./BankDetails";
import { MultiImageUpload } from "../../Helper/ComponentHelper/ImageUpload";
import { OverflowHideBOdy } from "../../../Utils/OverflowHideBOdy";
const CreateVendors = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const popupRef = useRef(null);
  const customer = useSelector((state) => state?.createVendor);
  const user = useSelector((state) => state?.vendorView?.data?.user || {});
  const [switchCusData, setSwitchCusData] = useState("Basic");
  const [freezLoadingImg, setFreezLoadingImg] = useState(false);
  const [imgLoader, setImgeLoader] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const {
    id: cusId,
    edit: isEdit,
    duplicate: isDuplicate,
  } = Object.fromEntries(params.entries());
  const [uploadTick, setUploadTick] = useState(false);
  // const contactTick = localStorage.getItem("contact");
  // for basic details tick mark
  const [tick, setTick] = useState({
    basicTick: false,
    addressTick: false,
    bankTick: false,
    contactTick: false,
  });

  const [contactTick, setContactTick] = useState(false);
  const dropdownRef1 = useRef();
  // all submit data of create customer
  const [userData, setUserData] = useState({
    remarks: "",
  });

  const handleRemarksChange = (e) => {
    const { value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      remarks: value,
    }));
  };

  // for set remark data when  duplicate or update
  useEffect(() => {
    if ((user?.id && isEdit) || (user?.id && isDuplicate)) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        remarks: user?.remarks,
        upload_documents: user?.upload_documents
          ? JSON.parse(user?.upload_documents)
          : [],
      }));
    }
  }, [user?.remarks]);

  //fetch all seperate components state data
  const updateUserData = (newUserData) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      ...newUserData,
    }));
  };
  useEffect(() => {
    if (userData?.upload_documents?.length >= 1) {
      setUploadTick(true);
    } else {
      setUploadTick(false);
    }
  }, [userData?.upload_documents]);
  const handleSubmit = (e) => {
    e.preventDefault(); // Add this line to prevent form submission
    if (!tick?.basicTick) {
      dropdownRef1.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      dropdownRef1.current.focus();
    } else {
      if (cusId && isEdit) {
        dispatch(
          createVerndors(
            { ...userData, id: cusId, is_vendor: 1 },
            Navigate,
            "edit"
          )
        );
      } else if (cusId && isDuplicate) {
        dispatch(
          createVerndors(
            { ...userData, id: 0, is_vendor: 1 },
            Navigate,
            "duplicate"
          )
        );
      } else {
        dispatch(createVerndors({ ...userData, id: 0, is_vendor: 1 }, Navigate));
      }
    };
  }
  useEffect(() => {
    if ((cusId && isEdit) || (cusId && isDuplicate)) {
      const queryParams = {
        user_id: cusId,
        fy: localStorage.getItem("FinancialYear"),
        warehouse_id: localStorage.getItem("selectedWarehouseId"),
      };
      dispatch(vendorssView(queryParams));
    }
  }, [dispatch, cusId]);

  const handleNextClick = () => {
    if (switchCusData === "Basic") {
      setSwitchCusData("Address");
    } else if (switchCusData === "Address") {
      setSwitchCusData("Contact");
    } else if (switchCusData === "Contact") {
      setSwitchCusData("Bank");
    } else if (switchCusData === "Bank") {
      setSwitchCusData("Remark");
    } else if (switchCusData === "Remark") {
      setSwitchCusData("Upload Image/Document");
    }
  };

  const handleDeleteImage = (imageUrl) => {
    const updatedUploadDocuments = userData.upload_documents.filter(
      (doc) => Object.values(doc)[0] !== imageUrl
    );
    setUserData((prevUserData) => ({
      ...prevUserData,
      upload_documents: updatedUploadDocuments,
    }));
  };

  const [showPopup, setShowPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const showimagepopup = (imageUrl) => {
    setSelectedImage(imageUrl);
    OverflowHideBOdy(true); // Set overflow hidden
    setShowPopup(true); // Show the popup
  };
  return (
    <>
      {customer?.loading && <MainScreenFreezeLoader />}
      {customer?.loading && <MainScreenFreezeLoader />}

      <TopLoadbar />
      <div id="Anotherbox" className="formsectionx2">
        <div id="leftareax12">
          <h1 id="firstheading">
            <svg
              id="fi_12371422"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 1"
            >
              <path
                d="m467.112 38.078a75.38 75.38 0 1 0 0 106.6 75.382 75.382 0 0 0 0-106.6zm-90.243 56.69a5.747 5.747 0 0 1 7.83-8.415l19.924 18.566 38.1-39.118a5.744 5.744 0 0 1 8.235 8.01l-41.93 43.058a5.749 5.749 0 0 1 -8.123.292zm-252.005-15.326v-.022a44.081 44.081 0 0 0 -43.583 44.5l.023.045h-.024a44.081 44.081 0 0 0 44.5 43.584l.045-.023v.022a44.079 44.079 0 0 0 43.582-44.5l-.022-.045h.022a44.079 44.079 0 0 0 -44.5-43.582l-.044.023zm0-11.521v.023a55.564 55.564 0 0 1 56.036 55.056h-.022a55.564 55.564 0 0 1 -55.058 56.04v-.022a55.564 55.564 0 0 1 -56.041-55.059h.021a55.566 55.566 0 0 1 55.058-56.041zm29.882-15.309a76.592 76.592 0 0 1 12.493 6.6 5.745 5.745 0 0 0 6.339-.054l.006.009 15.027-10.171 11.146 10.934-10.073 15.51a5.745 5.745 0 0 0 .066 6.357 76.391 76.391 0 0 1 10.662 25.838 5.747 5.747 0 0 0 4.545 4.474l17.8 3.43.151 15.607-18.085 3.854a5.751 5.751 0 0 0 -4.481 4.685c-1.633 8.589-5.98 18.408-10.725 25.694a5.741 5.741 0 0 0 .054 6.339l-.009.006 10.171 15.027-10.933 11.149-15.514-10.071a5.743 5.743 0 0 0 -6.357.066 76.391 76.391 0 0 1 -25.838 10.662 5.746 5.746 0 0 0 -4.474 4.545l-3.43 17.8-15.606.15-3.848-18.084a5.752 5.752 0 0 0 -4.685-4.481c-8.588-1.633-18.41-5.981-25.7-10.726a5.745 5.745 0 0 0 -6.592.235l-14.766 9.99-11.16-10.947 10.07-15.514a5.743 5.743 0 0 0 -.066-6.357 76.379 76.379 0 0 1 -10.661-25.838 5.747 5.747 0 0 0 -4.546-4.474l-17.8-3.43-.151-15.607 18.085-3.847a5.754 5.754 0 0 0 4.482-4.685c1.635-8.587 5.982-18.412 10.726-25.697a5.741 5.741 0 0 0 -.054-6.339l.009-.006-10.172-15.029 10.934-11.147 15.514 10.069a5.743 5.743 0 0 0 6.357-.066 76.391 76.391 0 0 1 25.843-10.662 5.747 5.747 0 0 0 4.474-4.546l3.43-17.8 15.606-.151 3.847 18.087a5.752 5.752 0 0 0 4.685 4.482 75.908 75.908 0 0 1 13.2 4.129zm-49.379 213.121v57.6l16.24-11.8a5.753 5.753 0 0 1 6.849-.073l16.862 12.251v-57.978zm-57.492 176.187a5.761 5.761 0 0 1 0-11.521h43.232a5.761 5.761 0 1 1 0 11.521zm0-26.45a5.76 5.76 0 1 1 0-11.52h43.232a5.76 5.76 0 1 1 0 11.52zm287.219-193.919c-7.5-8.364-18.416-12.585-31.026-12.585-12.915 0-24.861 4.41-33.207 13.151-18.494 19.368-14.585 56.521 1.056 76.8 17.081 22.145 44.094 22.145 61.174 0 8.24-10.683 13.338-25.54 13.338-42.038 0-15.628-4.236-27.408-11.335-35.326zm-160.052 249.249h-148.323a3.935 3.935 0 0 1 -3.909-3.909v-197.249a3.935 3.935 0 0 1 3.909-3.909h67.128v68.891h.008a5.776 5.776 0 0 0 9.127 4.658l22.1-16.056 22.367 16.251a5.76 5.76 0 0 0 9.39-4.473v-69.271h67.128a3.935 3.935 0 0 1 3.909 3.909v89.967a75.879 75.879 0 0 0 -52.833 72.074v39.117zm11.52 25.2h42.087v-30.515a5.761 5.761 0 0 1 11.521 0v30.515h124.666v-30.515a5.76 5.76 0 0 1 11.52 0v30.515h42.088v-64.317a64.281 64.281 0 0 0 -64.079-64.077h-103.722a64.282 64.282 0 0 0 -64.081 64.077z"
                fill="#3a8aaa"
                fill-rule="evenodd"
              ></path>
            </svg>
            {cusId && isDuplicate ? (
              "Duplicate Vendor"
            ) : (
              <>{cusId && isEdit ? "Update Vendor" : "New Vendor"}</>
            )}
          </h1>
        </div>
        <div id="buttonsdata">
          <Link to={"/dashboard/vendors"} className="linkx3">
            <RxCross2 />
          </Link>
        </div>
      </div>

      <div className="ccfz1 formsectionx1">
        <div className="insideccfz1">
          <button
            className={`type-button ${switchCusData === "Basic" && "selectedbtnx2"
              }`}
            onClick={() => setSwitchCusData("Basic")}
          >
            (1) Basic Details{" "}
            {tick?.basicTick && (
              <svg
                className="absiconofx56"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={18}
                height={18}
                color={"#cdcdcd"}
                fill={"none"}
              >
                <path
                  d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 12.5L10.5 15L16 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <button
            className={`type-button ${tick?.basicTick ? "" : ""}  ${switchCusData === "Address" && "selectedbtnx2"
              }`}
            onClick={() => setSwitchCusData("Address")}
          >
            (2) Address{" "}
            {tick?.addressTick && (
              <svg
                className="absiconofx56"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={18}
                height={18}
                color={"#cdcdcd"}
                fill={"none"}
              >
                <path
                  d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 12.5L10.5 15L16 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <button
            className={`type-button ${tick?.basicTick && tick?.addressTick ? "" : ""
              } ${switchCusData === "Contact" && "selectedbtnx2"}`}
            onClick={() => setSwitchCusData("Contact")}
          >
            (3) Contact Persons{" "}
            {contactTick && (
              <svg
                className="absiconofx56"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={18}
                height={18}
                color={"#cdcdcd"}
                fill={"none"}
              >
                <path
                  d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 12.5L10.5 15L16 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <button
            className={`type-button ${tick?.basicTick &&
              tick?.addressTick &&
              contactTick &&
              tick?.addressTick
              ? ""
              : ""
              } ${switchCusData === "Bank" && "selectedbtnx2"}`}
            onClick={() => setSwitchCusData("Bank")}
          >
            (4) Bank Details
            {tick?.bankTick && (
              <svg
                className="absiconofx56"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={18}
                height={18}
                color={"#cdcdcd"}
                fill={"none"}
              >
                <path
                  d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 12.5L10.5 15L16 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <button
            className={`type-button ${tick?.basicTick &&
              tick?.addressTick &&
              contactTick &&
              tick?.bankTick
              ? ""
              : ""
              } ${switchCusData === "Remark" && "selectedbtnx2"}`}
            onClick={() => setSwitchCusData("Remark")}
          >
            (5) Remarks{" "}
            {userData?.remarks && (
              <svg
                className="absiconofx56"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={18}
                height={18}
                color={"#cdcdcd"}
                fill={"none"}
              >
                <path
                  d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 12.5L10.5 15L16 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <button
            className={`type-button ${tick?.basicTick &&
              tick?.basicTick &&
              tick?.addressTick &&
              contactTick &&
              tick?.bankTick &&
              tick.remarkTick
              ? ""
              : ""
              } ${switchCusData === "Upload Image/Document" && "selectedbtnx2"}`}
            onClick={() => setSwitchCusData("Upload Image/Document")}
          >
            (5) Upload Image/Document{" "}
            {uploadTick && (
              <svg
                className="absiconofx56"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={18}
                height={18}
                color={"#cdcdcd"}
                fill={"none"}
              >
                <path
                  d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 12.5L10.5 15L16 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* form Data */}
      <div id="formofcreateitems">
        <form onSubmit={handleSubmit}>
          <div className="itemsformwrap">
            <div id="">
              {/* main forms */}
              <VendorBasicDetails
                switchCusData={switchCusData}
                customerData={{ user, isEdit, isDuplicate }}
                setTick={setTick}
                tick={tick}
                updateUserData={updateUserData}
                dropdownRef1={dropdownRef1}
              />

              <CustomerAddress
                switchCusData={switchCusData}
                setTick={setTick}
                tick={tick}
                customerData={{ user, isEdit, isDuplicate }}
                updateUserData={updateUserData}
              />

              <CustomerContactDetail
                switchCusData={switchCusData}
                customerData={{ user, isEdit, isDuplicate }}
                userData={userData}
                setUserData={setUserData}
                updateUserData={updateUserData}
                // setTick={setTick}
                contactTick={contactTick}
                setContactTick={setContactTick}
              // tick={tick}
              />

              <BankDetails
                switchCusData={switchCusData}
                customerData={{ user, isEdit, isDuplicate }}
                userData={userData}
                setUserData={setUserData}
                updateUserData={updateUserData}
                setTick={setTick}
                tick={tick}
              />

              {switchCusData === "Remark" && (
                <>
                  <div id="secondx2_customer">
                    <div className="iconheading">
                      <svg
                        width="35"
                        height="35"
                        viewBox="0 0 35 35"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_2162_1003)">
                          <path
                            d="M22.9131 29.2736L20.1978 9.83819C20.1675 9.6241 20.0224 9.44384 19.8198 9.3686L9.25972 5.45472C8.96171 5.3366 8.62437 5.48244 8.50626 5.78045C8.5036 5.78718 8.50104 5.794 8.49859 5.80085L1.77285 23.5537C1.65599 23.857 1.80714 24.1977 2.1105 24.3146C2.11492 24.3163 2.1194 24.3179 2.12384 24.3195L21.593 31.4613L21.6582 31.4771C21.954 31.5502 22.2567 31.3855 22.3559 31.0975L22.8893 29.5465C22.9187 29.4587 22.9268 29.3652 22.9131 29.2736Z"
                            fill="#FFA000"
                          />
                          <path
                            d="M31.3864 11.348C31.4258 11.0253 31.1961 10.7318 30.8733 10.6924C30.8716 10.6922 30.87 10.692 30.8683 10.6918L25.8078 10.0783L10.8619 8.26555C10.5422 8.22548 10.2497 8.44993 10.2056 8.76911L7.48462 27.4926C7.44101 27.7941 7.63468 28.0791 7.93111 28.1496L7.99633 28.1654L28.5748 30.7303C28.8974 30.7704 29.1915 30.5413 29.2316 30.2187C29.2319 30.2162 29.2322 30.2138 29.2325 30.2113L31.3864 11.348Z"
                            fill="#FFE082"
                          />
                          <path
                            d="M21.8116 13.3427C21.4955 13.2667 21.3009 12.9488 21.3769 12.6327C21.4135 12.4803 21.5094 12.3488 21.6434 12.2673L25.1972 10.1001C25.4718 9.92609 25.8355 10.0075 26.0096 10.2822C26.1837 10.5568 26.1022 10.9204 25.8276 11.0945C25.8218 11.0982 25.816 11.1017 25.8101 11.1052L22.2563 13.2724C22.1232 13.3538 21.9633 13.3791 21.8116 13.3427Z"
                            fill="#455A64"
                          />
                          <path
                            d="M26.9465 12.1624C28.5263 12.5453 30.1175 11.5751 30.5004 9.99524C30.8833 8.41541 29.913 6.82429 28.3332 6.44138C26.7534 6.05846 25.1622 7.02875 24.7793 8.60857C24.3964 10.1884 25.3667 11.7795 26.9465 12.1624Z"
                            fill="#F44336"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2162_1003">
                            <rect
                              width="28.2614"
                              height="28.2614"
                              fill="white"
                              transform="translate(7.4375 0.164062) rotate(13.6245)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      <p>Remarks</p>
                    </div>

                    <div id="main_forms_desigin_cus">
                      <textarea
                        value={userData?.remarks}
                        onChange={handleRemarksChange}
                        cols="140"
                        rows="5"
                        placeholder="Remarks ( for internal use )"
                        className="textareacustomcbs"
                      ></textarea>
                    </div>
                  </div>
                </>
              )}
              {switchCusData === "Upload Image/Document" && (
                <>
                  <div id="secondx2_customer">
                    <div className="form_commonblock">
                      <div id="inputx1">
                        <div id="imgurlanddesc">
                          <MultiImageUpload
                            formData={userData}
                            setFormData={setUserData}
                            setFreezLoadingImg={setFreezLoadingImg}
                            imgLoader={imgLoader}
                            setImgeLoader={setImgeLoader}
                            setUploadTick={setUploadTick}
                            isUploading={isUploading}
                            setIsUploading={setIsUploading}
                            setImage={false}
                          />
                        </div>
                      </div>
                      {isUploading && (
                        <div
                          className="upload-loader"
                          style={{
                            textAlign: "center",
                            color: "blue",
                            marginTop: "10px",
                          }}
                        >
                          Uploading...
                        </div>
                      )}
                    </div>
                    <div className="uploaded-images-grid">
                      {userData?.upload_documents?.map((doc, index) => {
                        const imageUrl = Object.values(doc)[0]; // Extract the URL
                        const imageName = doc.name;
                        const truncatedName =
                          imageName.length > 20
                            ? imageName.slice(0, 17) + "..."
                            : imageName;
                        const fileExtension = imageName
                          .split(".")
                          .pop()
                          .toLowerCase();

                        const isIamge = [
                          "jpg",
                          "jpeg",
                          "png",
                          "gif",
                        ].includes(fileExtension);

                        // Function to return the appropriate icon or image
                        const renderFilePreview = () => {
                          if (isIamge) {
                            return (
                              <img
                                src={imageUrl}
                                alt={`Uploaded ${index + 1}`}
                                className="uploaded-image"
                                onClick={() => showimagepopup(imageUrl)}
                              />
                            );
                          } else if (fileExtension === "pdf") {
                            return (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 32 32"
                              >
                                <path
                                  fill="#909090"
                                  d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z"
                                />
                                <path
                                  fill="#f4f4f4"
                                  d="M24.031 2H8.808v27.928h20.856V7.873z"
                                />
                                <path
                                  fill="#7a7b7c"
                                  d="M8.655 3.5h-6.39v6.827h20.1V3.5z"
                                />
                                <path
                                  fill="#dd2025"
                                  d="M22.472 10.211H2.395V3.379h20.077z"
                                />
                                <path
                                  fill="#464648"
                                  d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892"
                                />
                                <path
                                  fill="#dd2025"
                                  d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035"
                                />
                                <path
                                  fill="#909090"
                                  d="M23.954 2.077V7.95h5.633z"
                                />
                                <path
                                  fill="#f4f4f4"
                                  d="M24.031 2v5.873h5.633z"
                                />
                                <path
                                  fill="#fff"
                                  d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892"
                                />
                              </svg>
                            );
                          } else if (
                            ["doc", "docx"].includes(fileExtension)
                          ) {
                            return (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 32 32"
                              >
                                <defs>
                                  <linearGradient
                                    id="vscodeIconsFileTypeWord0"
                                    x1="4.494"
                                    x2="13.832"
                                    y1="-1712.086"
                                    y2="-1695.914"
                                    gradientTransform="translate(0 1720)"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop offset="0" stop-color="#2368c4" />
                                    <stop offset=".5" stop-color="#1a5dbe" />
                                    <stop offset="1" stop-color="#1146ac" />
                                  </linearGradient>
                                </defs>
                                <path
                                  fill="#41a5ee"
                                  d="M28.806 3H9.705a1.19 1.19 0 0 0-1.193 1.191V9.5l11.069 3.25L30 9.5V4.191A1.19 1.19 0 0 0 28.806 3"
                                />
                                <path
                                  fill="#2b7cd3"
                                  d="M30 9.5H8.512V16l11.069 1.95L30 16Z"
                                />
                                <path
                                  fill="#185abd"
                                  d="M8.512 16v6.5l10.418 1.3L30 22.5V16Z"
                                />
                                <path
                                  fill="#103f91"
                                  d="M9.705 29h19.1A1.19 1.19 0 0 0 30 27.809V22.5H8.512v5.309A1.19 1.19 0 0 0 9.705 29"
                                />
                                <path
                                  d="M16.434 8.2H8.512v16.25h7.922a1.2 1.2 0 0 0 1.194-1.191V9.391A1.2 1.2 0 0 0 16.434 8.2"
                                  opacity="0.1"
                                />
                                <path
                                  d="M15.783 8.85H8.512V25.1h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191"
                                  opacity="0.2"
                                />
                                <path
                                  d="M15.783 8.85H8.512V23.8h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191"
                                  opacity="0.2"
                                />
                                <path
                                  d="M15.132 8.85h-6.62V23.8h6.62a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191"
                                  opacity="0.2"
                                />
                                <path
                                  fill="url(#vscodeIconsFileTypeWord0)"
                                  d="M3.194 8.85h11.938a1.193 1.193 0 0 1 1.194 1.191v11.918a1.193 1.193 0 0 1-1.194 1.191H3.194A1.19 1.19 0 0 1 2 21.959V10.041A1.19 1.19 0 0 1 3.194 8.85"
                                />
                                <path
                                  fill="#fff"
                                  d="M6.9 17.988q.035.276.046.481h.028q.015-.195.065-.47c.05-.275.062-.338.089-.465l1.255-5.407h1.624l1.3 5.326a8 8 0 0 1 .162 1h.022a8 8 0 0 1 .135-.975l1.039-5.358h1.477l-1.824 7.748h-1.727l-1.237-5.126q-.054-.222-.122-.578t-.084-.52h-.021q-.021.189-.084.561t-.1.552L7.78 19.871H6.024L4.19 12.127h1.5l1.131 5.418a5 5 0 0 1 .079.443"
                                />
                              </svg>
                            );
                          } else if (
                            ["xls", "xlsx"].includes(fileExtension)
                          ) {
                            return (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 32 32"
                              >
                                <path
                                  fill="#20744a"
                                  fill-rule="evenodd"
                                  d="M28.781 4.405h-10.13V2.018L2 4.588v22.527l16.651 2.868v-3.538h10.13A1.16 1.16 0 0 0 30 25.349V5.5a1.16 1.16 0 0 0-1.219-1.095m.16 21.126H18.617l-.017-1.889h2.487v-2.2h-2.506l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2h10.411Z"
                                />
                                <path
                                  fill="#20744a"
                                  d="M22.487 7.439h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323z"
                                />
                                <path
                                  fill="#fff"
                                  fill-rule="evenodd"
                                  d="m6.347 10.673l2.146-.123l1.349 3.709l1.594-3.862l2.146-.123l-2.606 5.266l2.606 5.279l-2.269-.153l-1.532-4.024l-1.533 3.871l-2.085-.184l2.422-4.663z"
                                />
                              </svg>
                            );
                          } else if (fileExtension === "zip") {
                            return (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#484842"
                                  d="M16 12v-2h2v2zm0 2h-2v-2h2zm0 2v-2h2v2zm-4.806-8l-2-2H4.615q-.269 0-.442.173T4 6.616v10.769q0 .269.173.442t.443.173H14v-2h2v2h3.385q.269 0 .442-.173t.173-.442v-8.77q0-.269-.173-.442T19.385 8H16v2h-2V8zM4.615 19q-.69 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h4.981l2 2h7.789q.69 0 1.153.463T21 8.616v8.769q0 .69-.462 1.153T19.385 19zM4 18V6z"
                                />
                              </svg>
                            );
                          } else {
                            return (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 256 256"
                              >
                                <path
                                  fill="#484842"
                                  d="m210.83 85.17l-56-56A4 4 0 0 0 152 28H56a12 12 0 0 0-12 12v176a12 12 0 0 0 12 12h144a12 12 0 0 0 12-12V88a4 4 0 0 0-1.17-2.83M156 41.65L198.34 84H156ZM200 220H56a4 4 0 0 1-4-4V40a4 4 0 0 1 4-4h92v52a4 4 0 0 0 4 4h52v124a4 4 0 0 1-4 4"
                                />
                              </svg>
                            );
                          }
                        };

                        return (
                          <>
                            {isIamge ? (
                              <div className="image-container" key={index}>
                                <div className="image-item">
                                  {renderFilePreview()}
                                </div>
                                <div className="image-details">
                                  <div
                                    className="image-name"
                                    title={imageName}
                                  >
                                    {truncatedName}
                                  </div>
                                  <div
                                    className="delete-icon"
                                    onClick={() =>
                                      handleDeleteImage(imageUrl)
                                    }
                                  >
                                    <MdOutlineDeleteForever />
                                  </div>
                                </div>
                              </div>
                            ) : (<div className="" key={index} style={{ display: "flex", flexDirection: "row", width: "calc(25% - 16px)", alignItems: "center" }}>
                              <div className="" style={{ marginTop: "2px" }}
                              >
                                {renderFilePreview()}
                              </div>
                              {/* <div className="image-details"> */}
                              <div
                                className="image-name" style={{ marginLeft: "10px", marginBottom: "4px" }}
                                title={imageName}
                              >
                                {truncatedName}
                              </div>
                              <div
                                className="delete-icon" style={{ marginBottom: "4px", marginLeft: "110px" }}
                                onClick={() =>
                                  handleDeleteImage(imageUrl)
                                }
                              >
                                <MdOutlineDeleteForever />
                              </div>
                              {/* </div> */}
                            </div>)}
                          </>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className={`actionbar`}>
            <button type="button" onClick={handleNextClick}>
              Next
            </button>
            <button
              id="herobtnskls"
              type="submit"
              className={` ${tick?.basicTick ? "" : "disabled"} `}
            >
              {cusId && isDuplicate ? (
                <p>
                  {" "}
                  {customer?.loading === true ? "Dublicating" : "Duplicate"}
                </p>
              ) : (
                <>
                  {cusId && isEdit ? (
                    <p> {customer?.loading === true ? "Updating" : "Update"}</p>
                  ) : (
                    <p>
                      {" "}
                      {customer?.loading === true ? "Submiting" : "Submit"}
                    </p>
                  )}
                </>
              )}
            </button>
            <Link to={"/dashboard/vendors"} className="linkx3">
              <button type="button">Cancel</button>
            </Link>

          </div>
        </form>
        {showPopup && (
          <div className="mainxpopups2" ref={popupRef}>
            <div className="popup-content02">
              <span
                className="close-button02"
                onClick={() => setShowPopup(false)}
              >
                <RxCross2 />
              </span>
              <img
                src={selectedImage}
                alt="Selected Image"
                height={500}
                width={500}
              />
            </div>
          </div>
        )}{" "}
        {showPopup && (
          <div className="mainxpopups2" ref={popupRef}>
            <div className="popup-content02">
              <span
                className="close-button02"
                onClick={() => setShowPopup(false)}
              >
                <RxCross2 />
              </span>
              <img
                src={selectedImage}
                alt="Selected Image"
                height={500}
                width={500}
              />
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default CreateVendors;
