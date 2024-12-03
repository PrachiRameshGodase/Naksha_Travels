import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DisableEnterSubmitForm from '../../Helper/DisableKeys/DisableEnterSubmitForm';
import { useDispatch, useSelector } from 'react-redux';
import { accountLists } from '../../../Redux/Actions/listApisActions';
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import CustomDropdown15 from '../../../Components/CustomDropdown/CustomDropdown15';
import { createAccounts, getAccountTypes } from '../../../Redux/Actions/accountsActions';
import { toast, Toaster } from 'react-hot-toast';
import CustomDropdown12 from '../../../Components/CustomDropdown/CustomDropdown12';
import CustomDropdown16 from '../../../Components/CustomDropdown/CustomDropdown16';
import CustomDropdown20 from '../../../Components/CustomDropdown/CustomDropdown20';
import { getCurrencyFormData, handleDropdownError } from '../../Helper/HelperFunctions';
import { accountTableIcons } from '../../Helper/SVGIcons/ItemsIcons/ItemsTableIcons';
import NumericInput from '../../Helper/NumericInput';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import TextAreaComponentWithTextLimit from '../../Helper/ComponentHelper/TextAreaComponentWithTextLimit';
import { SubmitButton2 } from '../../Common/Pagination/SubmitButton';
import { Nav } from 'react-bootstrap';


