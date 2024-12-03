import { useState, useEffect } from 'react';
import { getCurrencyFormData } from '../../Helper/HelperFunctions';

export const useFormState = (quoteDetails, itemId, isEdit, convert, module) => {

    const [formData, setFormData] = useState({
        sale_type: module,
        transaction_date: new Date(),
        warehouse_id: localStorage.getItem('selectedWarehouseId') || '',
        [module === "quotation" ? "quotation_id" : module === "sale_order" ? "sale_order_id" : ""]: module === "quotation" ? "QT-23242" : module === "sale_order" ? "SO-00001" : "",
        customer_id: '',
        upload_image: null,
        customer_type: null,
        customer_name: null,
        phone: null,
        email: null,
        address: "",
        reference_no: "",
        currency: getCurrencyFormData,
        [module === "quotation" ? "expiry_date" : module === "sale_order" ? "shipment_date" : ""]: module === "quotation" ? new Date() : module === "sale_order" ? "" : "",
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
        status: '',
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

    const [imageLoader, setImgeLoader] = useState(null);
    const [addSelect, setAddSelect] = useState({ billing: null, shipping: null });
    const [cusData, setcusData] = useState(null);
    const [isCustomerSelect, setIsCustomerSelect] = useState(false);
    const [isItemSelect, setIsItemSelect] = useState(false);

    useEffect(() => {
        if (itemId && isEdit && quoteDetails || itemId && (convert === "toInvoice" || convert === "quotationToSale")) {
            const calculateTotalTaxAmount = () => {
                return quoteDetails?.items?.reduce((total, entry) => {
                    return total + ((entry?.tax_amount) ? parseFloat(entry?.tax_amount) : 0);
                }, 0);
            };

            const itemsFromApi = quoteDetails?.items?.map(item => ({
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
                id: quoteDetails.id,

                sale_type: convert === "toInvoice" ? "invoice" : convert === "toInvoice" ? "invoice" : module,

                transaction_date: quoteDetails.transaction_date,
                warehouse_id: quoteDetails.warehouse_id,

                [module === "quotation" ? "quotation_id" : module === "sale_order" ? "sale_order_id" : ""]: module === "quotation" ? quoteDetails?.quotation_id : module === "sale_order" ? quoteDetails?.sale_order_id : "",

                customer_id: (+quoteDetails.customer_id),
                upload_image: quoteDetails.upload_image,
                customer_type: quoteDetails.customer_type,
                customer_name: quoteDetails.customer_name,
                phone: quoteDetails.phone,
                email: quoteDetails.email,
                reference_no: quoteDetails.reference_no,
                currency: quoteDetails.currency,

                [module === "quotation" ? "expiry_date" : module === "sale_order" ? "shipment_date" : ""]: module === "quotation" ? quoteDetails?.expiry_date : module === "sale_order" ? quoteDetails?.shipment_date : "",

                sale_person: quoteDetails.sale_person,
                payment_terms: quoteDetails.payment_terms,
                delivery_method: quoteDetails.delivery_method,
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
                const parsedAddress = JSON?.parse(quoteDetails?.address);
                const dataWithParsedAddress = {
                    ...quoteDetails,
                    address: parsedAddress
                };
                setAddSelect({
                    billing: dataWithParsedAddress?.address?.billing,
                    shipping: dataWithParsedAddress?.address?.shipping,
                });
                setcusData(dataWithParsedAddress?.customer);
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

    return {
        formData,
        setFormData,
        imageLoader,
        setImgeLoader,
        addSelect,
        setAddSelect,
        cusData,
        setcusData,
        isCustomerSelect,
        setIsCustomerSelect,
        isItemSelect,
        setIsItemSelect,
    };
};
