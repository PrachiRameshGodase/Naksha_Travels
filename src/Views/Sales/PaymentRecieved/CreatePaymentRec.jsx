import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DisableEnterSubmitForm from '../../Helper/DisableKeys/DisableEnterSubmitForm';
import { useDispatch, useSelector } from 'react-redux';
import { customersList } from '../../../Redux/Actions/customerActions';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import { accountLists, itemLists } from '../../../Redux/Actions/listApisActions';
import Loader02 from '../../../Components/Loaders/Loader02'
import DatePicker from "react-datepicker";
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import { OverflowHideBOdy } from '../../../Utils/OverflowHideBOdy';
import { Toaster, toast } from "react-hot-toast";
import { paymentRecDetail, updatePaymentRec } from '../../../Redux/Actions/PaymentRecAction';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import { IoCheckbox } from 'react-icons/io5';
import { formatDate, todayDate } from '../../Helper/DateFormat';
import CustomDropdown15 from '../../../Components/CustomDropdown/CustomDropdown15';
import { getAccountTypes } from '../../../Redux/Actions/accountsActions';
import { invoiceDetailes, pendingInvoices } from '../../../Redux/Actions/invoiceActions';
import NumericInput from '../../Helper/NumericInput';
import SubmitButton, { SubmitButton2 } from '../../Common/Pagination/SubmitButton';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import { currencySymbol, handleDropdownError, ShowMasterData } from '../../Helper/HelperFunctions';
import { PaymentRecTable } from '../../Common/InsideSubModulesCommon/ItemDetailTable';
// import GenerateAutoId from '../Quotations/GenerateAutoId';
import GenerateAutoId from '../Common/GenerateAutoId';
import TextAreaComponentWithTextLimit from '../../Helper/ComponentHelper/TextAreaComponentWithTextLimit';

