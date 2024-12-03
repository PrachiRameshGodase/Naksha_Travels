import React, { useEffect, useState, useRef } from "react";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import DisableEnterSubmitForm from "../../Helper/DisableKeys/DisableEnterSubmitForm";
import { useDispatch, useSelector } from "react-redux";
import { customersList } from "../../../Redux/Actions/customerActions";
import CustomDropdown10 from "../../../Components/CustomDropdown/CustomDropdown10";
import { vendorsLists } from "../../../Redux/Actions/listApisActions";
import DatePicker from "react-datepicker";
import { FaEye } from "react-icons/fa";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";
import MainScreenFreezeLoader from "../../../Components/Loaders/MainScreenFreezeLoader";
import { updateAddresses } from "../../../Redux/Actions/globalActions";
import { OverflowHideBOdy } from "../../../Utils/OverflowHideBOdy";
import CustomDropdown14 from "../../../Components/CustomDropdown/CustomDropdown14";
import DeleveryAddress from "./DeleveryAddress";
import ViewVendorsDetails from "./ViewVendorsDetails";
import toast, { Toaster } from "react-hot-toast";
import {
  createPurchases,
  purchasesDetails,
} from "../../../Redux/Actions/purchasesActions";
import Loader02 from "../../../Components/Loaders/Loader02";
import useOutsideClick from "../../Helper/PopupData";
import { handleKeyPress } from "../../Helper/KeyPressInstance";
import { formatDate, todayDate } from "../../Helper/DateFormat";
import { getCurrencyFormData, handleDropdownError, orgnizationEmail, parseJSONofString, ShowMasterData, stringifyJSON } from "../../Helper/HelperFunctions";
import NumericInput from "../../Helper/NumericInput";
import CurrencySelect from "../../Helper/ComponentHelper/CurrencySelect";
import ItemSelect from "../../Helper/ComponentHelper/ItemSelect";
import ImageUpload from "../../Helper/ComponentHelper/ImageUpload";
import { isPartiallyInViewport } from "../../Helper/is_scroll_focus";
import { SelectAddress } from "../../Common/SelectAddress";
import { activeOrg_details } from '../../Helper/HelperFunctions';
import GenerateAutoId from "../Common/GenerateAutoId";
import TextAreaComponentWithTextLimit from "../../Helper/ComponentHelper/TextAreaComponentWithTextLimit";
import SubmitButton from "../../Common/Pagination/SubmitButton";
import CustomDropdown04 from "../../../Components/CustomDropdown/CustomDropdown04";

import { handleFormSubmitCommon } from "../../Purchases/Utils/handleFormSubmit"