const CreateAccountChart = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const accType = useSelector((state) => state?.getAccType?.data?.account_type);
    const createAcc = useSelector((state) => state?.createAccount);
    const getCurrency = useSelector((state) => state?.getCurrency?.data);
    const AccountListCHart = useSelector(state => state?.accountList);
    const AccountsListcths = AccountListCHart?.data?.accounts || [];


    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit } = Object.fromEntries(params.entries());

    const [freezLoadingImg, setFreezLoadingImg] = useState(false);
    const [imgLoader, setImgeLoader] = useState(false);

    const [formData, setFormData] = useState({
        id: 0,
        account_type: "Bank",
        account_name: "",
        account_code: null,
        opening_balance: null,
        owner_name: null,
        upload_image: [],
        custome_feilds: null,
        tax_code: null,
        description: "",
        parent_id: null,
        account_no: null,
        parent_name: null,
        sub_account: 0,
        ifsc: "",
        currency: getCurrencyFormData,
    });

    const data = JSON.parse(localStorage.getItem("editAccount"));
    const getAccountVal = data?.accounts;

    useEffect(() => {
        if (isEdit) {
            setFormData({
                ...formData,
                id: getAccountVal?.id,
                account_type: getAccountVal?.account_type,
                account_name: getAccountVal?.account_name,
                account_code: getAccountVal?.account_code,
                opening_balance: getAccountVal?.opening_balance,
                owner_name: getAccountVal?.owner_name,
                upload_image: getAccountVal?.upload_image,
                custome_feilds: getAccountVal?.custome_feilds,
                tax_code: getAccountVal?.tax_code,
                description: getAccountVal?.description,
                parent_id: (+getAccountVal?.parent_id),
                account_no: getAccountVal?.account_no,
                parent_name: getAccountVal?.parent_name,
                sub_account: getAccountVal?.sub_account,
                ifsc: getAccountVal?.ifsc,
                currency: getAccountVal?.currency,
            });

            if (getAccountVal.account_no) {
                setAccNoErr(true);
            }
            if (getAccountVal.upload_image) {
                setImgeLoader("success");
            }

            if (getAccountVal?.account_name) {
                setAccNameErr(true);
            }
        }
    }, [isEdit]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        let newValue = value;


        if (name === "account_name" && value?.trim() !== "") {
            setAccNameErr(true);
        } else if (name === "account_name" && value?.trim() !== "") {
            setAccNameErr(true);
        }
        if (name === "account_no" && value?.trim() !== "") {
            setAccNoErr(true);
        } else if (name === "account_no" && value?.trim() !== "") {
            setAccNoErr(true);
        }

        setFormData({
            ...formData,
            [name]: newValue,
            ...(name === "sub_account" && { sub_account: checked ? 1 : 0 })
        });
    };

    const Navigate = useNavigate();
    const [accNameErr, setAccNameErr] = useState(false);
    const [accNoErr, setAccNoErr] = useState(false);

    const accNameRef = useRef(null);
    const accNoRef = useRef(null);

    const [parentAccErr, setParentAccErr] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (handleDropdownError(accNameErr, accNameRef)) return;

        if (formData?.account_type === "Bank") {
            if (handleDropdownError(accNoErr, accNoRef)) return;
        }

        // console.log("first", isEdit)

        try {
            dispatch(createAccounts(formData, isEdit, itemId, Navigate))
            // if (formData?.parent_id === 0 && formData?.sub_account === 1) {
            //     setParentAccErr(true);
            //     dispatch(createAccounts(formData, Navigate))

            // } else if (isEdit) {
            //     dispatch(createAccounts(formData, Navigate))
            //         .then(() => {
            //             localStorage.setItem("editAccount", JSON.stringify({ ...formData, id: getAccountVal?.id }));
            //             setParentAccErr(false);
            //         })
            // }
        }
        catch (error) {
            toast.error('Error updating quotation:', error);
        }

    };


    useEffect(() => {
        dispatch(getAccountTypes());
    }, [dispatch]);

    useEffect(() => {
        let sendData = {
            fy: localStorage.getItem("FinancialYear"),
        };
        dispatch(accountLists(sendData));
    }, [dispatch]);

    return (
        <>
            <TopLoadbar />
            {(freezLoadingImg || createAcc?.loading) && <MainScreenFreezeLoader />}

            <div className='formsectionsgrheigh'>
                <div id="Anotherbox" className='formsectionx2'>
                    <div id="leftareax12">
                        <h1 id="firstheading">
                            <svg id="fi_16973083" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="10" fill="#ced3ed" r="6"></circle><path d="m21 18h-10c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="#4257ff"></path></svg>
                            {isEdit ? "Update Account" : " New Account"}

                        </h1>
                    </div>
                    <div id="buttonsdata">
                        <Link to={"/dashboard/account-chart"} className="linkx3">
                            <RxCross2 />
                        </Link>
                    </div>
                </div>

                <div id="formofcreateitems" >
                    <form onSubmit={handleFormSubmit}>
                        <div className="relateivdiv">
                            <div className="itemsformwrap">
                                <div className="f1wrapofcreq">
                                    <div className="f1wrapofcreqx1">
                                        <div className="form_commonblock">
                                            <label>Account Type<b className='color_red'>*</b></label>
                                            <span >
                                                {accountTableIcons[2].svg}
                                                <CustomDropdown20
                                                    label="Account Type"
                                                    options={accType}
                                                    value={formData?.account_type}
                                                    onChange={handleChange}
                                                    name="account_type"
                                                    type="account"
                                                    defaultOption="Select Account Type"
                                                />
                                            </span>


                                        </div>

                                        <div className={`${formData?.account_type !== 7 && "subaccountcheckbox85s"}`}>
                                            {formData?.account_type === "credit_card" ? ""

                                                :
                                                <div div className="form_commonblock">
                                                    <label >Account Name<b className='color_red'>*</b></label>

                                                    <span >
                                                        {accountTableIcons[0].svg}
                                                        <input type="text"
                                                            ref={accNameRef}
                                                            value={formData.account_name}
                                                            placeholder='Enter Account Name'
                                                            onChange={handleChange}
                                                            name='account_name'
                                                            autoComplete='off'
                                                        />
                                                    </span>
                                                    {!accNameErr && (
                                                        <p className="error-message">
                                                            {otherIcons.error_svg}
                                                            Please Enter The Account Name
                                                        </p>
                                                    )}
                                                </div>
                                            }

                                            {formData?.account_type === "Other Current Assets" || formData?.account_type === "Bank" || formData?.account_type === "credit_card" || formData?.account_type === "other_current_liability" || formData?.account_type === "other_income" || formData?.account_type === "other_current_liability" ? "" :
                                                <div className='subaccountcheckbox84s'>
                                                    <label>
                                                        <span>
                                                            <input type="checkbox" checked={formData?.sub_account == 1} name="sub_account" value={formData?.sub_account} id="" onChange={handleChange} />
                                                        </span>
                                                        Make this sub account
                                                    </label>
                                                </div>
                                            }
                                        </div>
                                        {formData?.sub_account == 1 &&
                                            <div className="form_commonblock">
                                                <label >Parent Account<b className='color_red'>*</b></label>
                                                <span >
                                                    {otherIcons.tag_svg}

                                                    <CustomDropdown15
                                                        label="Purchase Account"
                                                        options={AccountsListcths}
                                                        value={formData.parent_id}
                                                        onChange={handleChange}
                                                        name="parent_id"
                                                        defaultOption='Select An Account'
                                                    />
                                                </span>
                                                {parentAccErr && <p className="error-message">
                                                    {otherIcons.error_svg}
                                                    Please select Parent Account</p>}
                                            </div>
                                        }

                                        {formData?.account_type === "credit_card" ?
                                            <>
                                                <div className="form_commonblock">
                                                    <label>Credit Card Name</label>
                                                    <span >
                                                        {otherIcons.tag_svg}
                                                        <input type="text" value={formData.credit_card_name}
                                                            placeholder='Credit Card Name'
                                                            onChange={handleChange}
                                                            name='credit_card_name'
                                                        />

                                                    </span>
                                                </div>

                                                {/* <div className="form_commonblock">
                                                    <label>Currency</label>
                                                    <span >
                                                        {otherIcons.currency_icon}

                                                        <CustomDropdown12
                                                            label="Item Name"
                                                            options={getCurrency?.currency}
                                                            value={formData?.currency}
                                                            onChange={handleChange}
                                                            name="currency"
                                                            defaultOption="Select Currency"
                                                        />
                                                    </span>
                                                </div> */}

                                            </> : ""
                                        }

                                        {formData?.account_type === "Bank" &&
                                            <>
                                                <div className="form_commonblock">
                                                    <label >Account Number<b className='color_red'>*</b></label>
                                                    <span >
                                                        {otherIcons.tag_svg}
                                                        <input
                                                            ref={accNoRef}
                                                            type='number'
                                                            value={formData.account_no}
                                                            placeholder='Enter Account Number'
                                                            onChange={handleChange}
                                                            name='account_no'
                                                        />
                                                    </span>
                                                    {!accNoErr && <p className="error-message">
                                                        {otherIcons.error_svg}
                                                        Please Enter Account Number</p>}
                                                </div>

                                                <div className="form_commonblock">
                                                    <label >IFSC<b className='color_red'>*</b></label>
                                                    <span >
                                                        {otherIcons.tag_svg}
                                                        <input type="text" value={formData.ifsc}
                                                            placeholder='Enter IFSC Code'
                                                            onChange={handleChange}
                                                            name='ifsc'
                                                        />

                                                    </span>
                                                </div>

                                                <div className="form_commonblock">
                                                    <label>Currency</label>
                                                    <span >
                                                        {otherIcons.currency_icon}

                                                        <CustomDropdown12
                                                            label="Item Name"
                                                            options={getCurrency?.currency}
                                                            value={formData?.currency}
                                                            onChange={handleChange}
                                                            name="currency"
                                                            type="currency"
                                                            defaultOption="Select Currency"
                                                        />
                                                    </span>
                                                </div>


                                            </>
                                        }


                                        <div className="form_commonblock">
                                            <label >Account Code</label>
                                            <span >
                                                {accountTableIcons[1].svg}
                                                <input type="text" value={formData.account_code}
                                                    placeholder='Enter Account Code'
                                                    onChange={handleChange}
                                                    name='account_code'
                                                />

                                            </span>
                                        </div>


                                        <div className="form_commonblock">
                                            <label>Opening blance</label>
                                            <span>
                                                {otherIcons.amount_svg}
                                                <NumericInput value={formData.opening_balance}
                                                    placeholder='Enter Blance Amount'
                                                    onChange={handleChange}
                                                    name='opening_balance'
                                                />
                                            </span>
                                        </div>
                                        <div className="form_commonblock">
                                            <label >Owner</label>
                                            <span >
                                                {otherIcons.customer_svg}
                                                <input type="text" value={formData.owner_name}
                                                    placeholder='Enter Owner Name'
                                                    onChange={handleChange}
                                                    name='owner_name'
                                                />

                                            </span>
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


                                        <div className="form_commonblock">
                                            <label >Tax Code</label>
                                            <span >
                                                {otherIcons.placeofsupply_svg}
                                                <input
                                                    type="text"
                                                    value={formData.tax_code}
                                                    onChange={handleChange}
                                                    name='tax_code'

                                                    placeholder='Enter tax code'
                                                />
                                            </span>
                                        </div>


                                        <div>

                                        </div>
                                    </div>
                                    <div className='secondtotalsections485s'>
                                        <div className='textareaofcreatqsiform'>
                                            <label >Notes</label>

                                            <div className='show_no_of_text_limit_0121'>
                                                <TextAreaComponentWithTextLimit
                                                    formsValues={{ handleChange, formData }}
                                                    placeholder="Enter Notes... "
                                                    name="description"
                                                    value={formData?.description}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="actionbarcommon">
                                <SubmitButton2 isEdit={isEdit} itemId={itemId} cancel="account-chart" />

                            </div>

                        </div>
                    </form>
                </div >
                <Toaster />
            </div >
        </>
    );
};

export default CreateAccountChart;
