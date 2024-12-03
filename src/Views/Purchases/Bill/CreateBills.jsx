import React, { useEffect, useState, useRef } from "react";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import DisableEnterSubmitForm from "../../Helper/DisableKeys/DisableEnterSubmitForm";
import { useDispatch, useSelector } from "react-redux";
import CustomDropdown10 from "../../../Components/CustomDropdown/CustomDropdown10";
import DatePicker from "react-datepicker";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";
import MainScreenFreezeLoader from "../../../Components/Loaders/MainScreenFreezeLoader";
import { OverflowHideBOdy } from "../../../Utils/OverflowHideBOdy";
import { createPurchases, purchasesDetails, } from "../../../Redux/Actions/purchasesActions";
import toast, { Toaster } from "react-hot-toast";
import { billDetails } from "../../../Redux/Actions/billActions";
import Loader02 from "../../../Components/Loaders/Loader02";
import { formatDate, todayDate } from "../../Helper/DateFormat";
import { getCurrencyFormData, handleDropdownError, ShowMasterData } from "../../Helper/HelperFunctions";
import CurrencySelect from "../../Helper/ComponentHelper/CurrencySelect";
import ItemSelect from "../../Helper/ComponentHelper/ItemSelect";
import ImageUpload from "../../Helper/ComponentHelper/ImageUpload";
import { isPartiallyInViewport } from "../../Helper/is_scroll_focus";
import { GRNdetailsActions } from "../../../Redux/Actions/grnActions";
import GenerateAutoId from "../../Sales/Common/GenerateAutoId";
import TextAreaComponentWithTextLimit from "../../Helper/ComponentHelper/TextAreaComponentWithTextLimit";
import SubmitButton, { SubmitButton3 } from "../../Common/Pagination/SubmitButton";
import CustomDropdown04 from "../../../Components/CustomDropdown/CustomDropdown04";
import { SelectAddress } from "../../Common/SelectAddress";
import { handleFormSubmitCommon } from "../Utils/handleFormSubmit";

