//qauotation.

const commonStatus = [
    {
        labelId: "0",
        label: "Draft"
    },
    {
        labelId: "1",
        label: "Approved"
    },
    {
        labelId: "2",
        label: "Rejected"
    },

];

export const quotationFilterOptions = [
    ...commonStatus, // Spread the array directly, not inside an object
    {
        labelId: "6",
        label: "Sent"
    },
    {
        labelId: "7",
        label: "Sale Ordered"
    },
    // {
    //     labelId: "4",
    //     label: "Pending"
    // },
    {
        labelId: "8",
        label: "Invoiced"
    },

    {
        labelId: "expiry_date",
        label: "Expired"
    },
];


//sale order
export const saleOrderFilterOptions = [

    ...commonStatus,

    {
        labelId: "6",
        label: "Open"
    },
    {
        labelId: "4",
        label: "Pending"
    },

    {
        labelId: "8",
        label: "Invoiced"
    },


    {
        labelId: "expiry_date",
        label: "Expired"
    },

];

//Invoice/ Delivery Challan
export const invoiceFilterOptions = [
    ...commonStatus,

    // {
    //     labelId: "6",
    //     label: "Sent"
    // },

    {
        labelId: "3",
        label: "Pending"
    },

    {
        labelId: "5",
        label: "Paid"
    },

];
export const deliveryChallanFilterOptions = [
    {
        labelId: "0",
        label: "Draft"
    },
    {
        labelId: "6",
        label: "Sent"
    },
    {
        labelId: "4",
        label: "Delivered"
    },

   
];

//credit note
export const creditNotesOptions = [
    {
        labelId: "0",
        label: "Draft"
    },
    {
        labelId: "1",
        label: "Approved"
    },
    {
        labelId: "6",
        label: "Sent"
    },
    {
        labelId: "2",
        label: "Rejected"
    },
];
//credit not and payment rec.
export const paymentRecOptions = [
    {
        labelId: "1",
        label: "Cash"
    },
    {
        labelId: "2",
        label: "Bank Transfer"
    },
    {
        labelId: "3",
        label: "Bank Remittance"
    },
    {
        labelId: "4",
        label: "Check"
    },
    {
        labelId: "5",
        label: "Credit Card"
    },
    {
        labelId: "6",
        label: "Stripe"
    },
];


//GRN Approval
export const purchaseOrderFilterOptions = [

    {
        labelId: "0",
        label: "Draft"
    },
    {
        labelId: "6",
        label: "Open"
    },

    {
        labelId: "1",
        label: "Approved"
    },

   
    {
        labelId: "3",
        label: "GRN Transfer"
    },

    {
        labelId: "4",
        label: "Bill Created"
    },

    {
        labelId: "2",
        label: "Declined"
    },
   



];




export const GRNApprovalFilterOptions = [
    {
        labelId: "0",
        label: "Draft"
    },

    {
        labelId: "1",
        label: "Bill Created"
    },
    {
        labelId: "3",
        label: "Pending"
    },

    {
        labelId: "6",
        label: "Sent"
    },


    {
        labelId: "2",
        label: "Declined"
    },
];
export const GRNFilterOptions = [
    {
        labelId: "0",
        label: "Draft"
    },

    {
        labelId: "1",
        label: "Bill Created"
    },
   


    {
        labelId: "2",
        label: "Declined"
    },
];
//Bill
export const billFilterOptions = [
    {
        labelId: "0",
        label: "Draft"
    },

    {
        labelId: "1",
        label: "Approved"
    },
   
    {
        labelId: "5",
        label: "Paid"
    },
    {
        labelId: "2",
        label: "Rejected"
    },
   
];

//Debit Notes
export const debitNotesFilterOptions = [
    {
        labelId: "0",
        label: "Draft"
    },

    {
        labelId: "1",
        label: "Approved"
    },
    {
        labelId: "3",
        label: "Pending"
    },

    {
        labelId: "6",
        label: "Sent"
    },


    {
        labelId: "2",
        label: "Rejected"
    },
];