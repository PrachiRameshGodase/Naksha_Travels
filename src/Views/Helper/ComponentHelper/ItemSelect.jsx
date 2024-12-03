import React, { useEffect, useRef, useState } from 'react'
import CustomDropdown03 from '../../../Components/CustomDropdown/CustomDropdown03';
import { accountLists, itemLists } from '../../../Redux/Actions/listApisActions';
import { useDispatch, useSelector } from 'react-redux';
import NumericInput from '../NumericInput';
import toast from 'react-hot-toast';
import useOutsideClick from '../PopupData';
import { SlReload } from 'react-icons/sl';
import { handleKeyPress } from '../KeyPressInstance';
import { GoPlus } from 'react-icons/go';
import { RxCross2 } from 'react-icons/rx';
import { otherIcons } from '../SVGIcons/ItemsIcons/Icons';
import { ImageUploadGRN } from './ImageUpload';
import CustomDropdown15 from '../../../Components/CustomDropdown/CustomDropdown15';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import CustomDropdown13 from '../../../Components/CustomDropdown/CustomDropdown13';
import { fetchMasterData, fetchTexRates } from '../../../Redux/Actions/globalActions';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import { currencySymbol } from '../HelperFunctions';
import ShowMastersValue from '../ShowMastersValue';
import TextAreaComponentWithTextLimit from './TextAreaComponentWithTextLimit';