const CreateBills = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const vendorList = useSelector((state) => state?.vendorList);
  const getCurrency = useSelector((state) => state?.getCurrency?.data);
  const billDetailss = useSelector((state) => state?.billDetail);
  const billDetail = billDetailss?.data?.bill;
  const purchase = useSelector((state) => state?.detailsPurchase);
  const purchases = purchase?.data?.purchaseOrder;
  const createPurchse = useSelector((state) => state?.createPurchase);
  const GRNdetails = useSelector((state) => state?.GRNdetails);
  const GRNdetail = GRNdetails?.data?.bgrnill;
  const paymentTerms = ShowMasterData("8");

  const [viewAllCusDetails, setViewAllCusDetails] = useState(false);
  const [cusData, setcusData] = useState(null);
  const [fetchDetails, setFetchDetails] = useState(null);
  const [isVendorSelect, setIsVendorSelect] = useState(false);
  const [isItemSelect, setIsItemSelect] = useState(false);
  const [showAllSequenceId, setShowAllSequenceId] = useState([]);
  const params = new URLSearchParams(location.search);
  const { id: itemId, edit: isEdit, convert, duplicate: isDuplicate, } = Object.fromEntries(params.entries());

  useEffect(() => {
    if ((itemId && isEdit) || (itemId && isDuplicate)) {
      setFetchDetails(billDetail);
    } else if (itemId && convert === "purchase_to_bill") {
      setFetchDetails(purchases);
    } else if (itemId && convert === "grn_to_bill") {
      setFetchDetails(GRNdetail);
    }
  }, [itemId, isEdit, convert, isDuplicate, GRNdetail, purchases]);

  const [formData, setFormData] = useState({
    id: 0,
    purchase_type: "bills",
    bill_no: null,
    transaction_date: formatDate(new Date()), // bill date
    currency: getCurrencyFormData,
    expiry_date: formatDate(new Date()), // due date
    vendor_id: "",
    fy: localStorage.getItem("FinancialYear") || 2024,
    warehouse_id: localStorage.getItem("selectedWarehouseId") || "",
    vendor_name: "",
    display_name: "",
    phone: "",
    email: "",
    terms_and_condition: "",
    vendor_note: "",
    subtotal: null,
    discount: null,
    shipping_charge: null,
    adjustment_charge: null,
    total: null,
    reference_no: "",
    reference: null,
    place_of_supply: null,
    source_of_supply: null,
    shipment_date:null,
    order_no: null,
    payment_terms: "1",
    upload_image: null,
    discount: null,
    tax_amount: null,
    items: [
      {
        id: 0,
        item_id: null,
        quantity: 1,
        gross_amount: null,
        rate: null,
        final_amount: null,
        tax_rate: null,
        tax_amount: null,
        discount: null,
        discount_type: 1,
        item_remark: null,
        tax_name: ""
      },
    ],
  });

  useEffect(() => {
    if (
      (itemId && isEdit && fetchDetails) ||
      (itemId && isDuplicate && fetchDetails) ||
      (itemId &&
        (convert === "toInvoice" ||
          convert === "quotationToSale" ||
          convert === "saleToInvoice" ||
          convert === "purchase_to_bill" ||
          convert === "grn_to_bill"))
    ) {

      const calculateTotalTaxAmount = () => {
        return fetchDetails?.items?.reduce((total, entry) => {
          return total + ((entry?.tax_amount) ? parseFloat(entry?.tax_amount) : 0);
        }, 0);
      };
      const itemsFromApi = fetchDetails?.items?.map((item) => ({
        item_id: +item?.item_id,
        quantity: convert === "grn_to_bill" ? +item?.gr_qty : +item?.quantity,
        gross_amount: +item?.gross_amount,
        rate: +item?.rate,
        final_amount: +item?.final_amount,
        tax_rate: +item?.tax_rate,
        tax_amount: +item?.tax_amount,
        discount: +item?.discount,
        discount_type: convert === "grn_to_bill" ? 1 : +item?.discount_type,
        item_remark: item?.item_remark,
        tax_name:
          item?.item?.tax_preference === "1" ? "Taxable" : "Non-Taxable",
        unit_id: item?.unit_id,
      }));



      setFormData({
        ...formData,
        id: isEdit ? fetchDetails?.id : 0,
        tax_amount: calculateTotalTaxAmount(),
        purchase_type: "bills",
        bill_no: fetchDetails?.bill_no || "BN-1315",
        transaction_date: fetchDetails?.transaction_date,
        currency: fetchDetails?.currency,
        expiry_date: fetchDetails?.expiry_date,
        vendor_id: +fetchDetails?.vendor_id,
        vendor_name: fetchDetails?.vendor_name,
        display_name: fetchDetails?.display_name,
        phone: fetchDetails?.phone,
        email: fetchDetails?.email,
        terms_and_condition: fetchDetails?.terms_and_condition,
        vendor_note: fetchDetails?.vendor_note,
        subtotal: fetchDetails?.subtotal,
        discount: fetchDetails?.discount,
        shipping_charge: fetchDetails?.shipping_charge,
        adjustment_charge: fetchDetails?.adjustment_charge,
        total: fetchDetails?.total,
        reference_no: convert
          ? fetchDetails?.reference
          : fetchDetails?.reference_no === "0"
            ? ""
            : fetchDetails?.reference_no,
        is_grn_convert: convert === "grn_to_bill" ? 1 : 0,
        // reference: fetchDetails?.reference,
        place_of_supply: fetchDetails?.place_of_supply === "0" ? "" : fetchDetails?.place_of_supply,
        source_of_supply: fetchDetails?.source_of_supply,
        shipment_date: fetchDetails?.shipment_date,
        order_no: fetchDetails?.order_no === "0" ? "" : fetchDetails?.order_no,
        payment_terms: fetchDetails?.payment_terms,
        customer_notes: fetchDetails?.customer_notes,
        upload_image: fetchDetails?.upload_image,
        status: fetchDetails?.status,
        items: itemsFromApi || [],
      });

      if (fetchDetails?.upload_image) {
        setImgeLoader("success");
      }

      if (fetchDetails?.address) {
        const parsedAddress = JSON?.parse(fetchDetails?.address);

        const dataWithParsedAddress = {
          ...fetchDetails,
          address: parsedAddress,
        };

        setAddSelect({
          billing: dataWithParsedAddress?.address?.billing,
          shipping: dataWithParsedAddress?.address?.shipping,
        });

        setcusData(dataWithParsedAddress?.customer);
      }

      if (fetchDetails?.vendor_id) {
        setIsVendorSelect(true);
      }
      if (!fetchDetails?.items) {
        setIsItemSelect(false);
      } else {
        setIsItemSelect(true);
      }
    }
  }, [fetchDetails, itemId, isEdit, convert, isDuplicate]);

  const [loading, setLoading] = useState(false);

  // for address select
  const [addSelect, setAddSelect] = useState({
    billing: "",
    shipping: "",
  });


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

    const selectedItem = vendorList?.data?.user?.find((cus) => cus.id == value);
    if (name === "vendor_id") {

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
    setFormData({
      ...formData,
      [name]: newValue,
      total: calculateTotal(
        formData.subtotal,
        newValue,
        formData.adjustment_charge
      ),
    });
  };

  //show all addresses popup....
  const [showPopup, setShowPopup] = useState("");
  const showAllAddress = (val) => {
    setShowPopup(val);
  };
  //show all addresses....

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

  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);

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
      convert,
      type: "bills"
    });
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      customer_type: cusData?.customer_type,
      vendor_name: cusData ? `${cusData.first_name} ${cusData.last_name}` : "",
      email: cusData?.email,
      phone: cusData?.mobile_no,
      address: cusData?.address.length,
    }));
  }, [cusData]);

  useEffect(() => {
    // dispatch(accountLists());
    if (itemId && convert) {
      dispatch(purchasesDetails({ id: itemId, fy: localStorage.getItem('FinancialYear') }));
      dispatch(GRNdetailsActions({ id: itemId, fy: localStorage.getItem('FinancialYear') }));
    } else if (itemId && !billDetail) {
      dispatch(billDetails({ id: itemId, fy: localStorage.getItem('FinancialYear') }));
    }
  }, [dispatch]);
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // image upload from firebase
  const [imgLoader, setImgeLoader] = useState("");

  const [freezLoadingImg, setFreezLoadingImg] = useState(false);

  useEffect(() => {
    OverflowHideBOdy(showPopup);
    // Clean up the effect by removing the event listener on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <>
      <Toaster reverseOrder={false} />
      <TopLoadbar />
      {billDetailss?.loading || billDetailss?.loading ? (
        <Loader02 />
      ) : (
        <>
          {loading && <MainScreenFreezeLoader />}
          {(freezLoadingImg || createPurchse?.loading) && <MainScreenFreezeLoader />}

          <div className="formsectionsgrheigh">
            <div id="Anotherbox" className="formsectionx2">
              <div id="leftareax12">
                <h1 id="firstheading">
                  {otherIcons.all_bills_svg}
                  {isEdit ? "Update Bill" : "New Bill"}

                </h1>
              </div>
              <div id="buttonsdata">
                <Link to={"/dashboard/bills"} className="linkx3">
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
                          Vendor Name <b className="color_red">*</b>
                        </label>
                        <div id="sepcifixspanflex">
                          <span id="">
                            {otherIcons.name_svg}
                            <CustomDropdown10
                              ref={dropdownRef1}
                              label="Select vendor"
                              options={vendorList?.data?.user}
                              value={formData?.vendor_id}
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
                                    Hide Vendor Information
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
                                    View Vendor Information
                                  </button>
                                )}
                              </div>
                            )}

                          </span>
                          {
                            !isVendorSelect &&
                            <p className="error-message" style={{ whiteSpace: "nowrap" }}>
                              {otherIcons.error_svg}
                              Please Select Vendor
                            </p>
                          }

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
                      </div>
                      <div className="f1wrapofcreqx1">
                        <div className="form_commonblock">
                          <label>Bill<b className="color_red">*</b></label>
                          <GenerateAutoId
                            formHandlers={{
                              setFormData,
                              handleChange,
                              setShowAllSequenceId,
                            }}
                            nameVal="bill_no"
                            value={formData?.bill_no}
                            module="bill"
                            showField={isEdit}

                          />

                        </div>

                        <div className="form_commonblock">
                          <label>Bill Date <b className="color_red">*</b></label>
                          <span>
                            {otherIcons.date_svg}
                            <DatePicker
                              selected={formData.transaction_date}
                              onChange={(date) =>
                                setFormData({
                                  ...formData,
                                  transaction_date:formatDate( date),
                                })
                              }
                              name="transaction_date"
                              placeholderText="Enter Bill Date"
                              autoComplete="off"
                              dateFormat="dd-MM-yyy"
                              required
                            />
                          </span>
                        </div>

                        <div className="form_commonblock ">
                          <label>Payment Terms</label>
                          <span>
                            {otherIcons.vendor_svg}
                            <CustomDropdown04
                              autoComplete='off'
                              options={paymentTerms}
                              value={formData?.payment_terms}
                              onChange={handleChange}
                              name="payment_terms"
                              defaultOption='Enter Payment Terms'
                              type="masters"
                            />
                          </span >
                        </div>

                        <div className="form_commonblock">
                          <label>Due Date</label>
                          <span>
                            {otherIcons.date_svg}
                            <DatePicker
                              selected={formData.expiry_date}
                              onChange={(date) =>
                                setFormData({
                                  ...formData,
                                  expiry_date: formatDate(date),
                                })
                              }
                              dateFormat="dd-MM-yyy"
                              autoComplete='off'
                              name="expiry_date"
                              placeholderText="Enter Due Date"
                              minDate={formData?.transaction_date}
                            />
                          </span>
                        </div>

                        <div className="form_commonblock">
                          <CurrencySelect
                            options={getCurrency?.currency}
                            value={formData?.currency}
                            onChange={handleChange}
                          />
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
                              autoComplete="off"
                              placeholder="Enter Place Of Supply"
                            />
                          </span>
                        </div>




                        <div className="form_commonblock">
                          <label>Reference Number</label>
                          <span>
                            {otherIcons.placeofsupply_svg}
                            <input
                              type="text"
                              value={formData.reference_no}
                              onChange={handleChange}
                              name="reference_no"
                              autoComplete="off"
                              placeholder="Enter Reference Number"
                            />
                          </span>
                        </div>


                        <div className="form_commonblock ">
                          <label>Order Number</label>
                          <span>
                            {otherIcons.placeofsupply_svg}
                            <input
                              type="text"
                              value={formData.order_no}
                              onChange={handleChange}
                              // disabled
                              name="order_no"
                              placeholder="Enter Order Number"
                              autoComplete="off"
                            />
                          </span>
                        </div>





                        <div></div>
                      </div>
                    </div>
                    {/* </div> */}

                    <div className="" style={{ padding: 0 }}>
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
                          <div className="show_no_of_text_limit_0121">
                            <TextAreaComponentWithTextLimit
                              formsValues={{ handleChange, formData }}
                              placeholder="Enter the terms and conditions of your business to be displayed in your transaction "
                              name="terms_and_condition"
                              value={
                                formData?.terms_and_condition == 0
                                  ? ""
                                  : formData.terms_and_condition
                              }
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
                  <SubmitButton isEdit={isEdit} itemId={itemId} cancel="bills" />
                </div>
              </DisableEnterSubmitForm>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreateBills;


