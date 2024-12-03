import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DisableEnterSubmitForm from '../../Helper/DisableKeys/DisableEnterSubmitForm';
import { useDispatch, useSelector } from 'react-redux';
import { customersList } from '../../../Redux/Actions/customerActions';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import { accountLists, itemLists, vendorsLists } from '../../../Redux/Actions/listApisActions';
import Loader02 from '../../../Components/Loaders/Loader02'
import DatePicker from "react-datepicker";

import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
// import { GoPlus } from 'react-icons/go';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
// import CustomDropdown12 from '../../../Components/CustomDropdown/CustomDropdown12';
import { fetchCurrencies, fetchMasterData, updateAddresses } from '../../../Redux/Actions/globalActions';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { imageDB } from '../../../Configs/Firebase/firebaseConfig';
import { OverflowHideBOdy } from '../../../Utils/OverflowHideBOdy';
import { BsEye } from 'react-icons/bs';
import { Toaster, toast } from "react-hot-toast";
// import CustomDropdown14 from '../../../Components/CustomDropdown/CustomDropdown14';
// import { SlReload } from 'react-icons/sl';
import { paymentRecDetail, updatePaymentRec } from '../../../Redux/Actions/PaymentRecAction';
// import ViewCustomerDetails from '../Quotations/ViewCustomerDetails';
// import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import { IoCheckbox } from 'react-icons/io5';
import { formatDate, todayDate } from '../../Helper/DateFormat';
import CustomDropdown15 from '../../../Components/CustomDropdown/CustomDropdown15';
import { getAccountTypes } from '../../../Redux/Actions/accountsActions';
import { billDetails, pendingBillLists } from '../../../Redux/Actions/billActions';
import NumericInput from '../../Helper/NumericInput';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import GenerateAutoId from '../../Sales/Common/GenerateAutoId';
import { currencySymbol, handleDropdownError, showAmountWithCurrencySymbol } from '../../Helper/HelperFunctions';
import TextAreaComponentWithTextLimit from '../../Helper/ComponentHelper/TextAreaComponentWithTextLimit';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import { SubmitButton2 } from '../../Common/Pagination/SubmitButton';