const ItemSelect = ({ formData, setFormData, handleChange, setIsItemSelect, isItemSelect, extracssclassforscjkls, dropdownRef2, note }) => {
    const itemList = useSelector((state) => state?.itemList);
    const [showPopup1, setShowPopup1] = useState(false);
    const [itemData, setItemData] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

    const handleDropdownToggle = (index) => {
        setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    useOutsideClick(dropdownRef, () => setOpenDropdownIndex(null));

    const handleShippingChargeChange = (e) => {
        const shippingCharge = e.target.value;
        const total = parseFloat(formData?.subtotal || 0) + parseFloat(shippingCharge || 0) + parseFloat(formData.adjustment_charge || 0);
        setFormData({ ...formData, shipping_charge: shippingCharge, total: total.toFixed(2) });
    };

    const handleAdjustmentChargeChange = (e) => {
        const adjustmentCharge = e.target.value;
        const total = parseFloat(formData.subtotal || 0) + parseFloat(formData.shipping_charge || 0) + parseFloat(adjustmentCharge || 0);
        setFormData({ ...formData, adjustment_charge: adjustmentCharge, total: total.toFixed(2) });
    };

    const calculateTotalDiscount = (items) => {
        return items?.reduce((acc, item) => acc + (parseFloat(item.discount) || 0), 0);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        const item = newItems[index];
        let discountAmount = 0;
        let discountPercentage = 0;
        const totalDiscount = calculateTotalDiscount(newItems);
        if (field === 'discount_type') {
            newItems[index].discount = 0;
        }

        if (field === 'unit_id') {
            newItems[index].unit_id = value;
        }

        if (field === "item_id" && value !== "") {
            setIsItemSelect(true);
        } else if (field === "item_id" && value == "") {
            setIsItemSelect(false);
        }

        if (field === 'item_id') {
            const selectedItem = itemList?.data?.item.find(item => item.id === value);
            if (selectedItem) {
                const showPice = formData?.sale_type ? selectedItem?.price : selectedItem?.purchase_price;

                newItems[index].rate = showPice;
                newItems[index].unit_id = selectedItem?.unit;
                newItems[index].gross_amount = (+showPice) * (+item?.quantity)
                if (selectedItem.tax_preference === "1") {
                    newItems[index].tax_rate = !selectedItem?.tax_rate ? 0 : selectedItem?.tax_rate;
                    newItems[index].tax_name = "Taxable";
                } else {
                    newItems[index].tax_rate = "0";
                    newItems[index].tax_name = "Non-Taxable";
                }

            }
        }

        if (field === "quantity") {
            newItems[index].gross_amount = (+item.rate) * (+item?.quantity);
        }

        const grossAmount = item.rate * item.quantity;
        const taxAmount = (grossAmount * item.tax_rate) / 100;
        if (item.discount_type === 1) {
            discountAmount = Math.min(item.discount,);
        } else if (item.discount_type === 2) {
            discountPercentage = Math.min(item.discount, 100);
        }

        // const grossAmountPlTax = grossAmount + taxAmount;//total amount including tax excluding discount
        const discount = item.discount_type === 1 ? discountAmount : (grossAmount * discountPercentage) / 100;
        const finalAmount = grossAmount - discount;

        newItems[index].final_amount = finalAmount.toFixed(2); // Round to 2 decimal places
        newItems[index].tax_amount = taxAmount.toFixed(2); // for calculate tax amount

        const tax_amount = newItems.reduce((acc, item) => acc + parseFloat(item.tax_amount), 0);
        const subtotal = newItems.reduce((acc, item) => acc + parseFloat(item.final_amount), 0);
        const total = subtotal + (parseFloat(formData.shipping_charge) || 0) + (parseFloat(formData.adjustment_charge) || 0) + (parseFloat(tax_amount) || 0);

        setFormData({
            ...formData,
            discount: totalDiscount,
            items: newItems,
            subtotal: subtotal.toFixed(2),
            total: total.toFixed(2),
            tax_amount: tax_amount.toFixed(2)
        });
    };

    const handleItemRemove = (index) => {
        const newItems = formData.items.filter((item, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleItemReset = (index) => {
        setIsItemSelect(false)
        const newItems = [...formData?.items];
        newItems[index] = {
            item_id: '',
            quantity: 1,
            gross_amount: 0,
            rate: 0,
            unit_id: null,
            final_amount: 0,
            tax_amount: 0,
            tax_rate: 0,
            tax_amount: 0,
            discount: 0,
            discount_type: 1,
            item_remark: 0,
        };

        const taxAmount = newItems.reduce((acc, item) => acc + parseFloat(item.tax_amount || 0), 0);
        const subtotal = newItems.reduce((acc, item) => acc + parseFloat(item.final_amount || 0), 0);
        const total = subtotal + parseFloat(formData.shipping_charge || 0) + parseFloat(formData.adjustment_charge || 0);

        setFormData({
            ...formData,
            items: newItems,
            subtotal: subtotal.toFixed(2),
            total: total.toFixed(2),
            tax_amount: taxAmount.toFixed(2),
        });
    };


    const handleItemAdd = () => {
        const newItems = [...formData.items, {
            item_id: '',
            quantity: 1,
            unit_id: null,
            gross_amount: null,
            rate: null,
            final_amount: null,
            tax_amount: null,
            tax_rate: null,
            tax_amount: 0,
            discount: 0,
            discount_type: 1,
            item_remark: null,
        }];
        setFormData({ ...formData, items: newItems });
    };

    useEffect(() => {
        return handleKeyPress(buttonRef, handleItemAdd);
    }, [buttonRef, handleItemAdd]);

    return (
        <>
            <div className="f1wrpofcreqsx2">
                <div className='itemsectionrows'>
                    <div className="tableheadertopsxs1">
                        <p className='tablsxs1a1x3'>Item<b className="color_red">*</b></p>
                        <p className='tablsxs1a2x3'>Sales Price</p>
                        <p className='tablsxs1a3x3'>Quantity</p>
                        <p className='tablsxs1a4x3'>Discount</p>
                        <p className='tablsxs1a5x3'>Tax</p>
                        <p className='tablsxs1a6x3' style={{ marginLeft: "1%" }}>Amount</p>
                    </div>

                    {formData?.items?.map((item, index) => (
                        <>
                            <div key={index} className="tablerowtopsxs1">
                                <div className="tablsxs1a1x3">
                                    <span >
                                        <CustomDropdown03
                                            options={itemList?.data?.item || []}
                                            value={item.item_id}
                                            onChange={(e) => handleItemChange(index, 'item_id', e.target.value, e.target.option)}
                                            name="item_id"
                                            type="select_item"
                                            // setShowPopup={setShowPopup1}
                                            setItemData={setItemData}
                                            defaultOption="Select Item"
                                            index={index}
                                            extracssclassforscjkls={extracssclassforscjkls}
                                            ref={dropdownRef2}

                                        />
                                    </span>
                                </div>

                                <div className="tablsxs1a2x3">

                                    <NumericInput
                                        value={item.rate}
                                        placeholder="0.00"
                                        onChange={(e) => {
                                            let newValue = e.target.value;
                                            if (newValue < 0) newValue = 0;
                                            if (!isNaN(newValue) && newValue >= 0) {
                                                handleItemChange(index, "rate", newValue);
                                            } else {
                                                toast('Amount cannot be negative', {
                                                    icon: '👏', style: {
                                                        borderRadius: '10px', background: '#333',
                                                        color: '#fff', fontSize: '14px',
                                                    },
                                                }
                                                );
                                            }
                                        }}
                                    />
                                </div>



                                <div className="tablsxs1a3x3">

                                    <NumericInput
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (inputValue === "") {
                                                handleItemChange(index, 'quantity', 0); // or some other default value
                                            } else {
                                                const newValue = parseInt(inputValue, 10);
                                                if (newValue === NaN) newValue = 0;
                                                if (!isNaN(newValue) && newValue >= 1) {
                                                    handleItemChange(index, 'quantity', newValue);
                                                }
                                            }
                                        }}
                                        style={{ width: "40%" }}
                                    />
                                    {item?.unit_id && (
                                        <p>(<ShowMastersValue type="2" id={item.unit_id} />)</p>
                                    )}

                                </div>


                                <div className="tablsxs1a5x3">
                                    <span>
                                        <NumericInput
                                            value={item.discount}
                                            onChange={(e) => {
                                                let newValue = e.target.value;
                                                if (newValue < 0) newValue = 0;
                                                if (item.discount_type === 2) {
                                                    newValue = Math.min(newValue, 100);
                                                    if (newValue === 100) {
                                                        // Use toast here if available
                                                        toast('Discount percentage cannot exceed 100%.', {
                                                            icon: '👏', style: {
                                                                borderRadius: '10px', background: '#333', fontSize: '14px',
                                                                color: '#fff',
                                                            },
                                                        }
                                                        );
                                                    }
                                                } else {
                                                    newValue = Math.min(newValue, item.rate * item.quantity + (item.rate * item.tax_rate * item.quantity) / 100);
                                                    if (newValue > item.rate * item.quantity) {
                                                        toast('Discount amount cannot exceed the final amount.', {
                                                            icon: '👏', style: {
                                                                borderRadius: '10px', background: '#333', fontSize: '14px',
                                                                color: '#fff',
                                                            },
                                                        }
                                                        );
                                                    }
                                                }

                                                handleItemChange(index, 'discount', newValue);

                                            }}
                                        />


                                        <div
                                            className="dropdownsdfofcus56s"
                                            onClick={() => handleDropdownToggle(index)}

                                        >
                                            {item.discount_type === 1 ? "$" : item.discount_type === 2 ? '%' : ''}
                                            {openDropdownIndex === index && (
                                                <div className="dropdownmenucustomx1" ref={dropdownRef}>
                                                    <div className='dmncstomx1' onClick={() => handleItemChange(index, 'discount_type', 1)}>{currencySymbol}</div>
                                                    <div className='dmncstomx1' onClick={() => handleItemChange(index, 'discount_type', 2)}>%</div>
                                                </div>
                                            )}
                                        </div>


                                    </span>
                                </div>



                                <div className="tablsxs1a6x3" style={{ width: "10%", cursor: "not-allowed" }}>

                                    {item.tax_name === "Taxable" && (

                                        <> {item?.tax_rate} </>
                                    )}
                                    {item.tax_name === "Non-Taxable" && (
                                        <>{item?.tax_name}</>
                                    )}
                                    {item.tax_name === "Taxable" && "%"}
                                </div>


                                <div className="tablsxs1a7x3" style={{ cursor: "not-allowed" }}>
                                    {item?.final_amount}
                                </div>

                                {formData?.items?.length > 1 ? (
                                    <button className='removeicoofitemrow' type="button" onClick={() => handleItemRemove(index)} onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            handleItemRemove(index);
                                        }
                                    }}
                                    > <RxCross2 /> </button>
                                ) : (
                                    <button className='removeicoofitemrow' type="button" onClick={() => handleItemReset(index)} onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            handleItemReset(index);
                                        }
                                    }}
                                    > <SlReload /> </button>
                                )}
                            </div>
                        </>


                    ))}
                </div>
                {!isItemSelect && <p className="error-message">
                    {otherIcons.error_svg}
                    Please Select An Item</p>}

                <button id='additembtn45srow' type="button" onClick={handleItemAdd} ref={buttonRef}
                >Add New Row<GoPlus /></button>


                <div className="height5"></div>
                <div className='secondtotalsections485s'>

                    {
                        note ?
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
                            :

                            <div className='textareaofcreatqsiform'>
                                <label>Vendor Note</label>
                                <div className='show_no_of_text_limit_0121'>
                                    <TextAreaComponentWithTextLimit
                                        formsValues={{ handleChange, formData }}
                                        placeholder='Will be displayed on the estimate'
                                        name="vendor_note"
                                        value={formData.vendor_note == 0 ? '' : formData.vendor_note}
                                    />
                                </div>

                            </div>
                    }


                    <div className="calctotalsection">
                        <div className="calcuparentc">
                            <div className='clcsecx12s1'>
                                <label>Subtotal:</label>
                                <NumericInput
                                    value={formData.subtotal}
                                    readOnly
                                    placeholder='0.00'
                                    className='inputsfocalci465s'
                                />
                            </div>
                            <div className='clcsecx12s1'>
                                <label>Total Tax:</label>
                                <input
                                    type="text"
                                    value={formData.tax_amount}
                                    readOnly
                                    placeholder='0.00'
                                    className='inputsfocalci465s'

                                />
                            </div>

                            <div className='clcsecx12s1'>
                                <label>Shipping Charge:</label>
                                <NumericInput
                                    className='inputsfocalci4'
                                    value={formData.shipping_charge}
                                    onChange={handleShippingChargeChange}
                                    placeholder='0.00'
                                />
                            </div>
                            <div className='clcsecx12s1'>
                                <label>Adjustment Charge:</label>
                                <NumericInput
                                    className='inputsfocalci4'
                                    value={formData.adjustment_charge}
                                    onChange={handleAdjustmentChargeChange}
                                    placeholder='0.00'
                                />
                            </div>
                            {!formData?.items[0]?.item_id ?
                                <b className='idofbtagwarninhxs5'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#f6b500"} fill={"none"}>
                                    <path d="M5.32171 9.6829C7.73539 5.41196 8.94222 3.27648 10.5983 2.72678C11.5093 2.42437 12.4907 2.42437 13.4017 2.72678C15.0578 3.27648 16.2646 5.41196 18.6783 9.6829C21.092 13.9538 22.2988 16.0893 21.9368 17.8293C21.7376 18.7866 21.2469 19.6548 20.535 20.3097C19.241 21.5 16.8274 21.5 12 21.5C7.17265 21.5 4.75897 21.5 3.46496 20.3097C2.75308 19.6548 2.26239 18.7866 2.06322 17.8293C1.70119 16.0893 2.90803 13.9538 5.32171 9.6829Z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M12.2422 17V13C12.2422 12.5286 12.2422 12.2929 12.0957 12.1464C11.9493 12 11.7136 12 11.2422 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M11.992 8.99997H12.001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>To edit the shipping and adjustment charge, select an item first.</b> : ''}
                        </div>

                        <div className='clcsecx12s2'>
                            <label>Total ({currencySymbol}):</label>
                            <input
                                type="text"
                                value={formData?.total}
                                readOnly
                                placeholder='0.00'
                            />
                        </div>


                    </div>
                </div>

                <div className="breakerci"></div>
                <div className="height5"></div>


            </div >
        </>
    )
}
export default ItemSelect




