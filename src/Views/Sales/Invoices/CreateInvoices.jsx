import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { quotationDetails, updateQuotation } from '../../../Redux/Actions/quotationActions';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import DatePicker from "react-datepicker";

import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import { OverflowHideBOdy } from '../../../Utils/OverflowHideBOdy';
import { Toaster, toast } from "react-hot-toast";
import Loader02 from '../../../Components/Loaders/Loader02';
import { invoiceDetailes } from '../../../Redux/Actions/invoiceActions';
import { saleOrderDetails } from '../../../Redux/Actions/saleOrderActions';
import { activeCustomerData, getCurrencyFormData, parseJSONofString, ShowMasterData, showRealatedText, stringifyJSON } from '../../Helper/HelperFunctions';
import { isPartiallyInViewport } from '../../Helper/is_scroll_focus';
import ItemSelect from '../../Helper/ComponentHelper/ItemSelect';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import { SelectAddress } from '../../Common/SelectAddress';
import { SubmitButton2 } from '../../Common/Pagination/SubmitButton';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import { formatDate } from '../../Helper/DateFormat';
import GenerateAutoId from '../Common/GenerateAutoId';
import TextAreaComponentWithTextLimit from '../../Helper/ComponentHelper/TextAreaComponentWithTextLimit';

const CreateSalesOrders = ({ section }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const cusList = activeCustomerData();
    const addUpdate = useSelector((state) => state?.updateAddress);
    const [cusData, setcusData] = useState(null);
    const [viewAllCusDetails, setViewAllCusDetails] = useState(false);
    const quoteCreate = useSelector((state) => state?.quoteUpdate);
    const paymentTerms = ShowMasterData("8");
    const challanType = ShowMasterData("16");

    const invoiceDetail = useSelector((state) => state?.invoiceDetail);
    const invoiceDetails = invoiceDetail?.data?.data?.Invoice;

    const saleDetail = useSelector((state) => state?.saleDetail);

    const saleDetails = saleDetail?.data?.data?.salesOrder;
    const [isCustomerSelect, setIsCustomerSelect] = useState(false);

    const [isItemSelect, setIsItemSelect] = useState(false);
    const quoteDetail = useSelector((state) => state?.quoteDetail);
    const quoteDetails = quoteDetail?.data?.data?.quotation;
    const [fetchDetails, setFetchDetails] = useState(null);


    const [showAllSequenceId, setShowAllSequenceId] = useState([]);


    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, convert, duplicate: isDuplicate } = Object.fromEntries(params.entries());

    useEffect(() => {
        if (itemId && isEdit || itemId && isDuplicate) {
            setFetchDetails(invoiceDetails);
        } else if (itemId && (convert === "quotationToInvoice")) {
            setFetchDetails(quoteDetails);

        } else if (itemId && convert === "saleToInvoice") {
            setFetchDetails(saleDetails);

        } else if (itemId && convert === "challanToInvoice") {
            setFetchDetails(invoiceDetails);
        }
    }, [itemId, isEdit, convert, quoteDetails, saleDetails, invoiceDetails, isDuplicate])


    const [formData, setFormData] = useState({
        sale_type: 'invoice',
        is_invoice: section === "delivery_challan" ? 0 : 1,
        transaction_date: formatDate(new Date()),
        warehouse_id: localStorage.getItem('selectedWarehouseId') || '',
        invoice_id: null,
        customer_id: '',
        upload_image: null,
        customer_type: null,
        customer_name: null,
        display_name: null,
        sale_order_id: 0,
        phone: null,
        id: 0,
        email: null,
        address: [
            {}
        ],
        reference_no: "",
        payment_terms: "",
        payment_term_day: null,
        currency: getCurrencyFormData,
        place_of_supply: '',
        due_date: formatDate(new Date()),
        sale_person: '',
        customer_note: null,
        terms_and_condition: null,
        fy: localStorage.getItem('FinancialYear') || 2024,
        subtotal: null,
        shipping_charge: null,
        adjustment_charge: null,
        total: null,
        tax_amount: null,
        challan_type_id: null,

        items: [
            {

                item_id: "",
                unit_id: null,
                quantity: 1,
                gross_amount: null,
                rate: null,
                final_amount: null,
                tax_rate: null,
                tax_amount: null,
                discount: 0,
                discount_type: 1,
                item_remark: null,
                tax_name: ""
            }
        ],
    });

    // console.log("first", formData?.invoice_id)

    useEffect(() => {
        if ((itemId && isEdit && fetchDetails) || (itemId && isDuplicate && fetchDetails) || (itemId && convert && fetchDetails)) {
            let parsedAddress = {};
            if (fetchDetails?.address) {
                try {
                    parsedAddress = JSON.parse(fetchDetails?.address);
                } catch (error) {
                    console.error("Error parsing address:", error);
                }
            }

            const calculateTotalTaxAmount = () => {
                return fetchDetails?.items?.reduce((total, entry) => {
                    return total + ((entry?.tax_amount) ? parseFloat(entry?.tax_amount) : 0);
                }, 0);
            };

            const itemsFromApi = fetchDetails?.items?.map(item => ({
                item_id: (+item?.item_id),
                quantity: (+item?.quantity),
                gross_amount: (+item?.gross_amount),
                rate: (+item?.rate),
                final_amount: (+item?.final_amount),
                tax_rate: (+item?.tax_rate),
                tax_amount: (+item?.tax_amount),
                unit_id: (item?.unit_id),
                discount: (+item?.discount),
                discount_type: (+item?.discount_type),
                item_remark: item?.item_remark,
                tax_name: item?.item?.tax_preference === "1" ? "Taxable" : "Non-Taxable",
            }));
            setFormData({
                ...formData,
                id: isEdit ? fetchDetails?.id : 0,
                sale_type: "invoice",
                transaction_date: fetchDetails?.created_at,
                warehouse_id: fetchDetails?.warehouse_id,
                sale_order_id: fetchDetails?.quotation_id,
                customer_id: (+fetchDetails?.customer_id),
                upload_image: fetchDetails?.upload_image,
                customer_type: fetchDetails?.customer_type,
                display_name: fetchDetails?.display_name,
                challan_type_id: fetchDetails?.challan_type_id,
                phone: fetchDetails?.phone,
                email: fetchDetails?.email,
                reference_no: fetchDetails.reference_no === "0" ? "" : fetchDetails.reference_no,
                payment_terms: fetchDetails?.payment_terms,
                currency: fetchDetails?.currency,
                place_of_supply: fetchDetails?.place_of_supply === "0" ? "" : fetchDetails?.place_of_supply,
                delivery_method: fetchDetails?.delivery_method,
                sale_person: fetchDetails?.sale_person === "0" ? "" : fetchDetails?.sale_person,
                customer_note: fetchDetails?.customer_note,
                terms_and_condition: fetchDetails?.terms_and_condition,
                fy: fetchDetails?.fy,
                subtotal: fetchDetails?.subtotal,
                shipping_charge: fetchDetails?.shipping_charge,
                adjustment_charge: fetchDetails?.adjustment_charge,
                total: fetchDetails?.total,
                tax_amount: calculateTotalTaxAmount(),
                items: itemsFromApi || [],
                address: parsedAddress || [{ billing: {}, shipping: {} }],
                tracking_details: stringifyJSON({
                    ...(convert === "saleToInvoice" && { module: convert, id: itemId }),
                    ...(fetchDetails?.tracking_details && { module_data: parseJSONofString(fetchDetails?.tracking_details) })
                })

            });


            setAddSelect({
                billing: parsedAddress?.billing || {},
                shipping: parsedAddress?.shipping || {}
            });

            setcusData(fetchDetails?.customer);

            if (fetchDetails?.customer_id) {
                setIsCustomerSelect(true);
            }

            setIsItemSelect(fetchDetails?.items?.length > 0);

            if (fetchDetails?.upload_image) {
                setImgeLoader("success");
            }

        }
    }, [fetchDetails, itemId, isEdit, convert, isDuplicate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'shipping_charge' || name === 'adjustment_charge') {
            newValue = parseFloat(value) || 0; // Convert to float or default to 0
        }

        if (name === "customer_id" && value !== "") {
            setIsCustomerSelect(true);
        } else if (name === "customer_id" && value == "") {
            setIsCustomerSelect(false);
        }

        if (name === "customer_id") {
            const selectedItem = cusList?.data?.user?.find(cus => cus.id == value);

            const findfirstbilling = selectedItem?.address?.find(val => val?.is_billing === "1")
            const findfirstshipping = selectedItem?.address?.find(val => val?.is_shipping === "1")
            setAddSelect({
                billing: findfirstbilling,
                shipping: findfirstshipping,
            });
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
            ...(name === "customer_id" && { payment_terms: cusData?.payment_terms === "0" ? null : cusData?.payment_terms }),
            total: calculateTotal(formData.subtotal, formData.shipping_charge, formData.adjustment_charge),
            address: addSelect ? JSON.stringify(addSelect) : null, // Convert address array to string if addSelect is not null

            ...(name === "payment_terms" && value !== "5" && {
                due_date: calculateExpiryDate(new Date(prev.transaction_date), value),
                payment_term_day: ["1", "2", "3", "4"].includes(value) ? [15, 30, 45, 60][value - 1] : null
            }),

        }));
    };


    const handleDateChange = (date, name) => {
        setFormData(prev => ({
            ...prev,
            [name]: date,

            ...(name === 'due_date' && { payment_terms: "5" }),
            ...(name === 'transaction_date' && prev.payment_terms !== "5" && {
                due_date: calculateExpiryDate(new Date(date), prev.payment_terms)
            }),
        }));
    };

    const [addSelect, setAddSelect] = useState({
        billing: "",
        shipping: ""
    });


    //set selected billing and shipping addresses inside formData
    useEffect(() => {
        setFormData({
            ...formData,
            address: addSelect
        })
    }, [addSelect])
    //set selected billing and shipping addresses inside formData



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


    const calculateTotal = (subtotal, shippingCharge, adjustmentCharge) => {
        const subTotalValue = parseFloat(subtotal) || 0;
        const shippingChargeValue = parseFloat(shippingCharge) || 0;
        const adjustmentChargeValue = parseFloat(adjustmentCharge) || 0;
        return (subTotalValue + shippingChargeValue + adjustmentChargeValue).toFixed(2);
    };

    const calculateExpiryDate = (transactionDate, terms) => {
        const daysMap = { "1": 15, "2": 30, "3": 45, "4": 60 };
        return new Date(transactionDate.setDate(transactionDate.getDate() + (daysMap[terms] || 0)));
    };

    const Navigate = useNavigate()

    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const buttonName = e.nativeEvent.submitter.name;
        if (!isCustomerSelect) {
            if (!isPartiallyInViewport(dropdownRef1.current)) {
                dropdownRef1.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setTimeout(() => {
                dropdownRef1.current.focus();
            }, 500);

        } else if (!isItemSelect) {
            if (!isPartiallyInViewport(dropdownRef2.current)) {
                dropdownRef2.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setTimeout(() => {
                dropdownRef2.current.focus();
            }, 500);

        } else {
            try {
                // const { tax_name, ...formDataWithoutTaxName } = formData;
                const updatedItems = formData?.items?.map((item) => {
                    const { tax_name, ...itemWithoutTaxName } = item;
                    return itemWithoutTaxName;
                });
                dispatch(updateQuotation({
                    ...formData, items: updatedItems, transaction_date: formatDate(formData.transaction_date), due_date: formatDate(formData.due_date), address: JSON.stringify(formData?.address)
                }, Navigate, section, isEdit, buttonName, showAllSequenceId, itemId, convert));
            } catch (error) {
                toast.error('Error updating quotation:', error);
            }

        }
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            customer_type: cusData?.customer_type,
            display_name: cusData ? `${cusData.first_name} ${cusData.last_name}` : '',
            email: cusData?.email,
            phone: cusData?.mobile_no,
            address: addSelect

        }));
    }, [cusData]);


    useEffect(() => {
        const sendData = {
            id: itemId,
            is_invoice: section === "delivery_challan" ? 0 : 1,
        }
        if (itemId && !invoiceDetails) {
            dispatch(invoiceDetailes(sendData))
        } else if (itemId && convert === "quotationToInvoice" && !quoteDetails) {
            dispatch(quotationDetails(sendData));

        } else if (itemId && convert === "saleToInvoice" && !saleDetails) {
            dispatch(saleOrderDetails(sendData));
        }

    }, [dispatch]);

    // dropdown
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

    return (
        <>
            {(invoiceDetail?.loading || quoteDetail?.loading) ? <Loader02 /> : <>
                <TopLoadbar />
                {(quoteCreate?.loading || addUpdate?.loading || freezLoadingImg || quoteCreate?.loading) && <MainScreenFreezeLoader />}
                <div className='formsectionsgrheigh'>
                    <div id="Anotherbox" className='formsectionx2'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                <svg height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg" id="fi_9485672"><g id="Layer_2" data-name="Layer 2"><path d="m5.75 3.5v8.5a.75.75 0 0 1 -.5.7.7.7 0 0 1 -.25.05h-3a.76.76 0 0 1 -.75-.75v-8.5a2.24 2.24 0 0 1 2.12-2.24h.13a2.25 2.25 0 0 1 2.25 2.24z" fill="#145638"></path><path d="m20.75 7v13.78a1.75 1.75 0 0 1 -2.58 1.54l-.32-.18a2.17 2.17 0 0 0 -1.35-.41 2.21 2.21 0 0 0 -1.37.42 3.94 3.94 0 0 1 -4.26 0 2.28 2.28 0 0 0 -1.37-.41 2.24 2.24 0 0 0 -1.36.41l-.31.18a1.75 1.75 0 0 1 -2.58-1.54v-17.54a2 2 0 0 0 -1.88-2h11.63a5.76 5.76 0 0 1 5.75 5.75z" fill="#0db561"></path><g fill="#fff"><path d="m16.5 7.75h-7a.75.75 0 0 1 0-1.5h7a.75.75 0 0 1 0 1.5z"></path><path d="m13.5 15.75h-4a.75.75 0 0 1 0-1.5h4a.75.75 0 0 1 0 1.5z"></path><path d="m16.5 11.75h-7a.75.75 0 0 1 0-1.5h7a.75.75 0 0 1 0 1.5z"></path></g></g></svg>
                                {isEdit ?
                                    <>
                                        {showRealatedText(section, "invoice_receive", "Invoice Receive", "delivery_challan", "Update Delivery Challan", "Update Invoice")}
                                    </>
                                    :
                                    <>
                                        {showRealatedText(section, "invoice_receive", "Invoice Receive", "delivery_challan", "New Delivery Challan", "New Invoice")}
                                    </>
                                }
                            </h1>
                        </div>
                        <div id="buttonsdata">
                            <Link to={"/dashboard/invoices"} className="linkx3">
                                <RxCross2 />
                            </Link>
                        </div>
                    </div>

                    <div id="formofcreateitems" >
                        <form onSubmit={handleFormSubmit}>
                            <div className="relateivdiv">
                                {/* <div className=""> */}
                                <div className="itemsformwrap">
                                    <div className="f1wrapofcreq">
                                        <div className="form_commonblock">
                                            <label >Customer Name<b className='color_red'>*</b></label>
                                            <div id='sepcifixspanflex'>
                                                <span id=''>
                                                    {otherIcons.name_svg}
                                                    <CustomDropdown10
                                                        ref={dropdownRef1}
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
                                                                >Hide customer information</button>
                                                                :
                                                                <button type="button" onClick={() => setViewAllCusDetails(true)}
                                                                    onKeyDown={(event) => {
                                                                        if (event.key === 'Enter') {
                                                                            setViewAllCusDetails(true)
                                                                        }
                                                                    }}
                                                                >View customer information</button>

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
                                                <label >{section === "delivery_challan" ? "Challan" : "Invoice"}<b className='color_red'>*</b></label>
                                                <GenerateAutoId
                                                    formHandlers={{ setFormData, handleChange, setShowAllSequenceId }}
                                                    nameVal="invoice_id"
                                                    value={formData?.invoice_id}
                                                    module={section === "delivery_challan" ? "delivery_challan" : "invoice"}
                                                    showField={isEdit}
                                                />

                                            </div>
                                            <div className="form_commonblock">
                                                <label >{section === "delivery_challan" ? "Challan Date" : "Invoice Date"}<b className='color_red'>*</b></label>
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
                                                        placeholderText="Enter Quotation Date"
                                                        dateFormat="dd-MM-yyy"
                                                    />

                                                </span>
                                            </div>

                                            <div className="form_commonblock">
                                                <label>Payment Terms</label>
                                                <span>
                                                    {otherIcons.vendor_svg}
                                                    <CustomDropdown04
                                                        label="Reason Name"
                                                        options={paymentTerms}
                                                        value={formData?.payment_terms}
                                                        onChange={handleChange}
                                                        name="payment_terms"
                                                        defaultOption='Select Payment Terms'
                                                        type="masters"
                                                    />
                                                </span >
                                            </div>
                                            <div className="form_commonblock">
                                                <label>Due date</label>
                                                <span>
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                        selected={formData.due_date}
                                                        onChange={(date) =>
                                                            setFormData({
                                                              ...formData,
                                                              due_date: formatDate(date),
                                                            })
                                                          }
                                                        name='due_date'
                                                        placeholderText="Enter Due date"
                                                        dateFormat="dd-MM-yyy"
                                                        minDate={formData?.transaction_date}
                                                    />

                                                </span>
                                            </div>

                                            {section === "delivery_challan" &&
                                                <div className="form_commonblock">
                                                    <label>Challan Type</label>
                                                    <span>
                                                        {otherIcons.vendor_svg}
                                                        <CustomDropdown04
                                                            label="Reason Name"
                                                            options={challanType}
                                                            value={formData?.challan_type_id}
                                                            onChange={handleChange}
                                                            name="challan_type_id"
                                                            defaultOption='Select Challan Type'
                                                            type="masters"
                                                        />
                                                    </span >
                                                </div>
                                            }

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


                                            <div className="form_commonblock ">
                                                <label >Reference</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input type="text" value={formData.reference_no} onChange={handleChange}
                                                        // disabled
                                                        autoComplete='off'
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
                                            note="customer"
                                        />

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
                                </div>
                                <SubmitButton2 isEdit={isEdit} itemId={itemId} cancel={showRealatedText(section, "invoice_receive", "invoice-approval", "delivery_challan", "delivery_challan", "invoices")}
                                />
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


export default CreateSalesOrders