const CreatePaymentMade = () => {
    const dispatch = useDispatch();
    const addUpdate = useSelector((state) => state?.updateAddress);
    const paymentDetails = useSelector((state) => state?.paymentRecDetail);
    const itemListState = useSelector(state => state?.accountList);
    const createPayment = useSelector((state) => state?.createPayment);
    const accountList = itemListState?.data?.accounts || [];
    const paymentDetail = paymentDetails?.data?.data?.payment;
    const [cusData, setcusData] = useState(null);
    const pendingBill = useSelector((state) => state?.pendingBill);
    const vendorList = useSelector((state) => state?.vendorList);
    const masterData = useSelector(state => state?.masterData?.masterData);
    const billDetail = useSelector(state => state?.billDetail);
    const billDetail1 = billDetail?.data?.bill;

    const [fetchDetails, setFetchDetails] = useState("");
    const [showAllSequenceId, setShowAllSequenceId] = useState([]);
    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, convert, duplicate: isDuplicate } = Object.fromEntries(params.entries());
    const [invoiceDatas, setInoiceData] = useState("");

    useEffect(() => {
        if (itemId && isEdit || itemId && isDuplicate) {
            setFetchDetails(paymentDetail);
        } else if (itemId && (convert === "bill_to_payment")) {
            setFetchDetails(billDetail1);

        }
    }, [itemId, isEdit, convert, isDuplicate]);


    const [formData, setFormData] = useState({
        id: 0,
        payment_id: null,
        vendor_id: null,
        inout: 2,
        credit: null, // amount received
        bank_charges: null,
        transaction_date: formatDate(new Date()), // payment date
        // posting_date: "2024-04-18",
        fy: localStorage.getItem('FinancialYear'),
        payment_mode: "1",
        to_acc: 50, // deposit to#
        tax_deducted: 1,
        tax_acc_id: 0,
        display_name: null,
        terms_and_condition: "",
        reference: "",
        vendor_note: null,
        upload_image: null,
        amt_excess: null,
        transaction_type: 1, // for sale    2-for purchase
        transaction_id: 0,

        entries: [
            {
                bill_id: null,
                bill_no: null,
                bill_amount: null,
                amount: null,
                balance_amount: null,
                date: null,
                // order_no: null,
            }
        ]
    });

    useEffect(() => {
        if ((itemId && isEdit && fetchDetails) || (itemId && isDuplicate && fetchDetails) || itemId && billDetail1 && convert) {
            const itemsFromApi = fetchDetails?.entries?.map(item => ({
                bill_no: item?.bill_no,
                bill_id: item?.id,
                bill_amount: item?.bill_amount,
                balance_amount: item?.balance_amount,
                amount: item?.amount,
                date: formatDate(item?.bill?.transaction_date)
            }));

            setFormData({
                ...formData,
                id: isEdit ? itemId : 0,
                payment_id: fetchDetails?.payment_id,
                vendor_id: (+fetchDetails?.vendor_id),
                credit: convert ? (fetchDetails?.total) : (+fetchDetails?.credit),
                bank_charges: fetchDetails?.bank_charges,
                transaction_date: fetchDetails?.transaction_date,
                fy: fetchDetails?.fy,
                payment_mode: (+fetchDetails?.payment_mode || 0),
                to_acc: (+fetchDetails?.to_acc?.id || 0),
                tax_deducted: (+fetchDetails?.tax_deducted || 0),
                tax_acc_id: (+fetchDetails?.tax_acc_id || 0),
                reference: fetchDetails?.reference == "0" ? "" : fetchDetails?.reference,
                vendor_note: fetchDetails?.vendor_note,
                upload_image: fetchDetails?.upload_image,
                display_name:fetchDetails?.display_name,
                payment_mode: fetchDetails?.payment_mode,
                amt_excess: (+fetchDetails?.amt_excess || 0),
                // this details will be filled when there is one invoice
                transaction_type: fetchDetails?.transaction_type, // for sale    2-for purchase
                transaction_id: fetchDetails?.transaction_id,
                // when there are multiple invoices

                entries: itemsFromApi || []
            });

            if (fetchDetails?.vendor_id) {
                setIsVendorSelect(true);
            }
            if (fetchDetails?.credit || fetchDetails?.total) {
                setIsAmoutSelect(true)
            }

            if (fetchDetails?.upload_image) {
                setImgeLoader("success");
            }

            if (fetchDetails?.vendor_id) {
                const sendData = {
                    fy: localStorage.getItem('FinancialYear'),
                    warehouse_id: localStorage.getItem('selectedWarehouseId'),
                    vendor_id: fetchDetails?.vendor_id,
                }
                dispatch(pendingBillLists(sendData, setInoiceData));
            }


        }
    }, [fetchDetails, itemId, isEdit, convert, isDuplicate]);



    const [isChecked, setIsChecked] = useState({ checkbox1: true, checkbox2: true });
    // Function to handle checkbox clicks
    const handleCheckboxClick = checkboxName => {
        setIsChecked(prevState => ({
            ...prevState,
            [checkboxName]: !prevState[checkboxName],
        }));

        if (isChecked?.checkbox1) {
            setFormData({
                ...formData,
                credit: (+invoiceDatas?.total_amount),
            });
            setIsAmoutSelect(true);
        } else {
            setFormData({
                ...formData,
                credit: "",
            });
            setIsAmoutSelect(false);
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'shipping_charge' || name === 'adjustment_charge' || name === 'bank_charges') {
            newValue = parseFloat(value) || 0; // Convert to float or default to 0
        }

        // Convert empty string to zero
        if (newValue === '') {
            newValue = "";
        }

        if (name === "vendor_id" && value !== "") {
            setIsVendorSelect(true);
        } else if (name === "vendor_id" && value == "") {
            setIsVendorSelect(false);
        }
        else if (name === "credit" && value !== "") {
            setIsAmoutSelect(true);
        }


        if (name === "vendor_id") {
            const selectedCustomer = vendorList?.data?.user?.find(cus => cus.id == value);
            const sendData = {
                fy: localStorage.getItem('FinancialYear'),
                warehouse_id: localStorage.getItem('selectedWarehouseId'),
                vendor_id: selectedCustomer?.id,
            }
            dispatch(pendingBillLists(sendData, setInoiceData));
        }

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };


    useEffect(() => {
        if (!formData?.credit) {
            setFormData((prevData) => ({
                ...prevData,
                entries: prevData.entries.map(entry => ({
                    ...entry,
                    amount: null
                }))
            }));
        }
    }, [formData?.credit]);

    useEffect(() => {
        if (invoiceDatas) {
            setFormData({
                ...formData,
                entries: invoiceDatas?.bills?.map(invoice => ({
                    bill_id: invoice?.id,
                    bill_no: invoice?.bill_no,
                    bill_amount: +invoice?.total,
                    order_no: invoice?.order_no,
                    balance_amount: (+invoice?.total) - (+invoice?.amount_paid),
                    date: formatDate(invoice?.transaction_date)
                }))
            })
        }
    }, [invoiceDatas]);

    const calculateTotalAmount = () => {
        const total = formData?.entries?.reduce((total, entry) => {
            return total + (entry.amount ? parseFloat(entry.amount) : 0.00);
        }, 0.00);
        return total === 0 ? "0.00" : total.toFixed(2);
    };


    useEffect(() => {
        setFormData({
            ...formData,
            amt_excess: (+formData?.credit) - calculateTotalAmount()
        })
    }, [calculateTotalAmount()])


    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null)

    const [isVendorSelect, setIsVendorSelect] = useState(false);
    const [isAmountSelect, setIsAmoutSelect] = useState(false);

    const Navigate = useNavigate()

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const buttonName = e.nativeEvent.submitter.name;

        if (handleDropdownError(isVendorSelect, dropdownRef1)) return;
        if (handleDropdownError(isAmountSelect, dropdownRef2)) return;

        try {
            dispatch(updatePaymentRec({ ...formData }, Navigate, "payment_made", isEdit, buttonName, itemId, convert, showAllSequenceId));
        } catch (error) {
            toast.error('Error updating quotation:', error);
        }
    };


    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            customer_type: cusData?.customer_type,
            display_name: cusData?. display_name,
            customer_name: cusData ? `${cusData.first_name} ${cusData.last_name}` : '',
            email: cusData?.email,
            phone: cusData?.mobile_no,
        }));
    }, [cusData]);

    useEffect(() => {
        const queryParams = {
            id: itemId,

        };
        dispatch(accountLists());

        if (itemId && !paymentDetail) {
            dispatch(paymentRecDetail(queryParams));
        }

        if (itemId && convert && !billDetail) {
            dispatch(billDetails(queryParams));
        }

    }, [dispatch, itemId, convert]);

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            transaction_date: formatDate(date),
        });
    };

    const [imgLoader, setImgeLoader] = useState("");

    const [freezLoadingImg, setFreezLoadingImg] = useState(false);


    return (
        <>


            <TopLoadbar />
            {(freezLoadingImg || pendingBill?.loading || addUpdate?.loading || createPayment?.loading) && <MainScreenFreezeLoader />}
            <div className='formsectionsgrheigh'>
                <div id="Anotherbox" className='formsectionx2'>
                    <div id="leftareax12">
                        <h1 id="firstheading">
                            <svg height="512" viewBox="0 0 58 54" width="512" xmlns="http://www.w3.org/2000/svg" id="fi_4071616"><g id="Page-1" fill="none" fill-rule="evenodd"><g id="016---Credit-Card"><path id="Path" d="m29.73 32h-25.73c-2.209139 0-4-1.790861-4-4v-24c0-2.209139 1.790861-4 4-4h38c2.209139 0 4 1.790861 4 4v20.3z" fill="#3b97d3"></path><path id="Path" d="m46 16h-46v8h43 3z" fill="#464f5d"></path><rect id="Rectangle" fill="#f3d55b" height="6" rx="2" width="8" x="5" y="5"></rect><path id="Path" d="m40 7h-20c-.5522847 0-1-.44771525-1-1s.4477153-1 1-1h20c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1z" fill="#ecf0f1"></path><path id="Path" d="m30 11h-10c-.5522847 0-1-.4477153-1-1 0-.55228475.4477153-1 1-1h10c.5522847 0 1 .44771525 1 1 0 .5522847-.4477153 1-1 1z" fill="#ecf0f1"></path><path id="Path" d="m58 39c0 8.2842712-6.7157288 15-15 15s-15-6.7157288-15-15 6.7157288-15 15-15c1.0075985-.0022508 2.0127996.0982693 3 .3 6.9832894 1.4286242 11.9983524 7.5720763 12 14.7z" fill="#4fba6f"></path><path id="Path" d="m38 47c-.2651948-.0000566-.5195073-.1054506-.707-.293l-4-4c-.3789722-.3923789-.3735524-1.0160848.0121814-1.4018186s1.0094397-.3911536 1.4018186-.0121814l3.346 3.345 13.3-11.4c.2690133-.2485449.6523779-.3301409.9992902-.2126907.3469124.1174502.6018621.415153.66456.7760016.0626979.3608485-.0768884.7271025-.3638502.9546891l-14 12c-.1810749.1574945-.4130154.2441614-.653.244z" fill="#fff"></path></g></g></svg>
                            New Payment
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
                            <div className="itemsformwrap">
                                <div className="f1wrapofcreq">
                                    <div className="form_commonblock">
                                        <label >Vendor Name<b className='color_red'>*</b></label>
                                        <div id='sepcifixspanflex'>
                                            <span id=''>
                                                {otherIcons.name_svg}
                                                <CustomDropdown10
                                                    ref={dropdownRef1}
                                                    options={vendorList?.data?.user}
                                                    value={formData.vendor_id}
                                                    onChange={handleChange}
                                                    name="vendor_id"
                                                    defaultOption="Select Vendor"
                                                    setcusData={setcusData}
                                                    type="vendor"
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

                                    <div className={`${formData?.vendor_id ? "f1wrapofcreqx1" : "disabledfield f1wrapofcreqx1"}`}>
                                        <div className="form_commonblock">
                                            <label className=' clcsecx12s1'>Amount Paid<b className='color_red'>*</b></label>
                                            <span >
                                                {otherIcons.vendor_svg}
                                                <input
                                                    ref={dropdownRef2}
                                                    type='number'
                                                    value={(formData.credit)}
                                                    name='credit'
                                                    onChange={handleChange}
                                                    placeholder='Enter Paid Amount'
                                                    className={`${!isChecked?.checkbox1 ? "disabledfield" : ""}`}
                                                />
                                            </span>

                                            {!isAmountSelect &&
                                                <p className="error-message" style={{ whiteSpace: "nowrap" }}>
                                                    {otherIcons.error_svg}
                                                    Please Select Or Fill Amount
                                                </p>
                                            }

                                            {invoiceDatas?.total_amount ?
                                                <>
                                                    <label htmlFor="" className="xkls5663" style={{ display: "flex" }} id='xxfefe'>Receive Full Amount (₹{(+invoiceDatas?.total_amount)})

                                                        <IoCheckbox
                                                            className={`checkboxeffecgtparent ${isChecked.checkbox1 ? 'checkboxeffects' : ''}`}
                                                            onClick={() => handleCheckboxClick('checkbox1')}
                                                        />
                                                    </label>
                                                </> : ""}
                                        </div>


                                        <div className="form_commonblock">
                                            <label >Bank Charges (If Any)</label>
                                            <span >
                                                {otherIcons.tag_svg}
                                                <NumericInput
                                                    value={formData?.bank_charges}

                                                    placeholder='Enter Bank Charges'
                                                    onChange={handleChange}
                                                    name='bank_charges'
                                                />

                                            </span>
                                        </div>

                                        <div className="form_commonblock">
                                            <label >Payment Date<b className='color_red'>*</b></label>
                                            <span >
                                                {otherIcons.date_svg}
                                                <DatePicker
                                                    selected={formData?.transaction_date}
                                                    onChange={(date) =>
                                                        setFormData({
                                                          ...formData,
                                                          transaction_date: formatDate(date),
                                                        })
                                                      }
                                                    name='transaction_date'

                                                    placeholderText="Select Payment Date"
                                                    dateFormat="dd-MM-yyy"
                                                    autoComplete='off'
                                                />

                                            </span>
                                        </div>

                                        <div className="form_commonblock">
                                            <label>Payment Number<b className='color_red'>*</b></label>

                                            <GenerateAutoId
                                                formHandlers={{ setFormData, handleChange, setShowAllSequenceId }}
                                                nameVal="payment_id"
                                                value={formData?.payment_id}
                                                module="payment_made"
                                                showField={isEdit}
                                            />
                                        </div>


                                        <div className="form_commonblock">
                                            <label>Payment Mode<b className='color_red'>*</b></label>
                                            <span >
                                                {otherIcons.currency_icon}

                                                <CustomDropdown04
                                                    label="Payment Mode"
                                                    options={masterData?.filter(type => type?.type === "9")}
                                                    value={formData?.payment_mode}
                                                    onChange={handleChange}
                                                    name="payment_mode"
                                                    defaultOption="Select Payment Mode"
                                                    type="masters"
                                                />
                                            </span>
                                        </div>

                                        <div className="form_commonblock">
                                            <label >Paid Through<b className='color_red'>*</b></label>
                                            <span >
                                                {otherIcons.paid_through}
                                                <CustomDropdown15
                                                    label="Account"
                                                    options={accountList}
                                                    value={formData.to_acc}
                                                    onChange={handleChange}
                                                    name="to_acc"
                                                    defaultOption="Select An Account"
                                                />
                                            </span>
                                        </div>


                                        <div className="form_commonblock ">
                                            <label>Reference</label>
                                            <span >
                                                {otherIcons.placeofsupply_svg}
                                                <input type="text" value={formData.reference} onChange={handleChange}
                                                    name='reference'
                                                    placeholder='Enter Reference' />
                                            </span>
                                        </div>

                                    </div>
                                </div>

                                <div className={`${formData?.vendor_id ? "f1wrpofcreqsx2" : "disabledfield f1wrpofcreqsx2"}`}>
                                    <div className='itemsectionrows'>
                                        {formData?.entries?.length >= 1 ?
                                            <>
                                                <table id="tablex15s56s31s1">
                                                    <thead className="thaedaksx433">
                                                        <tr>
                                                            <div style={{ marginLeft: "10px" }}>
                                                                <th className='sfdjklsd1xs2w1' style={{ width: "9%" }}>#</th>
                                                            </div>

                                                            <th className='sfdjklsd1xs2w4' style={{ width: "16%", paddingLeft: "40px" }}>Date
                                                            </th>

                                                            <div style={{ marginLeft: "80px", width: "100%" }}>
                                                                <th className='sfdjklsd1xs2w4' style={{ width: "100%" }}>Bill</th>
                                                            </div>

                                                            <th className='sfdjklsd1xs2w4' style={{ width: "20%", textAlign: "right", paddingLeft: "100px" }}>Bill Amount
                                                            </th>

                                                            <div style={{ marginLeft: "150px", width: "50%" }}>
                                                                <th className='sfdjklsd1xs2w4 ' style={{ width: "100%", textAlign: "right" }}>Amount Due</th>
                                                            </div>

                                                            <th className='sfdjklsd1xs2w4' style={{ textAlign: "right", padding: "15px 40px" }}>Payment</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formData?.entries?.map((val, index) => (
                                                            <tr key={index} className="rowsxs15aksx433">

                                                                <div style={{ marginLeft: "10px" }}><td className="sfdjklsd1xs2w1">{index + 1}</td></div>

                                                                <td className="sfdjklsd1xs2w2" style={{ paddingLeft: "40px" }} >{val?.date}</td>

                                                                <div style={{ marginLeft: "80px" }}>   <td className="sfdjklsd1xs2w2" >{val?.bill_no}</td></div>

                                                                <td className="sfdjklsd1xs2w4" style={{ textAlign: "right" }}>{showAmountWithCurrencySymbol(val?.bill_amount)}</td>

                                                                <td className="sfdjklsd1xs2w3" style={{ textAlign: "right", width: "23%" }}>{showAmountWithCurrencySymbol(val?.balance_amount)}</td>

                                                                <td className="sfdjklsd1xs2w3">

                                                                    <div className="tablsxs1a4" style={{ textAlign: "right", marginRight: "0px" }}>
                                                                        <div className="tablsxs1a2">
                                                                            <input
                                                                                style={{ width: "40%", textAlign: "center" }}
                                                                                type="number"
                                                                                value={val.amount !== null ? val.amount : ""}
                                                                                placeholder="0.00"
                                                                                onChange={(e) => {
                                                                                    const inputValue = e.target.value;
                                                                                    const newValue = inputValue === "" ? null : parseFloat(inputValue);

                                                                                    if (newValue <= (+formData?.credit) || newValue <= (+paymentDetail?.credit)) {
                                                                                        setFormData((prevFormData) => ({
                                                                                            ...prevFormData,
                                                                                            entries: prevFormData?.entries?.map((entry, i) =>
                                                                                                i === index ? { ...entry, amount: newValue } : entry
                                                                                            )
                                                                                        }));
                                                                                    } else if (formData.credit === "") {
                                                                                        toast('Please set the amount', {
                                                                                            icon: '👏',
                                                                                            style: {
                                                                                                borderRadius: '10px',
                                                                                                background: '#333',
                                                                                                color: '#fff',
                                                                                                fontSize: '14px',
                                                                                            },
                                                                                        });
                                                                                        setFormData((prevFormData) => ({
                                                                                            ...prevFormData,
                                                                                            entries: prevFormData?.entries?.map((entry, i) =>
                                                                                                i === index ? { ...entry, amount: 0 } : entry
                                                                                            )
                                                                                        }));
                                                                                    }

                                                                                    else {
                                                                                        {
                                                                                            toast('The amount entered here is more than the amount paid by the customer', {
                                                                                                icon: '👏',
                                                                                                style: {
                                                                                                    borderRadius: '10px',
                                                                                                    background: '#333',
                                                                                                    color: '#fff',
                                                                                                    fontSize: '14px',
                                                                                                },
                                                                                            });


                                                                                        }
                                                                                        return;
                                                                                    }
                                                                                }}
                                                                            />

                                                                        </div>
                                                                    </div>


                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </>
                                            :
                                            <p style={{ textAlign: "center", padding: "20px 0" }}>There are no unpaid invoices associated with this customer.</p>
                                        }



                                    </div>


                                    <div className="height5"></div>
                                    <div className='secondtotalsections485s'>
                                        <div className='textareaofcreatqsiform'>
                                            <label>Vendor Note</label>
                                            <div className='show_no_of_text_limit_0121'>
                                                <TextAreaComponentWithTextLimit
                                                    formsValues={{ handleChange, formData }}
                                                    placeholder='Will be displayed on the estimate'
                                                    name="vendor_note"
                                                    value={formData?.vendor_note}
                                                />
                                            </div>

                                        </div>

                                        <div className="calctotalsection">
                                            <div className="calcuparentc">
                                                <div className='clcsecx12s1'>
                                                    <label>Amount Paid: ({currencySymbol})</label>
                                                    <input
                                                        type="text"
                                                        value={formData.credit}
                                                        readOnly
                                                        placeholder='0.00'
                                                        className='inputsfocalci465s'
                                                        style={{ color: formData?.credit < 0 ? 'rgb(255, 46, 18)' : 'black', }}
                                                    />
                                                </div>
                                                <div className='clcsecx12s1'>
                                                    <label>Amount used for payment: ({currencySymbol})</label>
                                                    <input
                                                        className='inputsfocalci465s'
                                                        readOnly
                                                        type="text"
                                                        value={calculateTotalAmount()}
                                                        placeholder='0.00'
                                                        style={{}}
                                                    />
                                                </div>
                                                <div className='clcsecx12s1'>
                                                    <label>Amount In Access: ({currencySymbol})</label>
                                                    <input
                                                        className='inputsfocalci465s'
                                                        readOnly
                                                        type="text"
                                                        value={formData?.amt_excess?.toFixed(2)}
                                                        placeholder='0.00'
                                                        style={{ color: formData?.amt_excess < 0 ? 'rgb(255, 46, 18)' : 'black', }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="breakerci"></div>
                                    <div className="height5"></div>


                                    <div className='secondtotalsections485s'>


                                        <div className='textareaofcreatqsiform'>
                                            <label>Terms</label>
                                            <div className='show_no_of_text_limit_0121'>

                                                <TextAreaComponentWithTextLimit
                                                    formsValues={{ handleChange, formData }}
                                                    placeholder='Enter the terms and conditions of your business to be displayed in your transaction '
                                                    name="terms_and_condition"
                                                    value={formData.terms_and_condition == 0 ? "" : formData.terms_and_condition}
                                                />

                                            </div>
                                        </div>

                                        <div id="imgurlanddesc" className='calctotalsectionx2'>
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
                            </div>

                            <SubmitButton2 isEdit={isEdit} itemId={itemId} cancel="payment-made" />

                        </div>
                    </DisableEnterSubmitForm>
                </div>
            </div >
            <Toaster
                position="bottom-right"
                reverseOrder={false} />

        </>
    );
};


export default CreatePaymentMade;