const CreatePurchaseOrder = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const cusList = useSelector((state) => state?.customerList);
  const vendorList = useSelector((state) => state?.vendorList);
  const vendorAddress = useSelector((state) => state?.updateAddress);
  const [cusData, setcusData] = useState(null);
  const [cusData2, setcusData2] = useState(null);

  const paymentTerms = ShowMasterData("8");


  const { city, country, state, zipcode, name, email, street1, street2, mobile_no } = activeOrg_details;

  const [deliveryAddress, setDeliveryAddress] = useState("orgnization");
  const [showAllSequenceId, setShowAllSequenceId] = useState([]);


  const [viewAllCusDetails, setViewAllCusDetails] = useState(false);
  const purchseDetails = useSelector((state) => state?.detailsPurchase);
  const createPurchse = useSelector((state) => state?.createPurchase);
  const purchseDetail = purchseDetails?.data?.purchaseOrder;
  const purchaseStatus = useSelector((state) => state?.purchseStatus);

  const params = new URLSearchParams(location.search);
  const {
    id: itemId,
    edit: isEdit,
    duplicate: isDuplicate,
  } = Object.fromEntries(params.entries());

  const [isVendorSelect, setIsVendorSelect] = useState(false);
  const [isItemSelect, setIsItemSelect] = useState(false);
  const [isCustomerSelect, setIsCustomerSelect] = useState(false);
  const [imgLoader, setImgeLoader] = useState("");


  const [freezLoadingImg, setFreezLoadingImg] = useState(false);

  const [formData, setFormData] = useState({
    purchase_type: "purchase_order",
    transaction_date: formatDate(new Date()),
    warehouse_id: localStorage.getItem("selectedWarehouseId"),
    fy: localStorage.getItem("FinancialYear"),
    purchase_order_id: "PO-254",
    order_no: null,
    vendor_id: null,
    currency: getCurrencyFormData,
    vendor_name: "",
    display_name: "",
    customer_id: "",

    delivery_address: [
      {
        address_type: "1",
        address: null,
        customer_id: null
      }
    ],

    phone: "",
    sale_person: "",
    email: "",
    terms_and_condition: "",
    vendor_note: "",
    subtotal: null,
    discount: null,
    tcs: null,
    shipping_charge: null,
    adjustment_charge: null,
    total: null,
    reference: "",
    upload_image: null,
    payment_terms: null,
    date: null,
    place_of_supply: null,
    expected_delivery_Date: formatDate(new Date()),
    shipment_preference: null,
    customer_note: null,
    discount: "",
    address: "",
    tax_amount: null,
    items: [
      {
        item_id: "",
        quantity: 1,
        unit_id: null,
        gross_amount: null,
        tax_name: "",
        final_amount: null,
        tax_rate: null,
        tax_amount: null,
        discount: 0,
        discount_type: 1,
        item_remark: null,
      },
    ],
  });

  // console.log("formdaaaaaaaaaaaaaaa", purchseDetail)

  useEffect(() => {
    if (
      (itemId && isEdit && purchseDetail) 
      // || (itemId && isDuplicate && purchseDetail)
    ) {
      const calculateTotalTaxAmount = () => {
        return purchseDetail?.items?.reduce((total, entry) => {
          return total + ((entry?.tax_amount) ? parseFloat(entry?.tax_amount) : 0);
        }, 0);
      };
      const itemsFromApi = purchseDetail.items?.map((item) => ({
        item_id: +item?.item_id,
        quantity: +item?.quantity,
        unit_id: item?.unit_id,
        gross_amount: +item?.gross_amount,
        rate: +item?.rate,
        final_amount: +item?.final_amount,
        tax_rate: +item?.tax_rate,
        tax_amount: +item?.tax_amount,
        discount: +item?.discount,
        discount_type: +item?.discount_type,
        item_remark: item?.item_remark,
        tax_name: item?.item?.tax_preference === "1" ? "Taxable" : "Non-Taxable",
      }));

      // const deliveryAddress = parseJSONofString(purchseDetail?.delivery_address)
      // const addressType = deliveryAddress?.address_type === "2" ? "customer" : "vendor";

      // const deliveryAddressArray = deliveryAddress ? [
      //   {
      //     address_type: addressType,
      //     address: deliveryAddress?.address || null,
      //     customer_id: deliveryAddress?.customer_id || null,
      //   }
      // ] : formData.delivery_address;

      setFormData({
        id: isEdit ? purchseDetail?.id : 0,
        purchase_type: "purchase_order",
        transaction_date: purchseDetail.transaction_date,
        warehouse_id: purchseDetail.warehouse_id,
        purchase_order_id: purchseDetail.purchase_order_id,
        vendor_id: +purchseDetail.vendor_id,
        upload_image: purchseDetail.upload_image,
        customer_type: purchseDetail.customer_type,
        customer_name: purchseDetail.customer_name,
        display_name: purchseDetail.display_name,
        customer_id: deliveryAddress?.customer_id || "",
        // delivery_address: deliveryAddressArray,
        phone: purchseDetail.phone,
        email: purchseDetail.email,
        reference: purchseDetail?.reference === "0" ? "" : purchseDetail?.reference,
        currency: purchseDetail.currency,
        place_of_supply: purchseDetail?.place_of_supply === "0" ? "" : purchseDetail?.place_of_supply,
        // expiry_date: purchseDetail.expiry_date,
        expected_delivery_Date: purchseDetail.expected_delivery_Date,
        payment_terms: purchseDetail.payment_terms,
        sale_person: purchseDetail.sale_person === "0" ? "" : purchseDetail.sale_person,
        vendor_note: purchseDetail?.vendor_note === "0" ? "" : purchseDetail?.vendor_note,
        terms_and_condition: purchseDetail.terms_and_condition,
        fy: purchseDetail.fy,
        subtotal: purchseDetail.subtotal,
        shipping_charge: purchseDetail.shipping_charge,
        adjustment_charge: purchseDetail.adjustment_charge,
        total: ((+purchseDetail.subtotal) + (+purchseDetail.shipping_charge) + (+ purchseDetail.adjustment_charge) + calculateTotalTaxAmount()),
        customer_id: deliveryAddress?.customer_id,
        tax_amount: calculateTotalTaxAmount(),

        items: itemsFromApi || [],
      });

      if (purchseDetail.upload_image) {
        setImgeLoader("success");
      }

      if (purchseDetail?.address) {
        const parsedAddress = purchseDetail?.address ? JSON.parse(purchseDetail?.address) : [];
        const dataWithParsedAddress = {
          ...purchseDetail,
          address: parsedAddress,
        };
        setAddSelect({
          billing: dataWithParsedAddress?.address?.billing,
          shipping: dataWithParsedAddress?.address?.shipping,
        });
        setcusData(dataWithParsedAddress?.vendor);
      }


      // if (purchseDetail?.delivery_address) {
      //   const deliveryAddressData = {
      //     address_type: addressType,
      //     address: deliveryAddress?.address || null,
      //     customer_id: deliveryAddress?.customer_id || null,
      //   };

      //   setAddSelectCus({
      //     billing: deliveryAddressData?.address?.billing,
      //     shipping: deliveryAddressData?.address?.shipping,
      //   })
      //   setcusData2(deliveryAddressData?.customer_id);
      // }

      if (purchseDetail.vendor_id) {
        setIsVendorSelect(true);
      }

      if (!purchseDetail.items) {
        setIsItemSelect(false);
      } else {
        setIsItemSelect(true);
      }
    }
  }, [purchseDetail, itemId, isEdit]);




  // for address select
  const [addSelect, setAddSelect] = useState({
    billing: "",
    shipping: "",
  });

  const [addSelectCus, setAddSelectCus] = useState({
    billing: "",
    shipping: "",
  });

  // console.log("cussssssssaaaaaaaaaaaaaaa", addSelect)

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "shipping_charge" || name === "adjustment_charge") {
      newValue = parseFloat(value) || 0; // Convert to float or default to 0
    }

    if (name === "vendor_id" && value !== "") {
      setIsVendorSelect(true);
    } else if (name === "vendor_id" && value == "") {
      setIsVendorSelect(false);
    }

    if (name === "vendor_id") {
      const selectedItem = vendorList?.data?.user?.find(
        (cus) => cus.id == value
      );
      const findfirstbilling = selectedItem?.address?.find(
        (val) => val?.is_billing === "1"
      );
      const findfirstshipping = selectedItem?.address?.find(
        (val) => val?.is_shipping === "1"
      );
      setAddSelect({
        billing: findfirstbilling,
        shipping: findfirstshipping,
      });
    }

    if (name === "customer_id") {
      const selectedItem = cusList?.data?.user?.find((cus) => cus.id == value);
      const findfirstbilling = selectedItem?.delivery_address?.find(
        (val) => val?.is_billing === "1"
      );
      const findfirstshipping = selectedItem?.delivery_address?.find(
        (val) => val?.is_shipping === "1"
      );

      setAddSelectCus({
        billing: findfirstbilling,
        shipping: findfirstshipping,
      });
    }
    setFormData({
      ...formData,
      [name]: newValue,
      total: calculateTotal(
        formData.subtotal,
        newValue,
        formData.adjustment_charge
      ),
      ...(name === "vendor_id" && { payment_terms: cusData?.payment_terms === "0" ? null : cusData?.payment_terms }),
      address: addSelect ? JSON.stringify(addSelect) : null,

    });
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      delivery_address: {
        address_type: deliveryAddress === "customer" ? "2" : "1",
        address: deliveryAddress === "customer" ? (addSelectCus) : (`${country?.name || ""} ${city?.name || ""} ${state?.name || ""}`),
        customer_id: cusData2?.id
      }
    }))

  }, [deliveryAddress, addSelectCus, cusData2])

  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  const dropdownRef3 = useRef(null);

  const calculateTotal = (subtotal, shippingCharge, adjustmentCharge) => {
    const subTotalValue = parseFloat(subtotal) || 0;
    const shippingChargeValue = parseFloat(shippingCharge) || 0;
    const adjustmentChargeValue = parseFloat(adjustmentCharge) || 0;
    return (
      subTotalValue +
      shippingChargeValue +
      adjustmentChargeValue
    ).toFixed(2);
  };

  const handleFormSubmit = (e) => {
    handleFormSubmitCommon({
      e,
      formData,
      isVendorSelect,
      dropdownRef1,
      isItemSelect,
      dropdownRef2,
      dispatch,
      createPurchases,
      Navigate,
      isEdit,
      showAllSequenceId,
      itemId,
      // convert,
      type: "purchase order",
      additionalData: {
        delivery_address: stringifyJSON(formData?.delivery_address),
      },

    });
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      display_name: cusData?.display_name,
      email: cusData?.email,
      phone: cusData?.mobile_no,
      address: cusData?.address?.length,
      address: addSelect,
    }));
  }, [cusData]);


  useEffect(() => {
    if (itemId && isEdit && !purchseDetail) {
      dispatch(purchasesDetails({ id: itemId, fy: localStorage.getItem('FinancialYear'), }));
    }
  }, [dispatch, isEdit, itemId]);

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      expected_delivery_Date: formatDate(date),
    });
  };

  useOutsideClick(dropdownRef, () => setOpenDropdownIndex(null));


  const handleChildData = (data) => {
    setDeliveryAddress(data);
  };


  return (
    <>
      {purchseDetails?.loading === true ? <Loader02 /> : <>
        {(createPurchse?.loading || purchaseStatus?.loading || vendorAddress?.loading || freezLoadingImg) && <MainScreenFreezeLoader />}
        <TopLoadbar />


        <div className="formsectionsgrheigh">
          <div id="Anotherbox" className="formsectionx2">
            <div id="leftareax12">
              <h1 id="firstheading">
                {otherIcons?.purchase_order_icon}
                {isEdit ? "Update Purchase Order" : " New Purchase Order"}
              </h1>
            </div>
            <div id="buttonsdata">
              <Link to={"/dashboard/purchase"} className="linkx3">
                <RxCross2 />
              </Link>
            </div>
          </div>

          <div id="formofcreateitems">
            <DisableEnterSubmitForm onSubmit={handleFormSubmit}>
              <div className="relateivdiv">
                <div className="itemsformwrap">
                  <div className="f1wrapofcreq">
                    <div className="form_commonblock">
                      <label>
                        Vendor Name<b className="color_red">*</b>
                      </label>
                      <div id="sepcifixspanflex">
                        <span id="">
                          {otherIcons.name_svg}

                          <CustomDropdown10
                            ref={dropdownRef1}
                            label="Select vendor"
                            options={vendorList?.data?.user}
                            value={formData.vendor_id}
                            onChange={handleChange}
                            name="vendor_id"
                            defaultOption="Select Vendor Name"
                            setcusData={setcusData}
                            type="vendor"
                            required
                          />

                          {cusData && (
                            <div className="view_all_cus_deial_btn">
                              {viewAllCusDetails === true ? (
                                <button
                                  type="button"
                                  onClick={() => setViewAllCusDetails(false)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      setViewAllCusDetails(false);
                                    }
                                  }}
                                >
                                  Hide Customer Information
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setViewAllCusDetails(true)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      setViewAllCusDetails(true);
                                    }
                                  }}
                                >
                                  View Customer Information
                                </button>
                              )}
                            </div>
                          )}
                        </span>

                        {!isVendorSelect && (
                          <p
                            className="error-message"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {otherIcons.error_svg}
                            Please Select Vendor
                          </p>
                        )}

                        <SelectAddress
                          addSelect={addSelect}
                          setAddSelect={setAddSelect}
                          formData={formData}
                          setFormData={setFormData}
                          cusData={cusData}
                          viewAllCusDetails={viewAllCusDetails}
                          setViewAllCusDetails={setViewAllCusDetails}
                          type="vendor"
                        />
                      </div>

                      {/* <DeleveryAddress onSendData={handleChildData} formdatas={{ formData, setFormData }} /> */}

                    </div>
                    {/* {deliveryAddress === "1" ? (
                      <>
                        <div
                          className="s45w5812cusphxs1"
                          style={{ fontSize: "13px", fontWeight: 400 }}
                        >
                          <p className="dex1s2schilds2">
                            <p style={{ fontWeight: 700, display: "inline" }}>
                              Orgnization Name :
                            </p>
                            {name}
                          </p>
                          <p className="dex1s2schilds2">
                            <p style={{ fontWeight: 700, display: "inline" }}>
                              Email :{" "}
                            </p>
                            {email}
                          </p>
                          <p className="dex1s2schilds2">
                            <p style={{ fontWeight: 700, display: "inline" }}>
                              Mobile No :{" "}
                            </p>
                            {mobile_no}
                          </p>
                          <p className="dex1s2schilds2">
                            <p style={{ fontWeight: 700, display: "inline" }}>
                              Address :
                            </p>{" "}
                            {street1} {street2}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form_commonblock">
                          <div id="sepcifixspanflex">
                            <span id="">
                              {otherIcons.name_svg}
                              <CustomDropdown10
                                ref={dropdownRef2}
                                label="Customer Name"
                                options={cusList?.data?.user}
                                value={formData.customer_id}
                                onChange={handleChange}
                                name="customer_id"
                                defaultOption="Select Customer"
                                setcusData={setcusData2}
                                type="vendor"
                                required
                              />
                            </span>
                          </div>
                          <SelectAddress
                            addSelect={addSelectCus}
                            setAddSelect={setAddSelectCus}
                            formData={formData}
                            setFormData={setFormData}
                            cusData={cusData2}
                            viewAllCusDetails={viewAllCusDetails}
                            setViewAllCusDetails={setViewAllCusDetails}
                            module
                            type="customer"
                          />
                        </div>
                      </>
                    )} */}

                    <div className="f1wrapofcreqx1">
                      <div className="form_commonblock">
                        <label>Purchase Order Number</label>
                        <GenerateAutoId
                          formHandlers={{ setFormData, handleChange, setShowAllSequenceId }}
                          nameVal="purchase_order_id"
                          value={formData?.purchase_order_id}
                          module="purchase_order"
                          showField={isEdit}
                        />
                      </div>

                      <div className="form_commonblock ">
                        <label>Reference</label>
                        <span>
                          {otherIcons.placeofsupply_svg}
                          <input
                            type="text"
                            value={formData.reference}
                            onChange={handleChange}
                            // disabled

                            name="reference"
                            placeholder="Enter Reference Number"
                          />
                        </span>
                      </div>

                      <div className="form_commonblock">
                        <CurrencySelect
                          value={formData?.currency}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form_commonblock">
                        <label>Date</label>
                        <span>
                          {otherIcons.date_svg}
                          <DatePicker
                            selected={formData.transaction_date}
                            onChange={(date) =>
                              setFormData({
                                ...formData,
                                transaction_date: formatDate(date),
                              })
                            }
                            name="transaction_date"
                            placeholderText="Enter Shipping Date"
                            dateFormat="dd-MMM-yyyy" // Use MMM for month name
                            format="dd-MMM-yyyy" // Add format prop
                          />
                        </span>
                      </div>

                      <div className="form_commonblock ">
                        <label>Purchase Terms</label>
                        <span>
                          {otherIcons.vendor_svg}
                          <CustomDropdown04
                            autoComplete='off'
                            options={paymentTerms}
                            value={formData?.payment_terms}
                            onChange={handleChange}
                            name="payment_terms"
                            defaultOption='Enter Purchase Terms'
                            type="masters"
                          />
                        </span >
                      </div>


                      <div className="form_commonblock">
                        <label>Expected Delivery Date</label>
                        <span>
                          {otherIcons.date_svg}
                          <DatePicker
                            autoComplete="off"
                            selected={formData.expected_delivery_Date}
                            onChange={(date) =>
                              setFormData({
                                ...formData,
                                expected_delivery_Date: formatDate(date),
                              })
                            }
                            name="expected_delivery_Date"
                            placeholderText="Enter Purchase Order Date"
                            dateFormat="dd-MMM-yyyy"
                            minDate={formData.transaction_date}
                          />
                        </span>
                      </div>

                      <div className="form_commonblock">
                        <label>Place Of Supply</label>
                        <span>
                          {otherIcons.placeofsupply_svg}
                          <input
                            type="text"
                            value={formData.place_of_supply}
                            onChange={handleChange}
                            name="place_of_supply"
                            placeholder="Enter Place Of Supply"
                          />
                        </span>
                      </div>



                      <div className="form_commonblock">
                        <label>Sale Person</label>
                        <span>
                          {otherIcons.vendor_svg}
                          <input
                            type="text"
                            value={formData.sale_person}
                            name="sale_person"
                            onChange={handleChange}
                            placeholder="Enter Sales Person"
                          />
                        </span>
                      </div>

                      <div>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}

                  <div className="">
                    <ItemSelect
                      formData={formData}
                      setFormData={setFormData}
                      handleChange={handleChange}
                      setIsItemSelect={setIsItemSelect}
                      isItemSelect={isItemSelect}
                      extracssclassforscjkls={"extracssclassforscjkls"}
                      dropdownRef2={dropdownRef2}
                    />

                    <div className="secondtotalsections485s sxfc546sdfr85234e">
                      <div className="textareaofcreatqsiform">
                        <label>Terms And Conditions</label>
                        <div className='show_no_of_text_limit_0121'>
                          <TextAreaComponentWithTextLimit
                            formsValues={{ handleChange, formData }}
                            placeholder='Enter the terms and conditions of your business to be displayed in your transaction '
                            name="terms_and_condition"
                            value={formData?.terms_and_condition}
                          />
                        </div>
                      </div>

                      <div id="imgurlanddesc" className="calctotalsectionx2">
                        <ImageUpload
                          formData={formData}
                          setFormData={setFormData}
                          setFreezLoadingImg={setFreezLoadingImg}
                          imgLoader={imgLoader}
                          setImgeLoader={setImgeLoader}
                          component="purchase"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <SubmitButton isEdit={isEdit} itemId={itemId} cancel="purchase" />
              </div>
            </DisableEnterSubmitForm>
          </div>
          <Toaster />
        </div>
      </>}
    </>
  );
};
export default CreatePurchaseOrder;
