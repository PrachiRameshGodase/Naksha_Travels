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
import { Toaster, toast } from "react-hot-toast";
import { saleOrderDetails } from '../../../Redux/Actions/saleOrderActions';
import Loader02 from '../../../Components/Loaders/Loader02';
import ItemSelect from '../../Helper/ComponentHelper/ItemSelect';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import { isPartiallyInViewport } from '../../Helper/is_scroll_focus';
import { activeCustomerData, getCurrencyFormData, ShowMasterData, stringifyJSON } from '../../Helper/HelperFunctions';
import SubmitButton from '../../Common/Pagination/SubmitButton';
import { SelectAddress } from '../../Common/SelectAddress';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import ShowCustomerInfoButton from '../../Common/InsideSubModulesCommon/ShowCustomerInfoButton';
// import GenerateAutoId from '../Quotations/GenerateAutoId';
import GenerateAutoId from '../Common/GenerateAutoId';
import TextAreaComponentWithTextLimit from '../../Helper/ComponentHelper/TextAreaComponentWithTextLimit';
import { formatDate } from '../../Helper/DateFormat';
const CreateSalesOrders = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const cusList = activeCustomerData();
    const addUpdate = useSelector((state) => state?.updateAddress);
    const [cusData, setcusData] = useState(null);
    const [viewAllCusDetails, setViewAllCusDetails] = useState(false);
    const paymentTerms = ShowMasterData("8");

    const saleDetail = useSelector((state) => state?.saleDetail);
    const saleDetails = saleDetail?.data?.data?.salesOrder;

    const [isCustomerSelect, setIsCustomerSelect] = useState(false);
    const [isItemSelect, setIsItemSelect] = useState(false);

    const saleStatus = useSelector((state) => state?.saleStatus);
    const quoteCreate = useSelector((state) => state?.quoteUpdate);


    const quoteDetail = useSelector((state) => state?.quoteDetail);
    const quoteDetails = quoteDetail?.data?.data?.quotation;
    const [fetchDetails, setFetchDetails] = useState([]);

    const [showAllSequenceId, setShowAllSequenceId] = useState([]);

    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, convert } = Object.fromEntries(params.entries());

    useEffect(() => {
        if (itemId && isEdit) {
            setFetchDetails(saleDetails);
        } else if (itemId && (convert === "toInvoice" || convert === "quotationToSale")) {
            setFetchDetails(quoteDetails);
        }
    }, [itemId, isEdit, saleDetails, quoteDetails, convert]);



    const [formData, setFormData] = useState({
        sale_type: 'sale_order',
        transaction_date: formatDate(new Date()),
        warehouse_id: localStorage.getItem('selectedWarehouseId') || '',
        sale_order_id: null,
        customer_id: '',
        upload_image: null,
        customer_type: null,
        customer_name: null,
        display_name: null,
        phone: null,
        email: null,
        discount: null,
        address: [
            {}
        ],
        reference_no: "",
        // subject: "",
        payment_terms: null,
        delivery_method: "",
        currency: getCurrencyFormData,
        place_of_supply: "",
        shipment_date: formatDate(new Date()),
        sale_person: '',
        customer_note: null,
        terms_and_condition: null,
        fy: localStorage.getItem('FinancialYear') || 2024,
        subtotal: null,
        shipping_charge: null,
        adjustment_charge: null,
        total: null,
        tax_amount: null,
        items: [
            {

                item_id: '',
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
console.log("formatDate",formData)
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
            })
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
            ...(name === "customer_id" && { payment_terms: cusData?.payment_terms === "0" ? null : cusData?.payment_terms }),

            total: calculateTotal(formData.subtotal, formData.shipping_charge, formData.adjustment_charge),
            address: addSelect ? JSON.stringify(addSelect) : null, // Convert address array to string if addSelect is not null
        }));
    };
    // console.log("formdaaaaaaaaaa", formData?.payment_terms)
    // console.log("cusData", cusData)

    // addresssssssssssssssssssssssssssssssssssssssssssssssssssssssss

    // for address select
    const [addSelect, setAddSelect] = useState({
        billing: "",
        shipping: ""
    });

    // console.log("addSelect", addSelect)

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


    const calculateTotal = (subtotal, shippingCharge, adjustmentCharge) => {
        const subTotalValue = parseFloat(subtotal) || 0;
        const shippingChargeValue = parseFloat(shippingCharge) || 0;
        const adjustmentChargeValue = parseFloat(adjustmentCharge) || 0;
        return (subTotalValue + shippingChargeValue + adjustmentChargeValue).toFixed(2);
    };

    const Navigate = useNavigate()

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
                dispatch(updateQuotation({ ...formData, items: updatedItems, address: JSON.stringify(formData?.address) }, Navigate, "sale-order", isEdit, buttonName, showAllSequenceId, itemId, convert));

            } catch (error) {
                toast.error('Error updating quotation:', error);
            }

        }
    };


    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            customer_type: cusData?.customer_type,
            email: cusData?.email,
            phone: cusData?.mobile_no,
            display_name: cusData?.display_name,
            address: cusData?.address?.length,
            address: addSelect,
            currency: cusData?.currency,
            place_of_supply: cusData?.place_of_supply,

        }));
    }, [cusData]);

    const handleDateChange = (date, name) => {
        setFormData(prev => ({
            ...prev,
            [name]: date,
        }));
    };


    // dropdown
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);


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
        if (itemId && isEdit && fetchDetails || itemId && convert) {
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
                discount: (+item?.discount),
                discount_type: (+item?.discount_type),
                unit_id: (item?.unit_id),
                item_remark: item?.item_remark,
                tax_name: item?.item?.tax_preference === "1" ? "Taxable" : "Non-Taxable"
            }));
            setFormData({
                ...formData,
                id: isEdit ? fetchDetails?.id : 0,
                sale_type: convert === "toInvoice" ? "invoice" : 'sale_order',
                transaction_date: fetchDetails?.created_at,
                warehouse_id: fetchDetails?.warehouse_id,
                sale_order_id: fetchDetails?.sale_order_id || "SO-00001",
                customer_id: (+fetchDetails?.customer_id),
                upload_image: fetchDetails?.upload_image,
                customer_type: fetchDetails?.customer_type,
                customer_name: fetchDetails?.customer_name,
                display_name: fetchDetails?.display_name === "0" ? "" : fetchDetails?.display_name,
                phone: fetchDetails?.phone,
                email: fetchDetails?.email,
                reference_no: fetchDetails?.reference_no === "0" ? "" : fetchDetails?.reference_no,
                payment_terms: (fetchDetails?.payment_terms),
                currency: fetchDetails?.currency,
                place_of_supply: fetchDetails?.place_of_supply,
                delivery_method: fetchDetails?.delivery_method === "0" ? "" : fetchDetails?.delivery_method,
                sale_person: fetchDetails?.sale_person === "0" ? "" : fetchDetails?.sale_person,
                customer_note: fetchDetails?.customer_note,
                terms_and_condition: fetchDetails?.terms_and_condition,
                tax_amount: calculateTotalTaxAmount(),
                shipment_date: convert ? fetchDetails?.expiry_date : fetchDetails?.shipment_date,

                fy: fetchDetails?.fy,
                subtotal: fetchDetails?.subtotal,
                shipping_charge: fetchDetails?.shipping_charge,
                adjustment_charge: fetchDetails?.adjustment_charge,
                total: fetchDetails?.total,

                tracking_details: convert ? stringifyJSON({
                    module: convert,
                    id: itemId
                }) : null,
                items: itemsFromApi || [],

            });

            if (fetchDetails?.upload_image) {
                setImgeLoader("success")
            }

            if (fetchDetails?.address) {
                const parsedAddress = fetchDetails?.address ? JSON.parse(fetchDetails?.address) : [];

                const dataWithParsedAddress = {
                    ...fetchDetails,
                    address: parsedAddress
                };
                setAddSelect({
                    billing: dataWithParsedAddress?.address?.billing,
                    shipping: dataWithParsedAddress?.address?.shipping,
                })

                setcusData(dataWithParsedAddress?.customer);
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
    }, [itemId, isEdit, convert, fetchDetails])



    useEffect(() => {
        if (itemId && isEdit && !saleDetails) {
            dispatch(saleOrderDetails({ id: itemId, fy: localStorage.getItem('FinancialYear') }));

        } else if (itemId && convert && !quoteDetails) {
            dispatch(quotationDetails({ id: itemId, fy: localStorage.getItem('FinancialYear') }))
        }
    }, [dispatch, isEdit, itemId]);
    return (
        <>
            {saleDetail?.loading === true || quoteDetail?.loading === true ? <Loader02 /> : <>

                {(quoteCreate?.loading || saleStatus?.loading || addUpdate?.loading) && <MainScreenFreezeLoader />}
                <TopLoadbar />

                <div className='formsectionsgrheigh'>
                    <div id="Anotherbox" className='formsectionx2'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                <svg id="fi_9431186" height="512" viewBox="0 0 60 60" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m8.6 20h23.33l16.28 8.63-3.63 11.91a2.4 2.4 0 0 1 -2.17 1.7l-29.58 1.55z" fill="#d5e4ef"></path><circle cx="19" cy="55" fill="#262a33" r="4"></circle><circle cx="37" cy="55" fill="#262a33" r="4"></circle><circle cx="45" cy="15" fill="#19cc61" r="14"></circle><path d="m29 28h-13a1 1 0 0 1 0-2h13a1 1 0 0 1 0 2z" fill="#b9c9d6"></path><path d="m40 36h-23a1 1 0 0 1 0-2h23a1 1 0 0 1 0 2z" fill="#b9c9d6"></path><path d="m43 22a1 1 0 0 1 -.707-.293l-4-4a1 1 0 0 1 1.414-1.414l3.138 3.138 7.323-10.986a1 1 0 1 1 1.664 1.11l-8 12a1 1 0 0 1 -.732.445c-.035 0-.068 0-.1 0z" fill="#fff"></path><path d="m44 52-31.756-.007a3.24 3.24 0 0 1 -2.744-4.958l2.314-3.514c-.185-.777-.409-2.031-.768-4.051l-4.185-23.47h-5.861a1 1 0 0 1 0-2h6.7a1 1 0 0 1 .985.824s5.081 28.529 5.128 28.788a1.008 1.008 0 0 1 -.149.731l-2.484 3.772a1.241 1.241 0 0 0 1.065 1.878l31.755.007a1 1 0 0 1 0 2z" fill="#b9c9d6"></path></svg>
                                {isEdit ? "Update Sale Order" : " New Sale Order"}
                            </h1>
                        </div>
                        <div id="buttonsdata">
                            <Link to={"/dashboard/sales-orders"} className="linkx3">
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
                                                        autoComplete='off'
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
                                                    <ShowCustomerInfoButton cusData={cusData} viewAllCusDetails={viewAllCusDetails} setViewAllCusDetails={setViewAllCusDetails} />
                                                </span>
                                                {!isCustomerSelect && <p className="error-message" style={{ whiteSpace: "nowrap" }}>
                                                    {otherIcons.error_svg}
                                                    Please Select Customer</p>}

                                                <SelectAddress addSelect={addSelect} setAddSelect={setAddSelect} formData={formData} setFormData={setFormData} cusData={cusData} isEdit={isEdit} itemId={itemId} viewAllCusDetails={viewAllCusDetails} setViewAllCusDetails={setViewAllCusDetails} type='customer' />

                                            </div>

                                        </div>

                                        <div className="f1wrapofcreqx1">
                                            <div className="form_commonblock">
                                                <label >Sales Order<b className='color_red'>*</b></label>
                                                <GenerateAutoId
                                                    formHandlers={{ setFormData, handleChange, setShowAllSequenceId }}
                                                    nameVal="sale_order_id"
                                                    value={formData?.sale_order_id}
                                                    module="sale_order"
                                                    showField={isEdit}
                                                />


                                            </div>
                                            <div className="form_commonblock">
                                                <label >Sales Order Date<b className='color_red'>*</b></label>
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
                                                        name='transaction_date'

                                                        placeholderText="Enter Sale Order Date"
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
                                                        defaultOption='Enter Payment Terms'
                                                        type="masters"
                                                    />
                                                </span >
                                            </div>


                                            {/* <div className="form_commonblock">
                                                <CurrencySelect
                                                    value={formData?.currency}
                                                    onChange={handleChange}
                                                />
                                            </div> */}

                                            <div className="form_commonblock">
                                                <label>Expected Shipment Date</label>
                                                <span>
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                                      selected={formData.shipment_date}
                                                                      onChange={(date) =>
                                                                        setFormData({
                                                                          ...formData,
                                                                          shipment_date: formatDate(date),
                                                                        })
                                                                      }
                                                        name='shipment_date'
                                                        placeholderText="Enter Expected Shipment Date"
                                                        dateFormat="dd-MM-yyy"
                                                        autoComplete='off'
                                                        minDate={formData.transaction_date}
                                                    />
                                                </span>
                                            </div>


                                            <div className="form_commonblock">
                                                <label >Place of Supply</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input
                                                        autoComplete='off'
                                                        type="text"
                                                        value={formData.place_of_supply === "0" ? "" : formData.place_of_supply}
                                                        onChange={handleChange}
                                                        name='place_of_supply'

                                                        placeholder='Enter Place Of Supply'
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
                                                        value={formData?.sale_person}
                                                        name='sale_person'
                                                        onChange={handleChange}
                                                        placeholder='Enter Sales Person'
                                                    />
                                                </span>
                                            </div>
                                            <div className="form_commonblock">
                                                <label>Delivery Method</label>
                                                <span >
                                                    {otherIcons.vendor_svg}
                                                    <input
                                                        autoComplete='off'
                                                        type="text"
                                                        value={formData.delivery_method}
                                                        name='delivery_method'
                                                        onChange={handleChange}
                                                        placeholder='Enter Delivery Method'
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







                                <SubmitButton isEdit={isEdit} itemId={itemId} cancel="sales-orders" />

                            </div>
                        </form>
                    </div>
                </div>
                <Toaster
                    // position="bottom-right"
                    reverseOrder={false} />
            </>}
        </>
    );
};


export default CreateSalesOrders



