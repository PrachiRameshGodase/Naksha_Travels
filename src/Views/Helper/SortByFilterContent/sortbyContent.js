import { otherIcons } from "../SVGIcons/ItemsIcons/Icons";
import { accountTableIcons } from "../SVGIcons/ItemsIcons/ItemsTableIcons";


const commonSortBy = [
    {
        id: "display_name",
        label: "Customer Name",
        icon: otherIcons.customer_svg,
    },
    {
        id: "created_at",
        label: "Created Date",
        icon: otherIcons.date_svg,
    },
    {
        id: "updated_at",
        label: "Last Modified",
        icon: otherIcons.date_svg,
    },
]


//quotation
export const quotationSortByOptions = [
    {
        id: "quotation_id",
        label: "Quotation Number",
        icon: otherIcons.quotation_icon,
    },
    ...commonSortBy,
];

//sale order
export const saleOrderSortByOptions = [
    {
        id: "sale_order_id",
        label: "Sale Order Number",
        icon: otherIcons.quotation_icon,
    },
    ...commonSortBy,
];

//invoice
export const invoiceSortByOptions = [
    {
        id: "invoice_id",
        label: "Invoie Number",
        icon: otherIcons.quotation_icon,
    },
    ...commonSortBy,
];

//delivery challan
export const deliveryChallanSortByOptions = [
    {
        id: "invoice_id",
        label: "Challan Number",
        icon: otherIcons.quotation_icon,
    },
    ...commonSortBy,
];



//credit notes
export const creditNotesSortByOptions = [
    {
        id: "credit_note_id",
        label: "Credit Note Number",
        icon: otherIcons.quotation_icon,
    },
    ...commonSortBy,
];

//payment receive
export const paymentReceiveSortByOptions = [
    {
        id: "payment_id",
        label: "Payment Number",
        icon: otherIcons.quotation_icon,
    },
    ...commonSortBy,
];

//GRN
export const GRNSortOptions = [
    {
        id: "grn_no",
        label: "GRN Number",
        icon: otherIcons.quotation_icon,
    },
    {
        id: "display_name",
        label: "Vendor Name",
        icon: otherIcons.customer_svg,
    },
    {
        id: "created_at",
        label: "Created Date",
        icon: otherIcons.date_svg,
    },
    {
        id: "updated_at",
        label: "Last Modified",
        icon: otherIcons.date_svg,
    },
];

//GRN Approval
export const GRNApprovalSortOptions = [
    {
        id: "grn_no",
        label: "GRN Number",
        icon: otherIcons.quotation_icon,
    },
    {
        id: "display_name",
        label: "Vendor Name",
        icon: otherIcons.customer_svg,
    },
    {
        id: "created_at",
        label: "Created Date",
        icon: otherIcons.date_svg,
    },
    {
        id: "updated_at",
        label: "Last Modified",
        icon: otherIcons.date_svg,
    },
];

//GRN Receiving Area
export const GRNRecAreaSortOptions = [
    {
        id: "grn_no",
        label: "GRN Number",
        icon: otherIcons.quotation_icon,
    },
    {
        id: "item_name",
        label: "Item Name",
        icon: otherIcons.customer_svg,
    },
    {
        id: "transaction_date",
        label: "Date",
        icon: otherIcons.date_svg,
    },
    // {
    //     id: "updated_at",
    //     label: "Last Modified",
    //     icon: otherIcons.date_svg,
    // },
];

//Bill
export const billSortOptions = [
    {
        id: "bill_no",
        label: "Bill Number",
        icon: otherIcons.quotation_icon,
    },
    {
        id: "display_name",
        label: "Vendor Name",
        icon: otherIcons.customer_svg,
    },
    {
        id: "created_at",
        label: "Created Date",
        icon: otherIcons.date_svg,
    },
    {
        id: "updated_at",
        label: "Last Modified",
        icon: otherIcons.date_svg,
    },
];

//Payment Made
export const purchaseOrderSortOptions = [
    {
        id: "purchase_order_id",
        label: "Purchase Number",
        icon: otherIcons.quotation_icon,
    },
    {
        id: "display_name",
        label: "Vendor Name",
        icon: otherIcons.customer_svg,
    },
    {
        id: "created_at",
        label: "Created Date",
        icon: otherIcons.date_svg,
    },
    {
        id: "updated_at",
        label: "Last Modified",
        icon: otherIcons.date_svg,
    },
];
//Payment Made
export const paymentMadeOptions = [
    {
        id: "payment_id",
        label: "Payment Number",
        icon: otherIcons.quotation_icon,
    },
    {
        id: "display_name",
        label: "Vendor Name",
        icon: otherIcons.customer_svg,
    },
    {
        id: "created_at",
        label: "Created Date",
        icon: otherIcons.date_svg,
    },
    {
        id: "updated_at",
        label: "Last Modified",
        icon: otherIcons.date_svg,
    },
];

//Expense
export const expenseSortOptions = [
    // {
    //     id: "payment_id",
    //     label: "Payment Number",
    //     icon: otherIcons.quotation_icon,
    // },
    // {
    //     id: "display_name",
    //     label: "Vendor Name",
    //     icon: otherIcons.customer_svg,
    // },
    {
        id: "created_at",
        label: "Created Date",
        icon: otherIcons.date_svg,
    },
    {
        id: "updated_at",
        label: "Last Modified",
        icon: otherIcons.date_svg,
    },
];

//Expense
export const debitNotesSortOptions = [
    {
        id: "debit_note_id",
        label: "Debit Note Number",
        icon: otherIcons.quotation_icon,
    },
    {
        id: "display_name",
        label: "Vendor Name",
        icon: otherIcons.customer_svg,
    },
    {
        id: "created_at",
        label: "Created Date",
        icon: otherIcons.date_svg,
    },
    {
        id: "updated_at",
        label: "Last Modified",
        icon: otherIcons.date_svg,
    },
];
export const accountsSortOptions = [
    {
        id: "account_name",
        label: "Account Name",
        icon: accountTableIcons[0].svg,
    },
    {
        id: "account_type",
        label: "Account Type",
        icon: accountTableIcons[2].svg,
    },
    {
        id: "account_code",
        label: "Account Code",
        icon: accountTableIcons[1].svg,
    },

];