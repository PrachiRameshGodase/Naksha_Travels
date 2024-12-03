import React, { useEffect, useState, useRef } from "react";
import TopLoadbar from "../../Components/Toploadbar/TopLoadbar";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import DisableEnterSubmitForm from "../Helper/DisableKeys/DisableEnterSubmitForm";
import { useDispatch, useSelector } from "react-redux";
import { customersList } from "../../Redux/Actions/customerActions";
import CustomDropdown10 from "../../Components/CustomDropdown/CustomDropdown10";
import {
  purchseOrdersLists,
  vendorsLists,
} from "../../Redux/Actions/listApisActions";
import DatePicker from "react-datepicker";
import { otherIcons } from "../Helper/SVGIcons/ItemsIcons/Icons";
import MainScreenFreezeLoader from "../../Components/Loaders/MainScreenFreezeLoader";
import { OverflowHideBOdy } from "../../Utils/OverflowHideBOdy";
import toast, { Toaster } from "react-hot-toast";
import {
  purchasesDetails,
} from "../../Redux/Actions/purchasesActions";
import useOutsideClick from "../Helper/PopupData";
import { formatDate, todayDate } from "../Helper/DateFormat";
import {
  ItemSelectGRM,
} from "../Helper/ComponentHelper/ItemSelect";
import ImageUpload from "../Helper/ComponentHelper/ImageUpload";
import { isPartiallyInViewport } from "../Helper/is_scroll_focus";
import CustomDropdown04 from "../../Components/CustomDropdown/CustomDropdown04";
import CustomDropdown22 from "../../Components/CustomDropdown/CustomDropdown22";
import {
  GRNcreateActions,
  GRNdetailsActions,
} from "../../Redux/Actions/grnActions";
import { withPurchaseOrder } from "../Helper/ComponentHelper/DropdownData";
import { GRNype } from "../Helper/ComponentHelper/DropdownData";
import { SubmitButton2 } from "../Common/Pagination/SubmitButton";
import TextAreaComponentWithTextLimit from "../Helper/ComponentHelper/TextAreaComponentWithTextLimit";
import GenerateAutoId from "../Sales/Common/GenerateAutoId";
import { handleDropdownError, stringifyJSON } from "../Helper/HelperFunctions";
const CreateGRN = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const vendorList = useSelector((state) => state?.vendorList);
  const [cusData, setcusData] = useState(null);
  const purchseList = useSelector((state) => state?.purchseList);
  const detailsPurchase = useSelector((state) => state?.detailsPurchase);
  const GRNcreates = useSelector((state) => state?.GRNcreate);
  const params = new URLSearchParams(location.search);
  const {
    id: itemId,
    edit: isEdit,
    duplicate: isDuplicate,
    convert
  } = Object.fromEntries(params.entries());

  // console.log("grn ", itemId, isEdit, convert);
  const [showAllSequenceId, setShowAllSequenceId] = useState([]);


  const [isVendorSelect, setIsVendorSelect] = useState(false);
  const [isItemSelect, setIsItemSelect] = useState(false);

  const GRNdetails = useSelector((state) => state?.GRNdetails);
  const GRNdetail = GRNdetails?.data?.bgrnill;

  const purchseDetails = useSelector((state) => state?.detailsPurchase);
  const purchseDetail = purchseDetails?.data?.purchaseOrder;

  const [fetchDetails, setFetchDetails] = useState(null);

  useEffect(() => {
    if (itemId && isEdit) {
      setFetchDetails(GRNdetail);
    } else if (itemId && (convert === "purchase_to_grn")) {
      setFetchDetails(purchseDetail);
    }
  }, [itemId, isEdit, purchseDetail, GRNdetail, convert]);

  const [formData, setFormData] = useState({
    id: 0,
    grn_type: "Import",
    grn_no: "GRN-1315",
    transaction_date: formatDate(new Date()), // GRN date
    reference: null,
    vendor_id: null,
    is_purchase_order: 1, // 0 no and 1 yes
    purchase_order_id: null,
    fy: localStorage.getItem("FinancialYear"),
    vendor_name: "",
    display_name: "",
    phone: "",
    email: "",
    subtotal: null,
    discount: null,
    shipping_charge: null,
    adjustment_charge: null,
    total_grn_charges: null,
    total: null,
    upload_image: null,
    status: null,
    terms_and_condition: "",
    vendor_note: "",

    items: [
      {
        id: 0,
        item_id: null,
        po_qty: null,
        gr_qty: null,
        rate: null,
        charges_weight: null,
        custom_duty: null,
        gross_amount: 0,
        final_amount: null,
        tax_rate: null,
        tax_amount: null,
        unit_id: null,
        discount: null,
        discount_type: null,
        item_remark: null, // Discrepency Notes
        upload_image: [], // Attachments
      },
    ],

    charges_type: [
      {
        account_id: null,
        amount: null,
        remarks: null,
        vendor_id: null,
        upload_image: [], // Attachment
      },
    ],
  });

  useEffect(() => {
    if ((itemId && isEdit && fetchDetails) || (itemId && isDuplicate && fetchDetails) || (itemId && convert && fetchDetails)) {
      const fetchPurchseOrderId = purchseList?.data?.purchase_order?.find((val) => val?.purchase_order_id === fetchDetails?.purchase_order_id)
      const itemsFromApi = fetchDetails?.items?.map((item) => ({
        item_id: +item?.item_id,
        po_qty: convert === "purchase_to_grn" ? +item?.quantity : +item?.po_qty,
        gr_qty: +item?.gr_qty,
        rate: +item?.rate,
        charges_weight: +item?.charges_weight,
        custom_duty: item?.custom_duty,
        gross_amount: +item?.gross_amount,
        final_amount: item?.final_amount,
        tax_rate: item?.tax_rate,
        tax_amount: +item?.tax_amount,
        item_remark: item?.item_remark,
        ...(convert === "purchase_to_grn" ? "" : { upload_image: JSON.parse(item?.upload_image) }),
        unit_id: +item?.unit_id,
      }));
      const chargesFromApi = fetchDetails?.charges?.map((charge) => ({
        account_id: +charge?.account_id,
        amount: +charge?.amount,
        remarks: charge?.remarks,
        vendor_id: +charge?.vendor_id,
        upload_image: JSON.parse(charge?.upload_image),
      }));

      setFormData({
        ...formData,
        id: isEdit ? fetchDetails?.id : 0,
        grn_type: fetchDetails?.grn_type,
        total_grn_charges: fetchDetails?.total_grn_charges,
        grn_no: fetchDetails?.grn_no,
        transaction_date: fetchDetails?.transaction_date, // GRN date
        reference: fetchDetails?.reference === "0" ? "" : fetchDetails?.reference,
        vendor_id: +fetchDetails?.vendor_id,
        is_purchase_order: convert === "purchase_to_grn" ? 1 : (+fetchDetails?.is_purchase_order), // 0 no and 1 yes
        purchase_order_id: fetchPurchseOrderId ? (fetchPurchseOrderId?.id) : (+fetchDetails?.purchase_order_id),
        fy: fetchDetails?.fy,
        vendor_name: fetchDetails?.vendor_name,
        display_name: fetchDetails?.display_name,
        phone: fetchDetails?.phone,
        email: fetchDetails?.email,
        subtotal: +fetchDetails?.subtotal,
        shipping_charge: +fetchDetails?.shipping_charge,
        adjustment_charge: +fetchDetails?.adjustment_charge,
        total: +fetchDetails?.total,
        upload_image: fetchDetails?.upload_image,
        status: fetchDetails?.status,
        terms_and_condition: fetchDetails?.terms_and_condition,
        vendor_note: fetchDetails?.vendor_note,
        items: itemsFromApi || [],
        ...(!convert === "purchase_to_grn" && { charges_type: chargesFromApi || [] }),
        tracking_details: stringifyJSON({
          ...(convert === "purchase_to_grn" ? { module: convert, id: itemId } : []),
        })

      });

      if (fetchDetails?.upload_image != 0) {
        setImgeLoader("success");
      }

      if (fetchDetails.vendor_id) {
        setIsVendorSelect(true);
      }

      if (fetchDetails.items) {
        setIsItemSelect(true);
      } else {
        setIsItemSelect(false);
      }
    }
  }, [fetchDetails, itemId, isEdit, isDuplicate, convert]);

  //set purchase order data of items in items list row
  const [detail_api_data, setDetail_api_data] = useState([]);

  useEffect(() => {
    if (cusData) {
      dispatch(purchasesDetails({ id: cusData?.id }, setDetail_api_data));
    }
  }, [cusData]);

  useEffect(() => {
    if (detail_api_data?.items) {
      const itemsFromApi = detail_api_data?.items?.map((item) => ({
        item_id: +item?.item_id,
        po_qty: +item?.quantity,
        gross_amount: +item?.gross_amount,
        rate: +item?.rate,
        final_amount: 0.0,
        tax_rate:
          item?.tax_rate == "" || item?.tax_rate == "0" ? null : item?.tax_rate,
        gr_qty: 0,
        unit_id: item?.item?.unit,
        upload_image: "",
      }));

      setFormData((prevFormData) => ({
        ...prevFormData,
        items: itemsFromApi || [],
      }));
    }
  }, [detail_api_data]);
  //set purchase order data of items in items list row

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "shipping_charge" || name === "adjustment_charge") {
      newValue = parseFloat(value) || 0;
    }

    if (name === "vendor_id" && value !== "") {
      setIsVendorSelect(true);
      const sendData = {
        fy: localStorage.getItem("FinancialYear"),
        vendor_id: formData?.vendor_id,
        status: "1"
      };
      dispatch(purchseOrdersLists(sendData))
    } else if (name === "vendor_id" && value == "") {
      setIsVendorSelect(false);
    }
    setFormData({
      ...formData,
      [name]: newValue,
      total: calculateTotal(
        formData?.subtotal,
        newValue,
        formData?.adjustment_charge
      ),
    });
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      display_name: cusData?.display_name,
      email: cusData?.email,
      phone: cusData?.mobile_no,
    }));
  }, [cusData]);

  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);

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


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const buttonName = e.nativeEvent.submitter.name;
    try {
      const prepareFormDataForApi = (formData) => {
        const preparedFormData = JSON.parse(JSON.stringify(formData));

        preparedFormData.items = preparedFormData.items.map(item => ({
          ...item,
          upload_image: JSON.stringify(item.upload_image)
        }));

        preparedFormData.charges_type = preparedFormData.charges_type.map(charge => ({
          ...charge,
          upload_image: JSON.stringify(charge.upload_image)
        }));
        return preparedFormData;
      };

      // Prepare formData for API
      const formDataForApi = prepareFormDataForApi(formData);
      dispatch(GRNcreateActions(formDataForApi, Navigate, isEdit, buttonName, itemId, convert, showAllSequenceId));
    } catch (error) {
      toast.error('Error updating GRN:', error);
    }
  };

  useEffect(() => {
    if (itemId && convert && !purchseDetail) {
      dispatch(purchasesDetails({ id: itemId, fy: localStorage.getItem('FinancialYear'), }));
    }
    if (itemId && isEdit) {
      dispatch(GRNdetailsActions({ id: itemId }));
    }
  }, [dispatch, formData?.vendor_id]);


  useOutsideClick(dropdownRef, () => setOpenDropdownIndex(null));

  const [imgLoader, setImgeLoader] = useState("");

  const [freezLoadingImg, setFreezLoadingImg] = useState(false);

  //empty all the fields when no select
  useEffect(() => {
    if (formData?.is_purchase_order === 2) {
      setFormData({
        ...formData,
        purchase_order_id: null,
        vendor_id: null,
        items: [
          {
            id: 0,
            item_id: null,
            po_qty: 0,
            gr_qty: 0,
            rate: 0,
            charges_weight: 0,
            custom_duty: null,
            gross_amount: 0,
            final_amount: 0,
            tax_rate: null,
            tax_amount: 0,
            discount: 0,
            discount_type: null,
            item_remark: null, // Discrepency Notes
            upload_image: [], // Attachments
          },
        ],

        charges_type: [
          {
            account_id: null,
            amount: 0,
            remarks: "",
            vendor_id: null,
            upload_image: [], // Attachment
          },
        ],
        total: 0,
        total_grn_charges: 0,
        adjustment_charge: 0,
        subtotal: 0,
      });
    }
  }, [formData?.is_purchase_order]);
  //empty all the fields when no select

  return (
    <>
      <TopLoadbar />
      {(freezLoadingImg || GRNcreates?.loading || detailsPurchase?.loading) && <MainScreenFreezeLoader />}


      <div className="formsectionsgrheigh">
        <div id="Anotherbox" className="formsectionx2">
          <div id="leftareax12">
            <h1 id="firstheading">
              {otherIcons?.create_grn_svg}
              New GRN
            </h1>
          </div>
          <div id="buttonsdata">
            <Link to={"/dashboard/grn"} className="linkx3">
              <RxCross2 />
            </Link>
          </div>
        </div>

        <div id="formofcreateitems">
          <form onSubmit={handleFormSubmit}>
            <div className="relateivdiv">
              {/* <div className=""> */}
              <div className="itemsformwrap">
                <div className="f1wrapofcreq">
                  <div className="form_commonblock">
                    <label>
                      GRN Type<b className="color_red">*</b>
                    </label>
                    <div id="sepcifixspanflex">
                      <span id="">
                        {otherIcons.name_svg}
                        <CustomDropdown04
                          ref={dropdownRef1}
                          options={GRNype}
                          value={formData.grn_type}
                          onChange={handleChange}
                          name="grn_type"
                          defaultOption="Select GRN Type"
                          type="masters"
                          required
                        />
                      </span>
                    </div>
                  </div>

                  <div className="f1wrapofcreqx1">
                    <div className="form_commonblock">
                      <label>GRN Date</label>
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
                          placeholderText="Enter Transaction Date"
                          dateFormat="dd-MM-yyyy" // Add format prop
                        />
                      </span>
                    </div>
                    <div className="form_commonblock">
                      <label>GRN Number</label>
                      <GenerateAutoId
                        formHandlers={{ setFormData, handleChange, setShowAllSequenceId }}
                        nameVal="grn_no"
                        value={formData?.grn_no}
                        module="grn"
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
                          name="reference"
                          placeholder="Enter Reference"
                        />
                      </span>
                    </div>

                    <div className="form_commonblock">
                      <label>With Purchase Order<b className='color_red'>*</b></label>
                      <div id="inputx1">
                        <span>
                          {otherIcons?.home_brek_svg}
                          <CustomDropdown04
                            label="With Purchase Order name"
                            options={withPurchaseOrder}
                            value={formData?.is_purchase_order}
                            onChange={handleChange}
                            name="is_purchase_order"
                            defaultOption="Select Yes/No"
                            type="masters"
                          />
                        </span>
                      </div>
                    </div>

                    <div className="form_commonblock">
                      <label>
                        Select Vendor<b className="color_red">*</b>
                      </label>
                      <div id="inputx1">
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
                          />
                        </span>
                      </div>
                      {!isVendorSelect && (
                        <p
                          className="error-message"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {otherIcons.error_svg}
                          Please Select Vendor
                        </p>
                      )}
                    </div>

                    {formData?.is_purchase_order === 1 ? (
                      <>
                        <div className="form_commonblock">
                          <label>Purchase Order</label>
                          <div id="inputx1">
                            <span id="">
                              {otherIcons.name_svg}
                              <CustomDropdown22
                                label="Select purchase_order"
                                options={purchseList?.data?.purchase_order}
                                value={formData.purchase_order_id}
                                onChange={handleChange}
                                name="purchase_order_id"
                                defaultOption="Select Purchase Order"
                                setcusData={setcusData}
                                type="purchase"

                              />
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    <div></div>
                  </div>
                </div>
                {/* </div> */}

                <div id="select_item_in_grn_0101">
                  <ItemSelectGRM
                    formData={formData}
                    setFormData={setFormData}
                    handleChange={handleChange}
                    setIsItemSelect={setIsItemSelect}
                    isItemSelect={isItemSelect}
                    extracssclassforscjkls={"extracssclassforscjkls"}
                    dropdownRef2={dropdownRef2}
                    itemData1={cusData}
                    imgLoader={imgLoader}
                    setImgeLoader={setImgeLoader}
                    vendorList={vendorList}
                  />

                  <div className="secondtotalsections485s sxfc546sdfr85234e">

                    <div className="textareaofcreatqsiform">
                      <label>Terms And Conditions</label>
                      <div className='show_no_of_text_limit_0121'>
                        <TextAreaComponentWithTextLimit
                          formsValues={{ handleChange, formData }}
                          placeholder="Enter the terms and conditions of your business to be displayed in your transaction "
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

              <SubmitButton2 isEdit={isEdit} itemId={itemId} cancel="grn" />
            </div>
          </form>
        </div>
        <Toaster />
      </div>
    </>
  );
};
export default CreateGRN;