const CreatePaymentRec = () => {
    const dispatch = useDispatch();
    const cusList = useSelector((state) => state?.customerList);
    const addUpdate = useSelector((state) => state?.updateAddress);
    const paymentDetails = useSelector((state) => state?.paymentRecDetail);
    const allAccounts = useSelector((state) => state?.accountList);
    const accountList = allAccounts?.data?.accounts || [];

    const createPayment = useSelector((state) => state?.createPayment);
    const paymentRecStatus = useSelector((state) => state?.paymentRecStatus);

    const invoiceDetail = useSelector(state => state?.invoiceDetail);
    const invoice = invoiceDetail?.data?.data?.Invoice;

    const allPaymentMode = ShowMasterData("9")

    const [showAllSequenceId, setShowAllSequenceId] = useState([]);

    const paymentDetail = paymentDetails?.data?.data?.payment;
    const [cusData, setcusData] = useState(null);
    const pendingInvoice = useSelector((state) => state?.invoicePending);
    const [fetchDetails, setFetchDetails] = useState(null);
    const [invoiceDatas, setInoiceData] = useState("")

    console.log("invoiceDatas", invoiceDatas)

    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, duplicate: isDuplicate, convert } = Object.fromEntries(params.entries());

    useEffect(() => {
        if (itemId && isEdit) {
            setFetchDetails(paymentDetail);
        } else if (itemId && convert) {
            setFetchDetails(invoice);
        }
    }, [itemId, isEdit, paymentDetail, invoice, convert]);


    const [formData, setFormData] = useState({
        id: 0,
        payment_id: null,
        customer_id: null,
        debit: null,
        bank_charges: null,
        transaction_date: formatDate(new Date()),
        fy: localStorage.getItem('FinancialYear'),
        payment_mode: "1",
        to_acc: 50,
        inout: 1,
        tax_deducted: null,
        tax_acc_id: 0,
        reference: "",
        terms_and_condition: "",
        customer_note: null,
        upload_image: null,
        amt_excess: null,
        transaction_type: 1, // for sale    2-for purchase
        transaction_id: 0,

        entries: [
            {
                invoice_id: null,
                invoice_no: null,
                invoice_amount: null,
                amount: null,
                balance_amount: null,
                date: null
            }
        ]
    });


    useEffect(() => {
        if (itemId && isEdit && fetchDetails || itemId && isDuplicate && fetchDetails || itemId && convert && invoice) {

            const itemsFromApi = fetchDetails?.entries?.map(item => ({
                invoice_id: item?.id,
                invoice_no: item?.invoice_no,
                invoice_amount: item?.invoice_amount,
                balance_amount: item?.balance_amount,
                amount: item?.amount,
                date: formatDate(item?.invoice?.transaction_date),
            }));

            setFormData({
                ...formData,
                id: isEdit ? itemId : 0,
                payment_id: fetchDetails?.payment_id,
                customer_id: (+fetchDetails?.customer_id),
                debit: convert ? (+fetchDetails?.total) : (+fetchDetails?.debit), // amount received
                bank_charges: fetchDetails?.bank_charges,
                transaction_date: formatDate(fetchDetails?.transaction_date), // payment date
                fy: fetchDetails?.fy,
                payment_mode: (+fetchDetails?.payment_mode || 0),
                to_acc: (+fetchDetails?.to_acc?.id || 0), // deposit to
                tax_deducted: (+fetchDetails?.tax_deducted || 0),
                tax_acc_id: (+fetchDetails?.tax_acc_id || 0),
                reference: fetchDetails?.reference == "0" ? "" : fetchDetails?.reference,
                customer_note: fetchDetails?.customer_note,
                terms_and_condition: fetchDetails?.terms_and_condition,
                upload_image: fetchDetails?.upload_image,
                amt_excess: (+fetchDetails?.amt_excess || 0),

                // this details will be filled when there is one invoice
                transaction_type: fetchDetails?.transaction_type, // for sale    2-for purchase
                transaction_id: fetchDetails?.transaction_id,

                // when there are multiple invoices

                entries: itemsFromApi || []
            });

            if (fetchDetails?.customer_id) {
                setIsCustomerSelect(true);
            }
            if (fetchDetails?.debit || fetchDetails?.total) {
                setIsAmoutSelect(true)
            }
            if (fetchDetails?.upload_image) {
                setImgeLoader("success");
            }

            if (fetchDetails?.customer_id) {
                const sendData = {
                    fy: localStorage.getItem('FinancialYear'),
                    warehouse_id: localStorage.getItem('selectedWarehouseId'),
                    customer_id: fetchDetails?.customer_id,
                }
                dispatch(pendingInvoices(sendData, setInoiceData));
            }
        }
    }, [fetchDetails, itemId, isEdit, isDuplicate, convert]);


    useEffect(() => {
        if (itemId && convert && !invoice) {
            const queryParams = {
                id: itemId,
            };
            dispatch(invoiceDetailes(queryParams));
        }
    }, [dispatch, itemId, convert]);


    const [isChecked, setIsChecked] = useState({ checkbox1: true, checkbox2: true });

    const handleCheckboxClick = checkboxName => {
        setIsChecked(prevState => ({
            ...prevState,
            [checkboxName]: !prevState[checkboxName],
        }));

        if (isChecked?.checkbox1) {
            setFormData({
                ...formData,
                debit: (+invoiceDatas?.total_amount),
            });
            setIsAmoutSelect(true);
        } else {
            setFormData({
                ...formData,
                debit: "",
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

        if (name === "customer_id" && value !== "") {
            setIsCustomerSelect(true);
        } else if (name === "customer_id" && value == "") {
            setIsCustomerSelect(false);
        }
        else if (name === "debit" && value !== "") {
            setIsAmoutSelect(true);
        }

        if (name === "customer_id") {
            const selectedCustomer = cusList?.data?.user?.find(cus => cus.id == value);
            const sendData = {
                fy: localStorage.getItem('FinancialYear'),
                warehouse_id: localStorage.getItem('selectedWarehouseId'),
                customer_id: selectedCustomer?.id,
            }
            dispatch(pendingInvoices(sendData, setInoiceData))
        }


        setFormData({
            ...formData,
            [name]: newValue,
        });
    };


    useEffect(() => {
        if (!formData?.debit) {
            setFormData((prevData) => ({
                ...prevData,
                entries: prevData.entries.map(entry => ({
                    ...entry,
                    amount: null
                }))
            }));
        }
    }, [formData?.debit]);

    useEffect(() => {
        if (invoiceDatas) {
            setFormData({
                ...formData,
                entries: invoiceDatas?.invoices?.map(invoice => ({
                    invoice_no: invoice?.invoice_id,
                    invoice_id: invoice?.id,
                    invoice_amount: +invoice?.total,
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
            amt_excess: (+formData?.debit) - calculateTotalAmount()
        })
    }, [calculateTotalAmount()])


    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null)

    const [isCustomerSelect, setIsCustomerSelect] = useState(false);
    const [isAmountSelect, setIsAmoutSelect] = useState(false);

    const Navigate = useNavigate()

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const buttonName = e.nativeEvent.submitter.name;

        if (handleDropdownError(isCustomerSelect, dropdownRef1)) return;
        if (handleDropdownError(isAmountSelect, dropdownRef2)) return;

        try {
            dispatch(updatePaymentRec({ ...formData }, Navigate, "payment_rec", isEdit, buttonName, itemId, convert, showAllSequenceId));
        } catch (error) {
            toast.error('Error updating quotation:', error);
        }

    };


    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            customer_type: cusData?.customer_type,
            customer_name: cusData ? `${cusData.first_name} ${cusData.last_name}` : '',
            email: cusData?.email,
            phone: cusData?.mobile_no,
        }));
    }, [cusData]);

    useEffect(() => {
        if (itemId && !paymentDetail) {
            dispatch(paymentRecDetail({ id: itemId }));
        }
        dispatch(accountLists());
    }, [dispatch]);

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            transaction_date: formatDate(date),
        });
    };


    // image upload from firebase
    const [imgLoader, setImgeLoader] = useState("");

    const [freezLoadingImg, setFreezLoadingImg] = useState(false);

    return (
        <>

            <TopLoadbar />
            {(freezLoadingImg || pendingInvoice?.loading || addUpdate?.loading || paymentRecStatus?.loading || createPayment?.loading) && <MainScreenFreezeLoader />}
            <div className='formsectionsgrheigh'>
                <div id="Anotherbox" className='formsectionx2'>
                    <div id="leftareax12">
                        <h1 id="firstheading">
                            {otherIcons?.payment_rec_svg}
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
                                                />
                                            </span>

                                            {
                                                !isCustomerSelect &&
                                                <p className="error-message" style={{ whiteSpace: "nowrap" }}>
                                                    {otherIcons.error_svg}
                                                    Please Select Customer
                                                </p>
                                            }
                                        </div>
                                    </div>


                                    <div className={`${formData?.customer_id ? "f1wrapofcreqx1" : "disabledfield f1wrapofcreqx1"}`} >

                                        <div className="form_commonblock">
                                            <label className='clcsecx12s1'>Amount Received<b className='color_red'>*</b></label>
                                            <span >
                                                {otherIcons.vendor_svg}
                                                <input
                                                    autoComplete='off'
                                                    ref={dropdownRef2}
                                                    type="number"
                                                    value={formData.debit}
                                                    name='debit'
                                                    onChange={handleChange}
                                                    placeholder='Enter Received Amount'
                                                    className={`${!isChecked?.checkbox1 ? "disabledfield" : ""}`}

                                                />
                                            </span>
                                            {
                                                !isAmountSelect &&
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
                                            <label className=''>Bank Charges (If Any)</label>
                                            <span >
                                                {otherIcons.tag_svg}

                                                <NumericInput
                                                    value={formData.bank_charges}
                                                    placeholder='Enter Bank Charges'
                                                    onChange={handleChange}
                                                    name='bank_charges'
                                                />

                                            </span>
                                        </div>

                                        <div className="form_commonblock">
                                            <label className=''>Payment Date</label>
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
                                                    placeholderText="Select Payment Date"
                                                    dateFormat="dd-MM-yyy"
                                                />

                                            </span>
                                        </div>

                                        <div className="form_commonblock">
                                            <label className=''>Payment No</label>

                                            <GenerateAutoId
                                                formHandlers={{ setFormData, handleChange, setShowAllSequenceId }}
                                                nameVal="payment_id"
                                                value={formData?.payment_id}
                                                module="payment_receipt"
                                                showField={isEdit}
                                            />
                                        </div>

                                        <div className="form_commonblock">
                                            <label>Payment Mode<b className='color_red'>*</b></label>
                                            <span >
                                                {otherIcons.currency_icon}
                                                <CustomDropdown04
                                                    options={allPaymentMode}
                                                    value={formData.payment_mode}
                                                    onChange={handleChange}
                                                    name="payment_mode"
                                                    defaultOption="Select Payment Mode"
                                                    type="masters"
                                                />


                                            </span>

                                        </div>

                                        <div className="form_commonblock">
                                            <label className=''>Deposit To<b className='color_red'>*</b></label>
                                            <span >
                                                {otherIcons.tag_svg}
                                                <CustomDropdown15
                                                    label="Purchase Account"
                                                    options={accountList}
                                                    value={formData.to_acc}
                                                    onChange={handleChange}
                                                    name="to_acc"
                                                    defaultOption="Select Account"
                                                    autoComplete='off'
                                                />
                                            </span>

                                        </div>


                                        <div className="form_commonblock ">
                                            <label className=''>Reference Number</label>
                                            <span >
                                                {otherIcons.placeofsupply_svg}
                                                <input type="text" value={formData.reference == 0 ? "" : formData?.reference} onChange={handleChange}
                                                    // disabled
                                                    name='reference'
                                                    placeholder='Enter Reference Number' autoComplete='off' />

                                            </span>
                                        </div>

                                    </div>
                                </div>
                                {/* </div> */}



                                <div className={`${formData?.customer_id ? "f1wrpofcreqsx2" : "disabledfield f1wrpofcreqsx2"}`}>
                                    <div className='itemsectionrows'>

                                        {formData?.entries?.length >= 1 ?
                                            <>
                                                <PaymentRecTable formData={formData} setFormData={setFormData} fetchDetails={fetchDetails} />
                                            </>
                                            :
                                            <p style={{ textAlign: "center", padding: "20px 0" }}>There are no unpaid invoices associated with this customer.</p>
                                        }
                                    </div>


                                    {/* <button id='additembtn45srow' type="button" onClick={handleItemAdd}>Add New Row<GoPlus /></button> */}


                                    <div className="height5"></div>
                                    <div className='secondtotalsections485s'>
                                        <div className='textareaofcreatqsiform'>
                                            <label>Customer Note</label>
                                            <div className='show_no_of_text_limit_0121'>
                                                <TextAreaComponentWithTextLimit
                                                    formsValues={{ handleChange, formData }}
                                                    placeholder='Will be displayed on the estimate'
                                                    name="customer_note"
                                                    value={formData?.customer_note}
                                                />
                                            </div>

                                        </div>

                                        <div className="calctotalsection">
                                            <div className="calcuparentc">
                                                <div className='clcsecx12s1'>
                                                    <label>Amount received: ({currencySymbol})</label>
                                                    <input
                                                        type="text"
                                                        value={formData.debit}
                                                        readOnly
                                                        placeholder='0.00'
                                                        className='inputsfocalci465s'
                                                        style={{ color: formData?.debit < 0 ? 'rgb(255, 46, 18)' : 'black', }}
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


                                    <div className='secondtotalsections485s' style={{}}>
                                        <div className='textareaofcreatqsiform'>
                                            <label>Terms</label>
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

                            <SubmitButton2 isEdit={isEdit} itemId={itemId} cancel="payment-recieved" />

                        </div>
                    </form>
                </div>
            </div >
            <Toaster
                position="bottom-right"
                reverseOrder={false} />

        </>
    );
};


export default CreatePaymentRec
