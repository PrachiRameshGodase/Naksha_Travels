import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import { invoiceLists } from '../../../Redux/Actions/listApisActions';
import DatePicker from "react-datepicker";

import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import { Toaster, toast } from "react-hot-toast";
import { createCreditNotes, creditNotesDetails } from '../../../Redux/Actions/notesActions';
import CustomDropdown17 from '../../../Components/CustomDropdown/CustomDropdown17';
import Loader02 from '../../../Components/Loaders/Loader02';

import { getCurrencyFormData, handleDropdownError, ShowMasterData } from '../../Helper/HelperFunctions';
import ItemSelect from '../../Helper/ComponentHelper/ItemSelect';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import SubmitButton from '../../Common/Pagination/SubmitButton';
import { SelectAddress } from '../../Common/SelectAddress';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import GenerateAutoId from '../Common/GenerateAutoId';
// import GenerateAutoId from '../Quotations/GenerateAutoId';
import TextAreaComponentWithTextLimit from '../../Helper/ComponentHelper/TextAreaComponentWithTextLimit';
import { invoiceDetailes } from '../../../Redux/Actions/invoiceActions';
import { formatDate } from '../../Helper/DateFormat';

const CreateCreditNotes = () => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const location = useLocation();
    const cusList = useSelector((state) => state?.customerList);
    const addUpdate = useSelector((state) => state?.updateAddress);

    const invoiceList = useSelector((state) => state?.invoiceList?.data?.invoice);
    const invoiceDetail = useSelector(state => state?.invoiceDetail);
    const invoiceDetails = invoiceDetail?.data?.data?.Invoice;

    const quoteDetail = useSelector((state) => state?.creditNoteDetail);
    const creditNoteDetail = quoteDetail?.creditDetail?.data?.CreditNote;
    const createCreditNote = useSelector((state) => state?.createCreditNote);
    const [showAllSequenceId, setShowAllSequenceId] = useState([]);

    const reasonTypeData = ShowMasterData("12");

    const [imgLoader, setImgeLoader] = useState("");

    const [freezLoadingImg, setFreezLoadingImg] = useState(false);

    const [isCustomerSelect, setIsCustomerSelect] = useState(false);
    const [isItemSelect, setIsItemSelect] = useState(false);

    const [cusData, setcusData] = useState(null);
    const [viewAllCusDetails, setViewAllCusDetails] = useState(false);

    const [fetchDetails, setFetchDetails] = useState(null);

    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, duplicate: isDuplicate, convert } = Object.fromEntries(params.entries());


    useEffect(() => {
        if (itemId && isEdit || itemId && isDuplicate) {
            setFetchDetails(creditNoteDetail);
        } else if (itemId && (convert === "toCredit")) {
            setFetchDetails(invoiceDetails);
        }

    }, [itemId, isEdit, convert, creditNoteDetail, invoiceDetail, isDuplicate])

    const [formData, setFormData] = useState({
        tran_type: 'credit_note',
        transaction_date: formatDate(new Date()),
        warehouse_id: localStorage.getItem('selectedWarehouseId') || '',
        credit_note_id: null,
        customer_id: '',
        upload_image: null,
        customer_type: null,
        customer_name: null,
        // customer_name: null,
        display_name: null,
        phone: null,
        email: null,
        address: "",
        reference_no: "",
        invoice_id: 12,
        reason_type: "",
        reference: "",
        currency: getCurrencyFormData,
        place_of_supply: '',
        sale_person: '',
        customer_note: null,
        terms_and_condition: null,
        fy: localStorage.getItem('FinancialYear') || 2024,
        subtotal: null,
        shipping_charge: null,
        adjustment_charge: null,
        total: null,
        discount: "",
        tax_amount: null,
        items: [
            {

                item_id: '',
                quantity: 1,
                gross_amount: null,
                rate: null,
                final_amount: null,
                tax_rate: null,
                tax_amount: null,
                discount: 0,
                unit_id: null,
                discount_type: 1,
                item_remark: null,
                tax_name: ""
            }
        ],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'shipping_charge' || name === 'adjustment_charge') {
            newValue = parseFloat(value) || 0;
        }

        if (name === "customer_id" && value !== "") {
            setIsCustomerSelect(true);
        }
        else if (name === "customer_id" && value == "") {
            setIsCustomerSelect(false);
        }

        if (name === "customer_id") {
            const selectedItem = cusList?.data?.user?.find(cus => cus.id == value);

            const findfirstbilling = selectedItem?.address?.find(val => val?.is_billing === "1")
            const findfirstshipping = selectedItem?.address?.find(val => val?.is_shipping === "1")
            setAddSelect({
                billing: findfirstbilling,
                shipping: findfirstshipping,
            })
        }

        setFormData({
            ...formData,
            [name]: newValue,
            ...(name === "customer_id" ? { invoice_id: "" } : ""),
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
    //trigger show updated address then it updated

    // addresssssssssssssssssssssssssssssssssssssssssssssssssssssssss

    const calculateTotal = (subtotal, shippingCharge, adjustmentCharge) => {
        const subTotalValue = parseFloat(subtotal) || 0;
        const shippingChargeValue = parseFloat(shippingCharge) || 0;
        const adjustmentChargeValue = parseFloat(adjustmentCharge) || 0;
        return (subTotalValue + shippingChargeValue + adjustmentChargeValue).toFixed(2);
    };

    const customerRef = useRef(null);
    const itemRef = useRef(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const buttonName = e.nativeEvent.submitter.name;

        if (handleDropdownError(isCustomerSelect, customerRef)) return;
        if (handleDropdownError(isItemSelect, itemRef)) return;

        try {
            const updatedItems = formData?.items.map((item) => {
                const { tax_name, ...itemWithoutTaxName } = item;
                return itemWithoutTaxName;
            });
            dispatch(createCreditNotes({ ...formData, items: updatedItems, address: JSON.stringify(formData?.address) }, Navigate, "credit", isEdit, buttonName, showAllSequenceId));
        } catch (error) {
            toast.error('Error updating quotation:', error);
        }
    };

    useEffect(() => {
        if ((itemId && isEdit && fetchDetails) || (itemId && convert && fetchDetails) || (itemId && isDuplicate && fetchDetails)) {
            const calculateTotalTaxAmount = () => {
                return fetchDetails?.items?.reduce((total, entry) => {
                    return total + ((entry?.tax_amount) ? parseFloat(entry?.tax_amount) : 0);
                }, 0);
            };

            const filterInvoiceId = invoiceList?.find((val) => val?.id === (+fetchDetails?.invoice_id));

            const itemsFromApi = fetchDetails?.items?.map(item => ({
                item_id: (+item?.item_id),
                quantity: (+item?.quantity),
                gross_amount: (+item?.gross_amount),
                rate: (+item?.rate),
                final_amount: (+item?.final_amount),
                unit_id: (item?.unit_id),
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
                tran_type: 'credit_note',
                transaction_date: fetchDetails?.transaction_date,
                warehouse_id: fetchDetails?.warehouse_id,
                credit_note_id: fetchDetails?.credit_note_id,
                customer_id: (+fetchDetails?.customer_id),
                upload_image: fetchDetails?.upload_image,
                customer_type: fetchDetails?.customer_type,
                customer_name: fetchDetails?.customer_name,
                display_name: fetchDetails?.display_name,
                phone: fetchDetails?.phone,
                email: fetchDetails?.email,
                reference_no: fetchDetails?.reference_no === "0" ? '' : fetchDetails?.reference_no,
                reference: fetchDetails?.reference,
                currency: fetchDetails?.currency,
                reason_type: fetchDetails?.reason_type,
                place_of_supply: fetchDetails?.place_of_supply === "0" ? "" : fetchDetails?.place_of_supply,
                sale_person: fetchDetails?.sale_person === "0" ? "" : fetchDetails?.sale_person,
                customer_note: fetchDetails?.customer_note,
                terms_and_condition: fetchDetails?.terms_and_condition,
                fy: fetchDetails?.fy,
                invoice_id: filterInvoiceId?.id,
                subtotal: fetchDetails?.subtotal,
                shipping_charge: fetchDetails?.shipping_charge,
                adjustment_charge: fetchDetails?.adjustment_charge,
                total: fetchDetails?.total,
                address: fetchDetails?.address,
                tax_amount: calculateTotalTaxAmount(),
                items: itemsFromApi || []
            });

            if (fetchDetails?.upload_image) {
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

            if (fetchDetails?.customer_id) {
                setIsCustomerSelect(true);
            }

            if (!fetchDetails?.items) {
                setIsItemSelect(false);
            } else {
                setIsItemSelect(true);
            }


        }
    }, [fetchDetails, itemId, isEdit, convert, isDuplicate]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            customer_type: cusData?.customer_type,
            display_name: cusData?.display_name,
            customer_name: cusData ? `${cusData.first_name} ${cusData.last_name}` : '',
            email: cusData?.email,
            phone: cusData?.mobile_no,
            address: addSelect

        }));
    }, [cusData]);

    useEffect(() => {

        if (itemId && !invoiceDetails) {
            dispatch(invoiceDetailes({ id: itemId }));
        }

        else if (!invoiceList || cusData?.id) {
            dispatch(invoiceLists({ fy: localStorage.getItem('FinancialYear'), customer_id: cusData?.id, status: 1 }));
        }

        else if (!creditNoteDetail && itemId && !convert) {
            dispatch(creditNotesDetails({ id: itemId }));
        }

    }, [dispatch, cusData]);

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            transaction_date: date,
        });
    };


    return (
        <>
            {quoteDetail?.loading ? < Loader02 /> : <>
                <TopLoadbar />
                {(freezLoadingImg || addUpdate?.loading || createCreditNote?.loading) && <MainScreenFreezeLoader />}

                <div className='formsectionsgrheigh'>
                    <div id="Anotherbox" className='formsectionx2'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                {otherIcons?.credit_note_svg}
                                New Credit Note
                            </h1>
                        </div>
                        <div id="buttonsdata">
                            <Link to={"/dashboard/credit-notes"} className="linkx3">
                                <RxCross2 />
                            </Link>
                        </div>
                    </div>

                    <div id="formofcreateitems" >
                        <form onSubmit={handleFormSubmit}>
                            <div className="relateivdiv">
                                <div className="itemsformwrap">
                                    <div className="f1wrapofcreq">
                                        <div className="form_commonblock">
                                            <label >Customer Name<b className='color_red'>*</b></label>
                                            <div id='sepcifixspanflex'>
                                                <span id=''>
                                                    {otherIcons.name_svg}
                                                    <CustomDropdown10
                                                        ref={customerRef}
                                                        label="Customer Name"
                                                        options={cusList?.data?.user}
                                                        value={formData.customer_id}
                                                        onChange={handleChange}
                                                        name="customer_id"
                                                        defaultOption="Select Customer"
                                                        setcusData={setcusData}
                                                        type="vendor"
                                                        required
                                                    />
                                                    {cusData &&
                                                        <div className="view_all_cus_deial_btn">
                                                            {viewAllCusDetails === true ?
                                                                <button type="button" onClick={() => setViewAllCusDetails(false)}
                                                                    onKeyDown={(event) => {
                                                                        if (event.key === 'Enter') {
                                                                            setViewAllCusDetails(false)
                                                                        }
                                                                    }}
                                                                >Hide Customer Information</button>
                                                                :
                                                                <button type="button" onClick={() => setViewAllCusDetails(true)}
                                                                    onKeyDown={(event) => {
                                                                        if (event.key === 'Enter') {
                                                                            setViewAllCusDetails(true)
                                                                        }
                                                                    }}
                                                                >View Customer Information</button>
                                                            }
                                                        </div>
                                                    }

                                                </span>
                                                {
                                                    !isCustomerSelect &&
                                                    <p className="error-message" style={{ whiteSpace: "nowrap" }}>
                                                        {otherIcons.error_svg}
                                                        Please Select Customer
                                                    </p>
                                                }
                                                <SelectAddress addSelect={addSelect} setAddSelect={setAddSelect} formData={formData} setFormData={setFormData} cusData={cusData} isEdit={isEdit} itemId={itemId} viewAllCusDetails={viewAllCusDetails} setViewAllCusDetails={setViewAllCusDetails} type='customer' />

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
                                                <label >Invoice</label>
                                                <span id=''>
                                                    {otherIcons.name_svg}
                                                    <CustomDropdown17
                                                        label="Invoice Name"
                                                        options={invoiceList}
                                                        value={formData.invoice_id}
                                                        onChange={handleChange}
                                                        name="invoice_id"
                                                        defaultOption="Select Inoivce"
                                                    />
                                                </span>

                                            </div>

                                            <div className="form_commonblock">
                                                <label >Credit Note No</label>


                                                <GenerateAutoId
                                                    formHandlers={{ setFormData, handleChange, setShowAllSequenceId }}
                                                    nameVal="credit_note_id"
                                                    value={formData?.credit_note_id}
                                                    module="credit_note"
                                                    showField={isEdit}
                                                />

                                            </div>
                                            <div className="form_commonblock">
                                                <label >Credit Note Date</label>
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
                                                        placeholderText="Enter Credit Note Date"
                                                        dateFormat="dd-MM-yyy"
                                                    />
                                                </span>
                                            </div>





                                            <div className="form_commonblock">
                                                <label >Place Of Supply</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input
                                                        type="text"
                                                        value={formData.place_of_supply}
                                                        onChange={handleChange}
                                                        name='place_of_supply'
                                                        autoComplete='off'
                                                        placeholder='Enter Place of Supply'
                                                    />
                                                </span>
                                            </div>


                                            {/* <div className="form_commonblock">
                                                <label>Currency</label>
                                                <span >
                                                    {otherIcons.currency_icon}

                                                    <CustomDropdown12
                                                        autoComplete='off'
                                                        label="Item Name"
                                                        options={getCurrency?.currency}
                                                        value={formData?.currency}
                                                        onChange={handleChange}
                                                        name="currency"
                                                        defaultOption="Select Currency"
                                                    />
                                                </span>
                                            </div> */}






                                            <div className="form_commonblock ">
                                                <label >Reference Number</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input type="text" value={formData.reference_no} onChange={handleChange}
                                                        // disabled
                                                        autoComplete='off'
                                                        name='reference_no'
                                                        placeholder='Enter Reference Number' />
                                                </span>
                                            </div>

                                            {/* <div className="form_commonblock ">
                                            <label >Subject</label>
                                            <span >
                                                {otherIcons.placeofsupply_svg}
                                                <input type="text" value={formData.subject} onChange={handleChange}
                                                    // disabled
                                                    name='subject'
                                                    placeholder='Enter Subject' />
                                            </span>
                                        </div> */}

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
                                            note="customer"
                                        />
                                    </div>

                                    <div className='secondtotalsections485s sxfc546sdfr85234e'>
                                        <div className='textareaofcreatqsiform'>
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

                                <SubmitButton isEdit={isEdit} itemId={itemId} cancel="credit-notes" />

                            </div>
                        </form>
                    </div>
                </div>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false} />
            </>}
        </>
    );
};


export default CreateCreditNotes



