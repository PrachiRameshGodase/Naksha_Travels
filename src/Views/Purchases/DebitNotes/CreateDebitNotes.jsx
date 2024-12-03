import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DisableEnterSubmitForm from '../../Helper/DisableKeys/DisableEnterSubmitForm';
import { useDispatch, useSelector } from 'react-redux';
import { updateCreditNote, updateQuotation } from '../../../Redux/Actions/quotationActions';
import { customersList } from '../../../Redux/Actions/customerActions';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import { invoiceLists, itemLists, vendorsLists } from '../../../Redux/Actions/listApisActions';
import DatePicker from "react-datepicker";

import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import { GoPlus } from 'react-icons/go';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import CustomDropdown12 from '../../../Components/CustomDropdown/CustomDropdown12';
import { fetchCurrencies, fetchMasterData, updateAddresses } from '../../../Redux/Actions/globalActions';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { imageDB } from '../../../Configs/Firebase/firebaseConfig';
import { OverflowHideBOdy } from '../../../Utils/OverflowHideBOdy';
import { BsEye } from 'react-icons/bs';
import { Toaster, toast } from "react-hot-toast";
import CustomDropdown14 from '../../../Components/CustomDropdown/CustomDropdown14';
import { SlReload } from 'react-icons/sl';
import { createCreditNotes, creditNotesDetails, debitNotesDetails } from '../../../Redux/Actions/notesActions';
import CustomDropdown17 from '../../../Components/CustomDropdown/CustomDropdown17';
import Loader02 from '../../../Components/Loaders/Loader02';
import CustomDropdown18 from '../../../Components/CustomDropdown/CustomDropdown18';
import { billDetails, billLists } from '../../../Redux/Actions/billActions';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import CurrencySelect from '../../Helper/ComponentHelper/CurrencySelect';
import ItemSelect from '../../Helper/ComponentHelper/ItemSelect';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import { todayDate } from '../../Helper/DateFormat';
import { getCurrencyFormData, handleDropdownError, ShowMasterData } from '../../Helper/HelperFunctions';
import GenerateAutoId from '../../Sales/Common/GenerateAutoId';
import SubmitButton from '../../Common/Pagination/SubmitButton';
import TextAreaComponentWithTextLimit from '../../Helper/ComponentHelper/TextAreaComponentWithTextLimit';
import { formatDate } from '../../Helper/DateFormat';
const CreateDebitNotes = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const getCurrency = useSelector((state) => state?.getCurrency?.data);

    const addUpdate = useSelector((state) => state?.updateAddress);
    const vendorList = useSelector((state) => state?.vendorList);
    const billList = useSelector(state => state?.billList?.data?.bills);
    const billDetailss = useSelector((state) => state?.billDetail);
    const billDetail = billDetailss?.data?.bill;


    const debitNoteDetails = useSelector((state) => state?.debitNoteDetail);
    const debitNote = debitNoteDetails?.data?.data?.debit_note;

    const createCreditNote = useSelector((state) => state?.createCreditNote);

    const [showAllSequenceId, setShowAllSequenceId] = useState([]);
    const reasonTypeData = ShowMasterData("12");
    const [imgLoader, setImgeLoader] = useState("");
    const [freezLoadingImg, setFreezLoadingImg] = useState(false);

    const [cusData, setcusData] = useState(null);
    const [fetchDetails, setFetchDetails] = useState(null);

    const [isVendorSelect, setIsVendorSelect] = useState(false);
    const [isItemSelect, setIsItemSelect] = useState(false);



    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, duplicate: isDuplicate, convert } = Object.fromEntries(params.entries());

    useEffect(() => {
        if (itemId && isEdit || itemId && isDuplicate) {
            setFetchDetails(debitNote);
        } else if (itemId && (convert === "toCredit")) {
            setFetchDetails(billDetail);
        }

    }, [itemId, isEdit, convert, billDetail, debitNote, isDuplicate])


    const [formData, setFormData] = useState({
        tran_type: "debit_note",
        vendor_id: null,
        warehouse_id: localStorage.getItem('selectedWarehouseId'),
        bill_id: null,
        currency: getCurrencyFormData,
        reference_no: "",
        debit_note_id: null,
        transaction_date: formatDate(new Date()), // debit_note date
        sale_person: "",
        customer_type: null,
        customer_name: null,
        display_name:null,
        phone: null,
        email: null,
        // address: null,
        reason_type: null,
        place_of_supply: "",
        customer_note: null,
        terms_and_condition: null,
        fy: localStorage.getItem('FinancialYear'),
        warehouse_id: localStorage.getItem('selectedWarehouseId') || '',
        subtotal: null,
        shipping_charge: null,
        adjustment_charge: null,
        total: null,
        status: null,
        reference: "",
        upload_image: null,
        tax_amount: null,
        discount: null,
        items: [
            {

                item_id: '',
                quantity: 1,
                gross_amount: null,
                rate: null,
                final_amount: null,
                unit_id: null,
                tax_rate: null,
                tax_amount: null,
                discount: 0,
                discount_type: 1,
                item_remark: null,
                tax_name: ""
            }
        ],
    });



    useEffect(() => {
        if (itemId && isEdit && fetchDetails || itemId && isDuplicate && fetchDetails) {

            const calculateTotalTaxAmount = () => {
                return fetchDetails?.items?.reduce((total, entry) => {
                    return total + ((entry?.tax_amount) ? parseFloat(entry?.tax_amount) : 0);
                }, 0);
            };


            const filterBillId = billList?.find((val) => val?.id === (+fetchDetails?.bill_id));

            const itemsFromApi = fetchDetails.items?.map(item => ({
                item_id: (+item?.item_id),
                quantity: (+item?.quantity),
                gross_amount: (+item?.gross_amount),
                unit_id: (item?.unit_id),
                rate: (+item?.rate),
                final_amount: (+item?.final_amount),
                tax_rate: (+item?.tax_rate),
                tax_amount: (+item?.tax_amount),
                discount: (+item?.discount),
                discount_type: (+item?.discount_type),
                item_remark: item?.item_remark,
                tax_name: item?.item?.tax_preference === "1" ? "Taxable" : "Non-Taxable"
            }));

            setFormData({
                ...formData,
                id: isEdit ? itemId : 0,
                tran_type: 'debit_note',
                transaction_date: fetchDetails?.transaction_date,
                warehouse_id: fetchDetails?.warehouse_id,
                debit_note_id: fetchDetails?.debit_note_id,
                upload_image: fetchDetails?.upload_image,
                customer_type: fetchDetails?.customer_type,
                customer_name: fetchDetails?.customer_name,
                display_name: fetchDetails?.display_name,
                phone: fetchDetails?.phone,
                reason_type: fetchDetails?.reason_type,
                vendor_id: (+fetchDetails?.vendor_id),
                email: fetchDetails?.email,
                reference_no: fetchDetails?.reference_no,
                invoice_id: (+fetchDetails?.invoice_id),
                reference: fetchDetails?.reference,
                currency: fetchDetails?.currency,
                place_of_supply: fetchDetails?.place_of_supply === "0" ? "" : fetchDetails?.place_of_supply,
                sale_person: fetchDetails?.sale_person === "0" ? "" : fetchDetails?.sale_person,
                customer_note: fetchDetails?.customer_note,
                terms_and_condition: fetchDetails?.terms_and_condition,
                bill_id: filterBillId?.id,
                fy: fetchDetails?.fy,
                subtotal: fetchDetails?.subtotal,
                shipping_charge: fetchDetails?.shipping_charge,
                adjustment_charge: fetchDetails?.adjustment_charge,
                total: fetchDetails?.total,
                status: fetchDetails?.status,
                tax_amount: calculateTotalTaxAmount(),
                items: itemsFromApi || []
            });

            if (fetchDetails.upload_image) {
                setImgeLoader("success");
            }

            if (fetchDetails?.address) {
                const parsedAddress = JSON.parse(fetchDetails?.address);
                const dataWithParsedAddress = {
                    ...fetchDetails,
                    address: parsedAddress
                };

                setAddSelect({
                    billing: dataWithParsedAddress?.address?.billing,
                    shipping: dataWithParsedAddress?.address?.shipping,
                });

                setcusData(dataWithParsedAddress?.customer)
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

    const calculateTotal = (subtotal, shippingCharge, adjustmentCharge) => {
        const subTotalValue = parseFloat(subtotal) || 0;
        const shippingChargeValue = parseFloat(shippingCharge) || 0;
        const adjustmentChargeValue = parseFloat(adjustmentCharge) || 0;
        return (subTotalValue + shippingChargeValue + adjustmentChargeValue).toFixed(2);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'shipping_charge' || name === 'adjustment_charge') {
            newValue = parseFloat(value) || 0; // Convert to float or default to 0
        }


        if (name === "vendor_id" && value !== "") {
            setIsVendorSelect(true);
        }
        else if (name === "vendor_id" && value == "") {
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
            ...(name === "vendor_id" ? { bill_id: "" } : ""),
            total: calculateTotal(formData.subtotal, formData.shipping_charge, formData.adjustment_charge),
            address: addSelect ? JSON.stringify(addSelect) : null, // Convert address array to string if addSelect is not null
        });
    };


    // addresssssssssssssssssssssssssssssssssssssssssssssssssssssssss

    // for address select
    const [addSelect, setAddSelect] = useState({
        billing: "",
        shipping: ""
    });

    useEffect(() => {
        setFormData({
            ...formData,
            address: addSelect
        })
    }, [addSelect])

    //trigger show updated address then it updated
    useEffect(() => {
        if (addSelect?.billing) {
            // console.log("addreupdate response", addUpdate?.data?.address)
            setAddSelect({
                ...addSelect,
                billing: addUpdate?.data?.address,
            })
        } if (addSelect?.shipping) {
            setAddSelect({
                ...addSelect,
                shipping: addUpdate?.data?.address,
            })
        }
    }, [addUpdate])
    // addresssssssssssssssssssssssssssssssssssssssssssssssssssssssss


    const vendorRef = useRef(null);
    const itemRef = useRef(null);


    const Navigate = useNavigate()

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const buttonName = e.nativeEvent.submitter.name;

        if (handleDropdownError(isVendorSelect, vendorRef)) return;
        if (handleDropdownError(isItemSelect, itemRef)) return;

        try {
            const updatedItems = formData.items.map((item) => {
                const { tax_name, ...itemWithoutTaxName } = item;
                return itemWithoutTaxName;
            });
            dispatch(createCreditNotes({ ...formData, items: updatedItems, address: JSON.stringify(formData?.address) }, Navigate, "debit_note", isEdit, buttonName, showAllSequenceId));
        } catch (error) {
            toast.error('Error updating quotation:', error);
        }
    };


    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            customer_type: cusData?.customer_type,
            display_name:cusData?.display_name,
            customer_name: cusData ? `${cusData.first_name} ${cusData.last_name}` : '',
            email: cusData?.email,
            phone: cusData?.mobile_no,

        }));
    }, [cusData]);

    useEffect(() => {
        if (itemId && !billDetail) {
            dispatch(billDetails({ id: itemId }));
        }

        else if (!billList || cusData?.id) {
            dispatch(billLists({ fy: localStorage.getItem('FinancialYear'), vendor_id: cusData?.id, status: 1 }));
        }

        else if (!debitNoteDetails && itemId && !convert) {
            dispatch(debitNotesDetails({ id: itemId }));
        }
    }, [dispatch, cusData]);

    useEffect(() => {
        dispatch(customersList({ fy: localStorage.getItem('FinancialYear') }));
    }, [dispatch,]);

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            transaction_date: date,
        });

    }
    return (
        <>
            {debitNoteDetails?.loading === true ? < Loader02 /> : <>
                <TopLoadbar />
                {(freezLoadingImg || addUpdate?.loading || createCreditNote?.loading) && <MainScreenFreezeLoader />}

                <div className='formsectionsgrheigh'>
                    <div id="Anotherbox" className='formsectionx2'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                <svg height="512pt" viewBox="-1 0 512 512.00052" width="512pt" xmlns="http://www.w3.org/2000/svg" id="fi_1688619"><path d="m498.1875 283.320312-123.632812 123.632813c-15.625 15.625-40.96875 15.625-56.589844-.007813l-214.996094-214.996093c-3.234375-3.234375-5.804688-6.878907-7.695312-10.773438-7.265626-14.917969-4.703126-33.417969 7.695312-45.828125l123.625-123.625c15.632812-15.628906 40.976562-15.628906 56.597656 0l214.996094 214.996094c15.632812 15.625 15.632812 40.96875 0 56.601562zm0 0" fill="#4395fb"></path><path d="m498.1875 283.320312-123.632812 123.632813c-15.625 15.625-40.96875 15.625-56.589844-.007813l-214.996094-214.996093c-3.234375-3.234375-5.804688-6.878907-7.695312-10.773438h357.371093l45.542969 45.542969c15.632812 15.625 15.632812 40.96875 0 56.601562zm0 0" fill="#2482ff"></path><path d="m171.753906 66.570312 42.316406-42.320312 271.589844 271.59375-42.316406 42.316406zm0 0" fill="#2c5bab"></path><path d="m370.996094 181.175781h-84.632813l156.988281 156.980469 42.3125-42.3125zm0 0" fill="#274b92"></path><path d="m481.917969 512h-454.417969c-15.1875 0-27.5-12.3125-27.5-27.5v-233.300781c0-15.1875 12.3125-27.5 27.5-27.5h454.417969c15.1875 0 27.5 12.3125 27.5 27.5v233.300781c0 15.1875-12.3125 27.5-27.5 27.5zm0 0" fill="#1eb7a2"></path><path d="m471.289062 316.082031v103.539063c0 5.761718-4.042968 10.707031-9.679687 11.90625-4.964844 1.058594-9.636719 2.917968-13.867187 5.4375-4.117188 2.433594-7.8125 5.488281-10.972657 9.039062l-.03125.03125c-4.347656 4.890625-7.664062 10.71875-9.636719 17.144532-1.542968 5.039062-6.3125 8.398437-11.582031 8.398437h-321.621093c-5.269532 0-10.039063-3.359375-11.582032-8.398437-4.859375-15.894532-18.066406-28.148438-34.507812-31.652344-5.636719-1.199219-9.679688-6.144532-9.679688-11.90625v-103.539063c0-5.753906 4.042969-10.710937 9.679688-11.90625 3.769531-.808593 7.371094-2.070312 10.738281-3.738281 11.320313-5.585938 20.023437-15.664062 23.769531-27.917969 1.542969-5.039062 6.3125-8.398437 11.582032-8.398437h321.621093c5.269531 0 10.039063 3.359375 11.582031 8.398437 4.859376 15.894531 18.066407 28.148438 34.507813 31.65625 5.636719 1.195313 9.679687 6.152344 9.679687 11.90625zm0 0" fill="#65d196"></path><path d="m471.289062 316.082031v103.539063c0 5.761718-4.042968 10.707031-9.679687 11.90625-4.964844 1.058594-9.636719 2.917968-13.867187 5.4375-4.117188 2.433594-7.8125 5.488281-10.972657 9.039062l-.03125.03125h-322.421875c-5.269531 0-10.035156-3.359375-11.578125-8.398437-4.863281-15.894531-18.070312-28.160157-34.511719-31.65625-5.636718-1.207031-9.679687-6.152344-9.679687-11.914063v-93.628906c11.320313-5.585938 20.023437-15.664062 23.769531-27.917969 1.542969-5.039062 6.3125-8.398437 11.582032-8.398437h321.621093c5.269531 0 10.039063 3.359375 11.582031 8.398437 4.859376 15.894531 18.066407 28.148438 34.507813 31.65625 5.636719 1.195313 9.679687 6.152344 9.679687 11.90625zm0 0" fill="#7af4ab"></path><g fill="#7af4a9"><path d="m54.230469 265.265625c0 5.527344-4.480469 10.007813-10.007813 10.007813s-10.007812-4.480469-10.007812-10.007813 4.480468-10.007813 10.007812-10.007813 10.007813 4.480469 10.007813 10.007813zm0 0"></path><path d="m475.203125 265.265625c0 5.527344-4.480469 10.007813-10.007813 10.007813-5.527343 0-10.007812-4.480469-10.007812-10.007813s4.480469-10.007813 10.007812-10.007813c5.527344 0 10.007813 4.480469 10.007813 10.007813zm0 0"></path><path d="m54.230469 470.4375c0 5.527344-4.480469 10.007812-10.007813 10.007812s-10.007812-4.480468-10.007812-10.007812 4.480468-10.007812 10.007812-10.007812 10.007813 4.480468 10.007813 10.007812zm0 0"></path><path d="m475.203125 470.4375c0 5.527344-4.480469 10.007812-10.007813 10.007812-5.527343 0-10.007812-4.480468-10.007812-10.007812s4.480469-10.007812 10.007812-10.007812c5.527344 0 10.007813 4.480468 10.007813 10.007812zm0 0"></path></g><path d="m336.601562 367.851562c0 45.226563-36.664062 81.890626-81.894531 81.890626-45.226562 0-81.890625-36.664063-81.890625-81.890626 0-45.230468 36.664063-81.890624 81.890625-81.890624 45.230469 0 81.894531 36.660156 81.894531 81.890624zm0 0" fill="#1a9c91"></path><path d="m427.414062 357.875h-46.195312c-4.347656 0-7.871094 3.527344-7.871094 7.875s3.523438 7.875 7.871094 7.875h46.195312c4.351563 0 7.875-3.527344 7.875-7.875s-3.523437-7.875-7.875-7.875zm0 0" fill="#1a9c91"></path><path d="m128.199219 362.074219h-46.195313c-4.351562 0-7.875 3.527343-7.875 7.875 0 4.347656 3.523438 7.875 7.875 7.875h46.195313c4.347656 0 7.871093-3.527344 7.871093-7.875 0-4.347657-3.523437-7.875-7.871093-7.875zm0 0" fill="#1a9c91"></path><path d="m283.769531 388.957031c0-35.210937-40.835937-26.015625-40.835937-43.808593 0-6.824219 4.796875-10.285157 14.257812-10.285157 6.492188 0 10.039063 1.828125 12.628906 3.164063 1.617188.832031 3.015626 1.554687 4.617188 1.554687 4.398438 0 7.09375-4.855469 7.09375-8.335937 0-6.820313-10.378906-9.542969-18.257812-10.4375v-12.804688c0-4.351562-3.523438-7.875-7.875-7.875-4.347657 0-7.875 3.523438-7.875 7.875v13.410156c-12.855469 2.824219-20.265626 11.628907-20.265626 24.726563 0 32.050781 40.835938 21.640625 40.835938 43.808594 0 10.550781-7.957031 12.765625-14.628906 12.765625-14.117188 0-15.382813-10.054688-21.222656-10.054688-3.996094 0-7.214844 4.558594-7.214844 8.335938 0 5.921875 8.578125 14.179687 22.496094 16.191406v10.84375c0 4.347656 3.527343 7.875 7.875 7.875 4.351562 0 7.875-3.527344 7.875-7.875v-11.414062c12.996093-3.070313 20.496093-12.925782 20.496093-27.660157zm0 0" fill="#7af4a9"></path></svg>
                                New Debit Note
                            </h1>
                        </div>
                        <div id="buttonsdata">
                            <Link to={"/dashboard/quotation"} className="linkx3">
                                <RxCross2 />
                            </Link>
                        </div>
                    </div>

                    <div id="formofcreateitems" >
                        <DisableEnterSubmitForm onSubmit={handleFormSubmit}>
                            <div className="relateivdiv">
                                {/* <div className=""> */}
                                <div className="itemsformwrap">
                                    <div className="f1wrapofcreq">
                                        <div className="form_commonblock">
                                            <label >Vendor Name<b className='color_red'>*</b></label>
                                            <div id='sepcifixspanflex'>
                                                <span id=''>
                                                    {otherIcons.name_svg}
                                                    <CustomDropdown10
                                                        label="Select vendor"
                                                        options={vendorList?.data?.user}
                                                        value={formData?.vendor_id}
                                                        onChange={handleChange}
                                                        name="vendor_id"
                                                        defaultOption="Select Vendor Name"
                                                        setcusData={setcusData}
                                                        type="vendor"
                                                        ref={vendorRef}
                                                    />
                                                </span>

                                                {
                                                    !isVendorSelect &&
                                                    <p className="error-message" style={{ whiteSpace: "nowrap" }}>
                                                        {otherIcons.error_svg}
                                                        Please Select Vendor
                                                    </p>
                                                }
                                            </div>


                                        </div>


                                        <div className="f1wrapofcreqx1">

                                            <div className="form_commonblock">
                                                <label>Reason</label>
                                                <span >
                                                    {otherIcons.vendor_svg}
                                                    <CustomDropdown04
                                                        label="Reason Name"
                                                        options={reasonTypeData}
                                                        value={formData?.reason_type}
                                                        onChange={handleChange}
                                                        name="reason_type"
                                                        defaultOption="Select Reason"
                                                        type="masters"
                                                    />
                                                </span>
                                            </div>


                                            <div className="form_commonblock">
                                                <label>Bill</label>
                                                <span id=''>
                                                    {otherIcons.name_svg}
                                                    <CustomDropdown18
                                                        label="Bill Name"
                                                        options={billList}
                                                        value={formData.bill_id}
                                                        onChange={handleChange}
                                                        name="bill_id"
                                                        defaultOption="Select Bill"
                                                        type="bill_no"
                                                    />
                                                </span>
                                            </div>



                                            <div className="form_commonblock">
                                                <label>Debit Note</label>
                                                <GenerateAutoId
                                                    formHandlers={{ setFormData, handleChange, setShowAllSequenceId }}
                                                    nameVal="debit_note_id"
                                                    value={formData?.debit_note_id}
                                                    module="debit_note"
                                                    showField={isEdit}
                                                />
                                            </div>

                                            <div className="form_commonblock">
                                                <label>Debit Note Date</label>
                                                <span >
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                        selected={formData.transaction_date}
                                                        onChange={(date) =>
                                                            setFormData({
                                                              ...formData,
                                                              transaction_date: formatDate(date),
                                                            })
                                                          }
                                                        name='transaction_date'
                                                        placeholderText="Enter Debit Note Date"
                                                        dateFormat="dd-MM-yyy"
                                                    />
                                                </span>
                                            </div>

                                            <div className="form_commonblock">
                                                <label>Place Of Supply<b ></b></label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input
                                                        type="text"
                                                        value={formData.place_of_supply}
                                                        onChange={handleChange}
                                                        name='place_of_supply'
                                                        placeholder='Enter Place Of Supply'
                                                    />
                                                </span>
                                            </div>

                                            <div className="form_commonblock ">
                                                <label >Reference Number</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input type="text" value={formData.reference_no} onChange={handleChange}
                                                        // disabled
                                                        name='reference_no'
                                                        placeholder='Enter Reference Number' />
                                                </span>
                                            </div>


                                            <div className="form_commonblock">
                                                <label>Sales Person</label>
                                                <span >
                                                    {otherIcons.vendor_svg}
                                                    <input
                                                        autoComplete='off'
                                                        type="text"
                                                        value={formData.sale_person}
                                                        name='sale_person'
                                                        onChange={handleChange}
                                                        placeholder='Enter Sales Person'
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
                                            dropdownRef2={itemRef}
                                        />

                                        <div className='secondtotalsections485s sxfc546sdfr85234e'>
                                            <div className='textareaofcreatqsiform'>
                                                <label>Terms and Conditions</label>
                                                <div className='show_no_of_text_limit_0121'>
                                                    <TextAreaComponentWithTextLimit
                                                        formsValues={{ handleChange, formData }}
                                                        placeholder='Enter the terms and conditions of your business to be displayed in your transaction '
                                                        name="terms_and_condition"
                                                        value={formData?.terms_and_condition}
                                                    />
                                                </div>
                                            </div>

                                            <div id="imgurlanddesc" className='calctotalsectionx2'>
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
                                    <SubmitButton isEdit={isEdit} itemId={itemId} cancel="debit-notes" />

                                </div>

                            </div>
                        </DisableEnterSubmitForm>
                    </div>
                </div>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false} />
            </>}
        </>
    );
};


export default CreateDebitNotes