export const ItemSelectGRM = ({ formData, setFormData, handleChange, setIsItemSelect, isItemSelect, extracssclassforscjkls, dropdownRef2, note, itemData1, imgLoader,
    setImgeLoader, vendorList }) => {
    const itemList = useSelector((state) => state?.itemList);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const buttonRef1 = useRef(null);
    const accountList = useSelector((state) => state?.accountList);
    const [freezLoadingImg, setFreezLoadingImg] = useState(false);
    const tax_rates = useSelector(state => state?.getTaxRate?.data?.data);
    const masterData = useSelector(state => state?.masterData?.masterData);


    const dispatch = useDispatch();

    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const [itemData, setItemData] = useState(false);
    const [cusData, setcusData] = useState(null);
    const handleDropdownToggle = (index) => {
        setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
    };


    useOutsideClick(dropdownRef, () => setOpenDropdownIndex(null));

    useEffect(() => {
        let sendData = {
            fy: localStorage.getItem('FinancialYear'),
            noofrec: 15,
            active: 1,
        };
        dispatch(itemLists(sendData));
        dispatch(accountLists({ fy: localStorage.getItem('FinancialYear') }));
    }, [dispatch]);



    const handleAdjustmentChargeChange = (e) => {
        const adjustmentCharge = parseFloat(e.target.value) || 0;
        const total = parseFloat(formData.subtotal || 0) + adjustmentCharge;//if I want 
        setFormData({ ...formData, adjustment_charge: adjustmentCharge, total: total.toFixed(2) });
    };

    const [totalCharges, setTotalCharges] = useState(0);

    const calculateTotalCharges = (charges) => {
        return charges?.reduce((total, item) => total + (+item?.amount || 0), 0);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        const newCharges = [...formData.charges_type];
        let updatedTotalCharges = totalCharges || formData?.total_grn_charges;

        // Update charges and recalculate total charges
        if (field === "amount" && newCharges[index]) {
            newCharges[index][field] = value;
            updatedTotalCharges = calculateTotalCharges(newCharges);
            setTotalCharges(updatedTotalCharges);
        }

        // Update item details
        if (field === "item_id") {
            const selectedItem = itemList?.data?.item?.find(item => item.id === value);
            if (selectedItem) {
                newItems[index] = {
                    ...newItems[index],
                    rate: +selectedItem.price,
                    gross_amount: +selectedItem?.price * (+newItems[index]?.gr_qty),
                    tax_rate: selectedItem?.tax_rate ? Math.floor(selectedItem?.tax_rate).toString() : null,
                    item_id: selectedItem?.id
                };
            }
            setIsItemSelect(value !== "");
        } else if (field === 'unit_id') {
            newItems[index].unit_id = value;
        } else if (['account_id', 'remarks', 'vendor_id'].includes(field)) {
            newCharges[index][field] = value;
        } else {
            newItems[index][field] = value;
            if (field === "gr_qty") {
                newItems[index].gross_amount = (+newItems[index].rate) * (+value);
            }
        }

        // Recalculate final_amount and charges_weight for all items
        const updatedItems = newItems.map(item => {
            const grossAmount = +item.rate * +item.gr_qty;
            const taxAmount = (grossAmount * (+item.tax_rate || 0) / 100) + (grossAmount * (+item.custom_duty || 0) / 100);
            const charges = updatedTotalCharges ? (grossAmount / updatedTotalCharges) : 0;
            const finalAmount = grossAmount + charges + taxAmount;

            return {
                ...item,
                final_amount: finalAmount.toFixed(2),
                charges_weight: updatedTotalCharges ? (grossAmount / updatedTotalCharges) : null,
            };
        });

        // console.log("")

        const subtotal = updatedItems.reduce((acc, item) => acc + parseFloat(item.final_amount), 0);
        const total = subtotal + (parseFloat(formData.adjustment_charge) || 0);

        setFormData({
            ...formData,
            items: updatedItems,
            charges_type: newCharges,
            subtotal: subtotal.toFixed(2),
            total: total.toFixed(2),
        });
    };


    useEffect(() => {
        setFormData({
            ...formData,
            total_grn_charges: totalCharges,
        });
    }, [totalCharges]);

    const handleGRNReset = (index) => {
        setIsItemSelect(false)
        const newItems = [...formData?.items];
        newItems[index] = {
            item_id: '',
            gr_qty: 1,
            po_qty: null,
            gross_amount: null,
            rate: null,
            final_amount: null,
            tax_rate: null,
            item_remark: null,
            upload_image: ''
        };
    }

    const handleItemAdd = () => {
        const newItems = [...formData?.items, {
            item_id: '',
            gr_qty: 1,
            po_qty: null,
            gross_amount: null,
            rate: null,
            final_amount: null,
            tax_rate: null,
            item_remark: null,
            upload_image: ''
        }];
        setFormData({ ...formData, items: newItems });
    };

    // console.log('formdata', formData?.total_charges)

    const handleChargesAdd = () => {
        const newItems = [...formData?.charges_type, {
            account_id: null,
            amount: null,
            remarks: null,
            vendor_id: null,
            upload_image: ""
        }];
        setFormData({ ...formData, charges_type: newItems });
    };

    const handleItemRemove = (index) => {
        const newItems = formData.items.filter((item, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };
    const handleChargeRemove = (index) => {
        const newItems = formData.charges_type.filter((item, i) => i !== index);
        setFormData({ ...formData, charges_type: newItems });
    };

    useEffect(() => {
        return handleKeyPress(buttonRef, handleChargesAdd);
    }, [buttonRef, handleChargesAdd]);

    useEffect(() => {
        return handleKeyPress(buttonRef1, handleItemAdd);
    }, [buttonRef1, handleItemAdd]);



    return (
        <>

            <div className="f1wrpofcreqsx2 ">
                {freezLoadingImg && <MainScreenFreezeLoader />}
                {/* {grnDetai?.loaging && <MainScreenFreezeLoader />} */}
                <>
                    <div className='itemsectionrows1' style={{ minWidth: "1225px" }}>
                        <div className="tableheadertopsxs1" id='tableheadertopsxs1'>
                            <p className={`tablsxs1a1x34 ${formData?.grn_type === "Import" ? 'import_P' : 'local_p'}`}>ITEM<b className='color_red'>*</b></p>
                            <p className='tablsxs1a2x3 tablsxs1a2x1' style={{ textAlign: "right", width: "117px", marginRight: "20px" }}>ITEM PRICE</p>

                            {
                                formData?.purchase_order_id && formData?.purchase_order_id !== 0 ? <p className='tablsxs1a3x3 tablsxs1a2x2' >PO QTY</p> : ""
                            }

                            <p className='tablsxs1a3x3 tablsxs1a2x3'>GRN QTY</p>
                            <p className='tablsxs1a4x3 tablsxs1a2x4' style={{ width: "131px" }}>CHARGES WEIGHT</p>
                            <p className='tablsxs1a4x3 tablsxs1a2x5' style={{ width: "125px" }}>SELECT UNIT</p>
                            <p className='tablsxs1a5x3_grm tablsxs1a2x6' style={{ width: "124px", textAlign: "left" }}>TAX</p>

                            {
                                formData?.grn_type === "Import" &&
                                <p className='tablsxs1a5x3_grm tablsxs1a2x7' style={{ width: "148px", textAlign: "left" }}>CUSTOM DUTY</p>
                            }

                            <p className='tablsxs1a6x3 tablsxs1a2x8' style={{ width: "120px", textAlign: "right" }}>FINAL AMOUNT</p>

                        </div>

                        {formData?.items?.map((item, index) => (
                            <>
                                <div key={index} className="tablerowtopsxs1" >
                                    <div className="tablsxs1a1x3">
                                        <span id='ITEM_Selection'>
                                            <CustomDropdown03
                                                options={itemList?.data?.item || []}
                                                value={item.item_id}
                                                onChange={(e) => handleItemChange(index, 'item_id', e.target.value, e.target.option)}
                                                name="item_id"
                                                type="select_item"
                                                // setShowPopup={setShowPopup1}
                                                setItemData={setItemData}
                                                defaultOption="Select Item"
                                                index={index}
                                                extracssclassforscjkls={extracssclassforscjkls}
                                                ref={dropdownRef2}
                                            />
                                        </span>
                                    </div>

                                    {/* ITEM PRICE */}
                                    <div id='ITEM_Selection2' className={`tablsxs1a2x3 ${formData?.grn_type === "Import" ? 'incom_12312' : ''}`} style={{ boder: "1px solid #e7d8d", marginRight: "20px" }}>
                                        <NumericInput
                                            value={item.rate}
                                            readOnly={formData?.purchase_order_id}
                                            placeholder="0.00"
                                            onChange={(e) => {
                                                let newValue = e.target.value;
                                                if (newValue < 0) newValue = 0;
                                                if (!isNaN(newValue) && newValue >= 0) {
                                                    handleItemChange(index, "rate", newValue);
                                                } else {
                                                    toast('Amount cannot be negative', {
                                                        icon: '👏', style: {
                                                            borderRadius: '10px', background: '#333',
                                                            color: '#fff', fontSize: '14px',
                                                        },
                                                    });
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* PO QUANTITY */}
                                    {formData?.purchase_order_id && formData?.purchase_order_id !== 0 ?
                                        <div className="tablsxs1a3x3" id='ITEM_Selection3'>
                                            <NumericInput
                                                value={item.po_qty}
                                                readOnly
                                            />
                                        </div> : ""
                                    }

                                    {/* GRN QUANTITY */}
                                    <div className="tablsxs1a3x3x3" id='ITEM_Selection4'>
                                        <NumericInput
                                            value={item.gr_qty}
                                            placeholder='1'
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                if (inputValue < 0) inputValue = 0;

                                                if (inputValue > item?.po_qty && item?.po_qty) {
                                                    toast('GRN quantity is cannot grater than the Purchase Order Quantity.', {
                                                        icon: '👏', style: {
                                                            borderRadius: '10px', background: '#333', fontSize: '14px',
                                                            color: '#fff',
                                                        },
                                                    }
                                                    )
                                                } else {
                                                    if (inputValue === "") {
                                                        handleItemChange(index, 'gr_qty', 0); // or some other default value
                                                    } else {
                                                        const newValue = parseInt(inputValue, 10);
                                                        if (isNaN(newValue)) newValue = 0;
                                                        if (!isNaN(newValue) && newValue >= 1) {
                                                            handleItemChange(index, 'gr_qty', newValue);
                                                        }
                                                    }
                                                }

                                            }}
                                        />
                                    </div>

                                    {/* CHARGES WEIGHT */}
                                    <div className="tablsxs1a4x3" id='ITEM_Selection5'>
                                        <span>
                                            {item?.charges_weight ? item?.charges_weight.toFixed(2) : 0}
                                        </span>
                                    </div>


                                    <div className="tablsxs1a5x3" id='ITEM_Selection6'>
                                        <span >
                                            <CustomDropdown04
                                                options={masterData?.filter(type => type.type === "2")}
                                                value={item?.unit_id}
                                                onChange={(e) => handleItemChange(index, 'unit_id', e.target.value, e.target.option)} name="unit_id"
                                                defaultOption="Units"
                                                type="masters"
                                                extracssclassforscjkls="extracssclassforscjklsitem"
                                            />
                                        </span>
                                    </div>

                                    {/* TAX RATE */}
                                    <div className="tablsxs1a6x3_rm" id='ITEM_Selection7'>
                                        <CustomDropdown13
                                            options={tax_rates}
                                            value={item.tax_rate}
                                            onChange={(e) => handleItemChange(index, 'tax_rate', e.target.value)}
                                            name="tax_rate"
                                            type="taxRate"
                                            defaultOption="Taxes"
                                            extracssclassforscjkls="extracssclassforscjkls grn_tax"
                                        />

                                    </div>
                                    {
                                        formData?.grn_type === "Import" &&
                                        <div className="form_commonblock" id='ITEM_Selection8'>
                                            <CustomDropdown13
                                                options={tax_rates}
                                                value={item.custom_duty}
                                                onChange={(e) => handleItemChange(index, 'custom_duty', e.target.value)}
                                                name="custom_duty"
                                                type="taxRate"
                                                defaultOption="Duties"
                                                extracssclassforscjkls="extracssclassforscjkls grn_tax"

                                            />
                                        </div>
                                    }

                                    {/* FINAL AMOUNT */}
                                    <div className="tablsxs1a7x3" id='ITEM_Selection9' style={{ width: "120px" }}>
                                        <NumericInput
                                            value={item.final_amount}
                                            placeholder="0.00"
                                            onChange={(e) => handleItemChange(index, 'final_amount', e.target.value)}
                                            readOnly
                                        />
                                    </div>

                                    {/* IMAGE UPLOAD */}


                                    {formData?.items?.length > 1 ? (
                                        <button className='removeicoofitemrow' type="button" onClick={() => handleItemRemove(index)} onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                handleItemRemove(index);
                                            }
                                        }}>
                                            <RxCross2 />
                                        </button>
                                    ) : (
                                        <button className='removeicoofitemrow' type="button" onClick={() => handleGRNReset(index)} onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                handleGRNReset(index);
                                            }
                                        }}>
                                            <SlReload />
                                        </button>
                                    )}
                                </div>
                                <div className="tablerowtopsxs1" >
                                    <div style={{ maxWidth: '318px' }} className={`form_commonblock ${formData?.grn_type === "Import" ? 'Note_import' : ''}`}>
                                        <span>
                                            <input type="text" style={{ width: "100%" }} value={item.item_remark}
                                                onChange={(e) => handleItemChange(index, 'item_remark', e.target.value)}
                                                name='item_remark'
                                                placeholder='Discrepency Notes' />
                                        </span>
                                    </div>

                                    <div id="imgurlanddesc" className='calctotalsectionx2' >
                                        <ImageUploadGRN
                                            formData={formData}
                                            setFormData={setFormData}
                                            setFreezLoadingImg={setFreezLoadingImg}
                                            imgLoader={imgLoader}
                                            setImgeLoader={setImgeLoader}
                                            component="purchase"
                                            type="grm"
                                            index={index}
                                        />
                                    </div>


                                </div>
                            </>
                        ))}

                    </div>
                    {!isItemSelect && <p className="error-message">
                        {otherIcons.error_svg}
                        Please Select Item</p>}

                    <button id='additembtn45srow' type="button" onClick={handleItemAdd} ref={buttonRef1}
                    >Add New Row<GoPlus /></button>
                </>


                <>
                    <div className='itemsectionrows1' style={{ minWidth: "1225px" }}>
                        <div className="tableheadertopsxs1" id='new_grm_tabal_2'>
                            <p className='tablsxs1a1x3'>CHARGES TYPE</p>
                            <p className='tablsxs1a1x3'>SELECT VENDOR</p>
                            <p className='tablsxs1a2x3'>AMOUNT</p>
                            <p className='tablsxs1a3x3'>REMARK</p>
                            <p className='tablsxs1a4x3'>ATTACHAMENT</p>
                        </div>

                        <br></br>
                        {formData?.charges_type?.map((item, index) => (
                            <>
                                <div key={index} className="tablerowtopsxs1">
                                    <div className="tablsxs1a1x3" style={{
                                        background: "hsla(205, 86%, 95%, 0.45)",
                                        borderRadius: "4px"
                                    }}>
                                        <span>
                                            {/* {otherIcons.currency_icon} */}
                                            <CustomDropdown15
                                                style={{ paddingLeft: 0 }}
                                                label="Expense Account"
                                                options={accountList?.data?.accounts || []}
                                                value={item?.account_id}
                                                onChange={(e) => handleItemChange(index, 'account_id', e.target.value, e.target.option)}
                                                name="account_id"
                                                defaultOption="Select Expense Account"
                                                extracssclassforscjkls={extracssclassforscjkls}
                                                index={index}
                                            />
                                        </span>

                                    </div>
                                    <div className="tablsxs1a1x3" style={{
                                        background: "hsla(205, 86%, 95%, 0.45)",
                                        borderRadius: "4px"
                                    }}>
                                        <span id=''>
                                            <CustomDropdown10
                                                label="Select vendor"
                                                options={vendorList?.data?.user?.filter((val) => val?.active === "1")}
                                                value={item.vendor_id}
                                                onChange={(e) => handleItemChange(index, 'vendor_id', e.target.value, e.target.option)}
                                                name="vendor_id"
                                                defaultOption="Select Vendor Name"
                                                setcusData={setcusData}
                                                type="vendor"
                                                required
                                            />
                                        </span>
                                    </div>

                                    {/* AMOUNT */}
                                    <div className="tablsxs1a2x3" style={{
                                        width: "106px", marginLeft:
                                            "28px"
                                    }}>
                                        <NumericInput
                                            value={item.amount}
                                            placeholder="0.00"
                                            onChange={(e) => {
                                                let newValue = e.target.value;
                                                if (newValue < 0) newValue = 0;
                                                if (!isNaN(newValue) && newValue >= 0) {
                                                    handleItemChange(index, "amount", newValue);
                                                } else {
                                                    toast('Amount cannot be negative', {
                                                        icon: '👏', style: {
                                                            borderRadius: '10px', background: '#333',
                                                            color: '#fff', fontSize: '14px',
                                                        },
                                                    }
                                                    );
                                                }
                                            }}
                                        />
                                    </div>


                                    {/* REMARK */}
                                    <div className="tablsxs1a3x3">
                                        <div className="form_commonblock ">
                                            <span >
                                                <input type="text" style={{ width: "100%" }} value={item.remarks}
                                                    onChange={(e) => {
                                                        let newValue = e.target.value;
                                                        handleItemChange(index, "remarks", newValue);
                                                    }}
                                                    name='remarks'
                                                    placeholder='Remark' />
                                            </span>
                                        </div>
                                    </div>

                                    {/* ATTACHAMENT */}
                                    <div id="imgurlanddesc" className='calctotalsectionx2'>
                                        <ImageUploadGRN
                                            formData={formData}
                                            setFormData={setFormData}
                                            setFreezLoadingImg={setFreezLoadingImg}
                                            imgLoader={imgLoader}
                                            setImgeLoader={setImgeLoader}
                                            component="purchase"
                                            type="grm_charge"
                                            index={index}
                                        />
                                    </div>

                                    {formData?.charges_type?.length > 1 ? (
                                        <button className='removeicoofitemrow' type="button" onClick={() => handleChargeRemove(index)} onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                handleChargeRemove(index);
                                            }
                                        }}
                                        > <RxCross2 /> </button>
                                    ) : (
                                        <button className='removeicoofitemrow' type="button" onClick={() => handleGRNReset(index)} onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                handleGRNReset(index);
                                            }
                                        }}
                                        > <SlReload /> </button>
                                    )}
                                </div>

                            </>


                        ))}
                    </div>
                    {/* {!isItemSelect && <p className="error-message">
                        {otherIcons.error_svg}
                        Please Select An Item</p>} */}

                    <button id='additembtn45srow' type="button" onClick={handleChargesAdd} ref={buttonRef}
                    >Add New Row<GoPlus /></button>
                </>

                <div className="height5"></div>
                <div className='secondtotalsections485s'>

                    {
                        note ?
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
                            :
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
                    }


                    <div className="calctotalsection">
                        <div className="calcuparentc">
                            <div className='clcsecx12s1'>
                                <label>Subtotal:</label>
                                <NumericInput
                                    value={formData.subtotal}
                                    readOnly
                                    placeholder='0.00'
                                    className='inputsfocalci465s'
                                />
                            </div>

                            <div className='clcsecx12s1'>
                                <label>Adjustment Charge:</label>
                                <NumericInput
                                    className='inputsfocalci4'
                                    value={formData.adjustment_charge}
                                    onChange={handleAdjustmentChargeChange}
                                    placeholder='0.00'
                                />
                            </div>

                        </div>

                        <div className='clcsecx12s2'>
                            <label>Total ({currencySymbol}):</label>
                            <input
                                type="text"
                                value={formData.total}
                                readOnly
                                placeholder='0.00'
                            />
                        </div>
                        <div className='clcsecx12s2'>
                            <label>Total Charges ({currencySymbol}):</label>
                            <input
                                type="text"
                                value={formData.total_grn_charges}
                                readOnly
                                placeholder='0.00'
                            />
                        </div>
                    </div>
                </div>

                <div className="breakerci"></div>
                <div className="height5"></div>


            </div>
        </>
    )
}