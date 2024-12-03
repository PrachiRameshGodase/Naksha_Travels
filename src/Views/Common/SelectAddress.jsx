import React, { useEffect, useRef, useState } from "react";
import CustomDropdown14 from "../../Components/CustomDropdown/CustomDropdown14";
import { RxCross2 } from "react-icons/rx";
import { otherIcons } from "../Helper/SVGIcons/ItemsIcons/Icons";
import { OverflowHideBOdy } from "../../Utils/OverflowHideBOdy";
import ViewCustomerDetails from "../Sales/Quotations/ViewCustomerDetails";
import { updateAddresses } from "../../Redux/Actions/globalActions";
import MainScreenFreezeLoader from "../../Components/Loaders/MainScreenFreezeLoader";
import { useSelector } from "react-redux";

export const SelectAddress = ({
  addSelect,
  setAddSelect,
  formData,
  setFormData,
  cusData,
  viewAllCusDetails,
  setViewAllCusDetails,
  type
}) => {
  const addUpdate = useSelector((state) => state?.updateAddress);
  const popupRef1 = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  // const [viewAllCusDetails, setViewAllCusDetails] = useState(false);
  const [switchCusDatax1, setSwitchCusDatax1] = useState("Details");
  // updateAddress State
  const [udateAddress, setUpdateAddress] = useState({
    id: "",
    user_id: "",
    country_id: "",
    street_1: "",
    street_2: "",
    state_id: "",
    city_id: "",
    zip_code: "",
    address_type: "",
    is_billing: "",
    is_shipping: "",
    phone_no: "",
    fax_no: "",
  });
  // updateAddress State addUpdate

  //set selected billing and shipping addresses inside formData
  useEffect(() => {
    setFormData({
      ...formData,
      address: addSelect,
    });
  }, [addSelect]);
  //set selected billing and shipping addresses inside formData

  // for address select
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    if (name === "billing") {
      setAddSelect({
        ...addSelect,
        billing: value,
      });
    } else {
      setAddSelect({
        ...addSelect,
        shipping: value,
      });
    }
    setShowPopup("");
  };
  // for address select

  // Change address
  const changeAddress = (val) => {
    setShowPopup("showAddress");
    setUpdateAddress({
      ...udateAddress,
      id: val?.id,
      user_id: val?.user_id,
      country_id: val?.country_id,
      street_1: val?.street_1,
      street_2: val?.street_2,
      state_id: val?.state_id,
      city_id: val?.city_id,
      zip_code: val?.zip_code,
      address_type: val?.address_type,
      is_billing: val?.is_billing,
      is_shipping: val?.is_shipping,
      phone_no: val?.phone_no,
      fax_no: val?.fax_no,
    });
  };
  // Change address

  // Change address handler
  const handleAllAddressChange = (e, type) => {
    const { name, value, checked } = e.target;

    setUpdateAddress({
      ...udateAddress,
      [name]: value,
    });

    if (type === "Shipping") {
      setUpdateAddress({
        ...udateAddress,
        is_shipping: checked ? "1" : "0",
      });
    } else if (type === "Billing") {
      setUpdateAddress({
        ...udateAddress,
        is_billing: checked ? "1" : "0",
      });
    }
  };
  // Change address handler

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    OverflowHideBOdy(showPopup);
    // Clean up the effect by removing the event listener on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showPopup]);
  // update Address Handler
  const [clickTrigger, setClickTrigger] = useState(false);
  const updateAddressHandler = () => {
    try {
      dispatch(updateAddresses(udateAddress)).then(() => {
        setShowPopup("");
        setClickTrigger((prevTrigger) => !prevTrigger);
        if (udateAddress?.is_shipping === "0") {
          setAddSelect({
            ...addSelect,
            shipping: undefined,
          });
        } else if (udateAddress?.is_billing === "0") {
          setAddSelect({
            ...addSelect,
            billing: undefined,
          });
        }
      });
    } catch (e) {
      toast.error("error", e);
    }
  };
  // update Address Handler

  useEffect(() => {

    if (cusData?.address?.length) {
      const billingAddress = cusData.address.find((val) => val.is_billing === "1");
      const shippingAddress = cusData.address.find((val) => val.is_shipping === "1");

      setAddSelect({
        billing: billingAddress || null,
        shipping: shippingAddress || null,
      });
    }
  }, [cusData]);

  return (
    <>
      {addUpdate?.loading && <MainScreenFreezeLoader />}

      {showPopup === "showAddress" && (
        <div className="mainxpopups1" ref={popupRef1}>
          <div className="popup-content">
            <span className="close-button" onClick={() => setShowPopup("")}>
              <RxCross2 />
            </span>
            <div className="midpopusec12x">
              <div className="">
                {/* <p>Change Address</p> */}
                <div className="checkboxcontainer5s">
                  <div className="form_commonblock">
                    <label>
                      Address type<b className="color_red">*</b>
                    </label>
                    <div className="checkboxcontainer5s">
                      <label>
                        <input
                          type="checkbox"
                          name="is_shipping"
                          checked={udateAddress?.is_shipping === "1"}
                          onChange={(e) =>
                            handleAllAddressChange(e, "Shipping")
                          }
                        />
                        Shipping address
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          name="is_billing"
                          checked={udateAddress?.is_billing === "1"}
                          onChange={(e) => handleAllAddressChange(e, "Billing")}
                        />
                        Billing address
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form_commonblock">
                  <label>
                    Street 1<b className="color_red">*</b>
                  </label>
                  <span>
                    {otherIcons.tag_svg}
                    <input
                      type="text"
                      value={udateAddress?.street_1}
                      placeholder="Select street_1"
                      onChange={(e) => handleAllAddressChange(e)}
                      name="street_1"
                    />
                  </span>
                </div>
                <div className="form_commonblock">
                  <label>
                    Street 2<b className="color_red">*</b>
                  </label>
                  <span>
                    {otherIcons.tag_svg}
                    <input
                      type="text"
                      value={udateAddress?.street_2}
                      placeholder="Select street_2"
                      onChange={(e) => handleAllAddressChange(e)}
                      name="street_2"
                    />
                  </span>
                </div>
                <div className="form_commonblock">
                  <label>
                    Phone number<b className="color_red">*</b>
                  </label>
                  <span>
                    {otherIcons.tag_svg}
                    <input
                      type="number"
                      value={udateAddress.phone_no}
                      placeholder="Select phone_no"
                      onChange={(e) => handleAllAddressChange(e)}
                      name="phone_no"
                    />
                  </span>
                </div>
                <div className="form_commonblock">
                  <label>
                    Fax number<b className="color_red">*</b>
                  </label>
                  <span>
                    {otherIcons.tag_svg}
                    <input
                      type="text"
                      value={udateAddress.fax_no}
                      placeholder="Select fax_no"
                      onChange={(e) => handleAllAddressChange(e)}
                      name="fax_no"
                    />
                  </span>
                </div>
                <div className="form_commonblock">
                  <label>
                    Zip Code<b className="color_red">*</b>
                  </label>
                  <span>
                    {otherIcons.tag_svg}
                    <input
                      type="text"
                      value={udateAddress.zip_code}
                      placeholder="Select zip_code"
                      onChange={(e) => handleAllAddressChange(e)}
                      name="zip_code"
                    />
                  </span>
                </div>
                <div className="form_commonblock">
                  <button type="button" onClick={() => updateAddressHandler()}>
                    Update Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup === "billing" && (type === "customer" || type === "vendor") && (
        <div className="mainxpopups1" ref={popupRef1}>
          <div className="popup-content" style={{ height: "400px" }}>
            <span className="close-button" onClick={() => setShowPopup("")}>
              <RxCross2 />
            </span>
            { }
            {/* <div className="midpopusec12x"> */}
            <CustomDropdown14
              label="Search Billing"
              options={cusData?.address?.filter(
                (val) => val?.is_billing === "1"
              )}
              value={addSelect?.billing}
              onChange={handleAddressChange}
              name="billing"
              defaultOption="Select Billing"
              customerName={`${cusData?.display_name}`}
            />
            {/* </div> */}
            <div className="midpopusec12x">
              <div className="form_commonblock"></div>
            </div>
          </div>
        </div>
      )}

      {showPopup === "shipping" && type === "customer" && (
        <div className="mainxpopups1" ref={popupRef1}>
          <div className="popup-content" style={{ height: " 400px" }}>
            <span className="close-button" onClick={() => setShowPopup("")}>
              <RxCross2 />
            </span>
            <CustomDropdown14
              label="Search Shipping"
              options={cusData?.address?.filter(
                (val) => val?.is_shipping === "1"
              )}
              value={addSelect?.shipping}
              onChange={handleAddressChange}
              name="shipping"
              defaultOption="Select Shipping"
              customerName={`${cusData?.display_name}`}
            />
            {/* </div> */}
          </div>
        </div>
      )}
      {showPopup === "shipping" && type === "vendor" && (
        <div className="mainxpopups1" ref={popupRef1}>
          <div className="popup-content" style={{ height: " 400px" }}>
            <span className="close-button" onClick={() => setShowPopup("")}>
              <RxCross2 />
            </span>
            <CustomDropdown14
              label="Search Shipping"
              options={cusData?.address?.filter(
                (val) => val?.is_shipping === "1"
              )}
              value={addSelect?.shipping}
              onChange={handleAddressChange}
              name="shipping"
              defaultOption="Select Shipping"
              customerName={`${cusData?.display_name}`}
            />
            {/* </div> */}
          </div>
        </div>
      )}
      {/* customer details show and hide  */}
      {!cusData ? (
        ""
      ) : (
        <>
          <div className="showCustomerDetails">
            {!viewAllCusDetails && (
              <div className="cus_fewDetails">
                <div className="cust_dex1s1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width={24}
                    height={24}
                    color={"#0d54b8"}
                    fill={"none"}
                  >
                    <path
                      d="M14.5 9C14.5 10.3807 13.3807 11.5 12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M18.2222 17C19.6167 18.9885 20.2838 20.0475 19.8865 20.8999C19.8466 20.9854 19.7999 21.0679 19.7469 21.1467C19.1724 22 17.6875 22 14.7178 22H9.28223C6.31251 22 4.82765 22 4.25311 21.1467C4.20005 21.0679 4.15339 20.9854 4.11355 20.8999C3.71619 20.0475 4.38326 18.9885 5.77778 17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.2574 17.4936C12.9201 17.8184 12.4693 18 12.0002 18C11.531 18 11.0802 17.8184 10.7429 17.4936C7.6543 14.5008 3.51519 11.1575 5.53371 6.30373C6.6251 3.67932 9.24494 2 12.0002 2C14.7554 2 17.3752 3.67933 18.4666 6.30373C20.4826 11.1514 16.3536 14.5111 13.2574 17.4936Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>{" "}
                  {type === "customer" ? "Customer Address" : "Vendor Address"}
                </div>

                <div className="cust_dex1s2">
                  <div className="cust_dex1s2s1">

                    {!addSelect?.
                      billing ? (
                      "No billing address is found"
                    ) : (
                      <>
                        <p className="dex1s2schilds1">
                          Billing Address
                          {/* {isEdit && itemId ? "" :
                                                } */}
                          <img
                            onClick={() => setShowPopup("billing")}
                            src="/Icons/pen-clip.svg"
                            alt=""
                          />
                        </p>
                        <div className="s45w5812cusphxs">
                          <p className="dex1s2schilds2">
                            <p style={{ fontWeight: 700, display: "inline" }}>
                              {type === "customer" ? "Customer" : "Vendor"} Name:{" "}
                            </p>
                            {`${cusData?.display_name}`}{" "}
                          </p>
                          <p className="dex1s2schilds2">
                            {" "}
                            <p style={{ fontWeight: 700, display: "inline" }}>
                              Address:
                            </p>{" "}
                            {addSelect?.billing?.street_1 || ""}{" "}
                            {addSelect?.billing?.street_2 || ""}{" "}
                          </p>
                          <p className="dex1s2schilds2">
                            {" "}
                            <p style={{ fontWeight: 700, display: "inline" }}>
                              Fax Number:{" "}
                            </p>
                            {addSelect?.billing?.fax_no
                              ? addSelect?.billing?.fax_no
                              : "No fax_no"}{" "}
                          </p>
                          <p className="dex1s2schilds2">
                            {" "}
                            <p style={{ fontWeight: 700, display: "inline" }}>
                              Phone:{" "}
                            </p>
                            {addSelect?.billing?.phone_no
                              ? addSelect?.billing?.phone_no
                              : "No phone_no"}{" "}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="seps23"></div>
                  <div className="cust_dex1s2s1">

                    {!addSelect?.shipping ? (
                      "No shipping address is found"
                    ) : (
                      <>
                        <p className="dex1s2schilds1">
                          Shipping Address
                          {/* {isEdit && itemId ? "" :
                                            } */}
                          <img
                            onClick={() => setShowPopup("shipping")}
                            src="/Icons/pen-clip.svg"
                            alt=""
                          />
                        </p>
                        {/* <button type='button' onClick={() => changeAddress(addSelect?.shipping)}>Change Address</button> */}
                        <div className="s45w5812cusphxs">
                          <p className="dex1s2schilds2">
                            <p style={{ fontWeight: 700, display: "inline" }}>
                              {type === "customer" ? "Customer" : "Vendor"} Name:
                            </p>{" "}
                            {`${cusData?.display_name || ""} `}
                          </p>

                          <p className="dex1s2schilds2">
                            {" "}
                            <p style={{ fontWeight: 700, display: "inline" }}>
                              Address:
                            </p>{" "}
                            {addSelect?.shipping?.street_1 || ""}{" "}
                            {addSelect?.shipping?.street_2 || ""}{" "}
                          </p>
                          <p className="dex1s2schilds2">
                            {" "}
                            <p style={{ fontWeight: 700, display: "inline" }}>
                              Fax Number:{" "}
                            </p>
                            {addSelect?.shipping?.fax_no
                              ? addSelect?.shipping?.fax_no
                              : "No fax_no"}{" "}
                          </p>
                          <p className="dex1s2schilds2">
                            {" "}
                            <p style={{ fontWeight: 700, display: "inline" }}>
                              Phone:{" "}
                            </p>
                            {addSelect?.shipping?.phone_no
                              ? addSelect?.shipping?.phone_no
                              : "No phone_no"}{" "}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <ViewCustomerDetails
            setSwitchCusDatax1={setSwitchCusDatax1}
            setViewAllCusDetails={setViewAllCusDetails}
            cusData={cusData}
            addSelect={addSelect}
            viewAllCusDetails={viewAllCusDetails}
            switchCusDatax1={switchCusDatax1}
          />
        </>
      )}
      {/* customer details show and hide  */}

      {/* popup code */}
    </>
  );
};
