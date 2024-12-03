import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { quotationDetails, updateQuotation } from '../../../Redux/Actions/quotationActions';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import DatePicker from "react-datepicker";
import Loader02 from '../../../Components/Loaders/Loader02'
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import { Toaster, toast } from "react-hot-toast";
import ItemSelect from '../../Helper/ComponentHelper/ItemSelect';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import { isPartiallyInViewport } from '../../Helper/is_scroll_focus';
import { getCurrencyFormData, ShowMasterData } from '../../Helper/HelperFunctions';
import SubmitButton from '../../Common/Pagination/SubmitButton';
import { SelectAddress } from '../../Common/SelectAddress';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import GenerateAutoId from '../Common/GenerateAutoId';
import WaveLoader from '../../../Components/Loaders/WaveLoader';
import CurrencySelect from '../../Helper/ComponentHelper/CurrencySelect';
import TextAreaComponentWithTextLimit from '../../Helper/ComponentHelper/TextAreaComponentWithTextLimit';
import { formatDate } from '../../Helper/DateFormat';
const CreateQuotation = () => {
    const dispatch = useDispatch();
    const cusList = useSelector((state) => state?.customerList);
    const addUpdate = useSelector((state) => state?.updateAddress);
    const quoteDetail = useSelector((state) => state?.quoteDetail);
    const quoteCreate = useSelector((state) => state?.quoteUpdate);
    const quoteDetails = quoteDetail?.data?.data?.quotation;
    const autoId = useSelector(state => state?.autoId);

    const [showAllSequenceId, setShowAllSequenceId] = useState([]);
    // console.log("all sequence data", showAllSequenceId)


    const [cusData, setcusData] = useState(null);
    const [viewAllCusDetails, setViewAllCusDetails] = useState(false);
    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit } = Object.fromEntries(params.entries());

    const [isCustomerSelect, setIsCustomerSelect] = useState(false);
    const [isItemSelect, setIsItemSelect] = useState(false);

    const [imgLoader, setImgeLoader] = useState("");
    const [freezLoadingImg, setFreezLoadingImg] = useState(false);

    const paymentTerms = ShowMasterData("8");

    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

    const [formData, setFormData] = useState({
        sale_type: 'quotation',
        transaction_date: formatDate(new Date()),
        warehouse_id: localStorage.getItem('selectedWarehouseId') || '',
        quotation_id: null,
        customer_id: '',
        upload_image: null,
        customer_type: null,
        display_name: null,
        phone: null,
        email: null,
        address: "",
        reference_no: "",
        // subject: "",
        currency: getCurrencyFormData,
        // place_of_supply: '',
        expiry_date: formatDate(new Date()),
        sale_person: '',
        payment_terms: "",
        delivery_method: '',
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

    const calculateExpiryDate = (transactionDate, terms) => {
        const daysMap = { "1": 15, "2": 30, "3": 45, "4": 60 };
        return new Date(transactionDate.setDate(transactionDate.getDate() + (daysMap[terms] || 0)));
    };

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
            total: calculateTotal(formData.subtotal, formData.shipping_charge, formData.adjustment_charge),
            address: addSelect ? JSON.stringify(addSelect) : null,

            ...(name === "payment_terms" && value !== "5" && {
                expiry_date: calculateExpiryDate(new Date(prev.transaction_date), value)
            })
        }));
    };

    const handleDateChange = (date, name) => {
        setFormData(prev => ({
            ...prev,
            [name]: date,
            ...(name === 'expiry_date' && { payment_terms: "5" }),
            ...(name === 'transaction_date' && prev.payment_terms !== "5" && {
                expiry_date: calculateExpiryDate(new Date(date), prev.payment_terms)
            })
        }));
    };

    // addresssssssssssssssssssssssssssssssssssssssssssssssssssssssss

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

    // addresssssssssssssssssssssssssssssssssssssssssssssssssssssssss


    const calculateTotal = (subtotal, shippingCharge, adjustmentCharge) => {
        const subTotalValue = parseFloat(subtotal) || 0;
        const shippingChargeValue = parseFloat(shippingCharge) || 0;
        const adjustmentChargeValue = parseFloat(adjustmentCharge) || 0;
        return (subTotalValue + shippingChargeValue + adjustmentChargeValue).toFixed(2);
    };

    const Navigate = useNavigate();

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
                const updatedItems = formData?.items?.map((item) => {
                    const { tax_name, ...itemWithoutTaxName } = item;
                    return itemWithoutTaxName;
                });

                dispatch(updateQuotation({ ...formData, items: updatedItems, address: JSON.stringify(formData?.address) }, Navigate, "quotation", isEdit, buttonName, showAllSequenceId));

            } catch (error) {
                toast.error('Error updating quotation:', error);
            }
        }

    };

    useEffect(() => {
        if (itemId && isEdit && quoteDetails) {
            const calculateTotalTaxAmount = () => {
                return quoteDetails.items?.reduce((total, entry) => {
                    return total + ((entry?.tax_amount) ? parseFloat(entry?.tax_amount) : 0);
                }, 0);
            };
            const itemsFromApi = quoteDetails.items?.map(item => ({
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
                id: quoteDetails.id,
                sale_type: 'quotation',
                transaction_date: quoteDetails.transaction_date,
                warehouse_id: quoteDetails.warehouse_id,
                quotation_id: quoteDetails.quotation_id,
                customer_id: (+quoteDetails.customer_id),
                upload_image: quoteDetails.upload_image,
                customer_type: quoteDetails.customer_type,
                display_name: quoteDetails.display_name,
                phone: quoteDetails.phone,
                email: quoteDetails.email,
                reference_no: quoteDetails.reference_no === "0" ? "" : quoteDetails.reference_no,
                currency: quoteDetails.currency,
                expiry_date: quoteDetails.expiry_date,
                sale_person: quoteDetails.sale_person,
                payment_terms: quoteDetails.payment_terms,
                delivery_method: quoteDetails.delivery_method === "0" ? "" : quoteDetails.delivery_method,
                customer_note: quoteDetails.customer_note,
                terms_and_condition: quoteDetails.terms_and_condition,
                fy: quoteDetails.fy,
                subtotal: quoteDetails.subtotal,
                shipping_charge: quoteDetails.shipping_charge,
                adjustment_charge: quoteDetails.adjustment_charge,
                tax_amount: calculateTotalTaxAmount(),
                total: quoteDetails.total,
                status: quoteDetails.status,
                items: itemsFromApi || []
            });

            if (quoteDetails.upload_image) {
                setImgeLoader("success");
            }

            if (quoteDetails?.address) {
                const parsedAddress = JSON.parse(quoteDetails?.address);
                const dataWithParsedAddress = {
                    ...quoteDetails,
                    address: parsedAddress
                };
                setAddSelect({
                    billing: dataWithParsedAddress?.address?.billing,
                    shipping: dataWithParsedAddress?.address?.shipping,
                });
                setcusData(dataWithParsedAddress?.customer)
            }

            if (quoteDetails?.customer_id) {
                setIsCustomerSelect(true);
            }

            if (!quoteDetails?.items) {
                setIsItemSelect(false);
            } else {
                setIsItemSelect(true);
            }

        }
    }, [quoteDetails, itemId, isEdit]);


    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            customer_type: cusData?.customer_type,
            display_name: cusData?.display_name,
            email: cusData?.email,
            phone: cusData?.mobile_no,
            address: addSelect,
        }));
    }, [cusData]);


    useEffect(() => {
        if (!quoteDetails && itemId) {
            dispatch(quotationDetails({ id: itemId, fy: localStorage.getItem('FinancialYear'), }));
        }
    }, [dispatch]);


    return (
        <>
            {
                quoteDetail?.loading === true ? <Loader02 />
                    : <>
                        <TopLoadbar />
                        {(freezLoadingImg || quoteCreate?.loading || autoId?.loading) && <MainScreenFreezeLoader />}
                        <div className='formsectionsgrheigh'>
                            <div id="Anotherbox" className='formsectionx2'>
                                <div id="leftareax12">
                                    <h1 id="firstheading">
                                        {otherIcons?.create_quotation_icon}
                                        {isEdit ? "Update Quotation" : "New Quotation"}

                                    </h1>
                                </div>
                                <div id="buttonsdata">
                                    <Link to={"/dashboard/quotation"} className="linkx3">
                                        <RxCross2 />
                                    </Link>
                                </div>
                            </div>

                            <div id="formofcreateitems">
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
                                                        <label >Quotation ID<b className='color_red'>*</b></label>
                                                        <GenerateAutoId
                                                            formHandlers={{ setFormData, handleChange, setShowAllSequenceId }}
                                                            nameVal="quotation_id"
                                                            value={formData?.quotation_id}
                                                            module="quotation"
                                                            showField={isEdit}
                                                        />
                                                    </div>

                                                    <div className="form_commonblock">
                                                        <label >Quotation Date<b className='color_red'>*</b></label>
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
                                                                placeholderText="Enter Quotation Date" dateFormat="dd-MM-yyy"
                                                                autoComplete='off'
                                                            />
                                                        </span>
                                                    </div>

                                                    <div className="form_commonblock">
                                                        <label>Quotation Terms</label>

                                                        <span>
                                                            {otherIcons.vendor_svg}
                                                            <CustomDropdown04
                                                                autoComplete='off'
                                                                options={paymentTerms}
                                                                value={formData?.payment_terms}
                                                                onChange={handleChange}
                                                                name="payment_terms"
                                                                defaultOption='Enter Quotation Terms'
                                                                type="masters"
                                                            />
                                                        </span >
                                                    </div>

                                                    <div className="form_commonblock">
                                                        <label>Expiry Date</label>
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
                                                                name='expiry_date'
                                                                placeholderText="Enter Expiry Date"
                                                                dateFormat="dd-MM-yyy"
                                                                autoComplete='off'
                                                                minDate={formData?.transaction_date}
                                                            />
                                                        </span>
                                                    </div>

                                                    <div className="form_commonblock">
                                                        <CurrencySelect
                                                            value={formData?.currency}
                                                            onChange={handleChange}
                                                        />
                                                    </div>


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

                                                    {/* <div className="form_commonblock">
                                                <label>Sales Person</label>
                                                <span >
                                                    {otherIcons.vendor_svg}
                                                    <input
                                                        type="text"
                                                        value={formData.sale_person}
                                                        name='sale_person'
                                                        onChange={handleChange}
                                                        placeholder='Enter Sales Person'
                                                    />
                                                </span>
                                            </div> */}

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
                                                                placeholder="Enter the terms and conditions of your business to be displayed in your transaction "
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

                                        <SubmitButton isEdit={isEdit} itemId={itemId} cancel="quotation" />

                                    </div>
                                </form>
                            </div>
                        </div >
                        <Toaster
                            // position="bottom-right"
                            reverseOrder={false} />
                    </>}

        </>
    );
};

export default CreateQuotation;