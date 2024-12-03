import { billStatus } from "../../../Redux/Actions/billActions";
import { invoicesStatus } from "../../../Redux/Actions/invoiceActions";
import { purchasesStatus } from "../../../Redux/Actions/purchasesActions";
import { quotationStatus } from "../../../Redux/Actions/quotationActions";
import { saleOrderStatus } from "../../../Redux/Actions/saleOrderActions";
import { parseJSONofString } from "../HelperFunctions";

export const convertStatus = (dispatch, section, navigate, itemId, convert, response, quotationData) => {

    // quotation to sale-order show sale-ordered status
    if (section === "sale-order" && convert === "quotationToSale") {
        dispatch(quotationStatus({ id: itemId, status: "7" }, null));
    }

    // sent and approve quotation to invoice approval show Invoiced status
    if (section === "invoices" && convert === "quotationToInvoice" && response) {
        dispatch(quotationStatus({ id: itemId, status: "4" }, null));//status shown pending in invoice and invoiced in quotaion
        dispatch(invoicesStatus({ id: response?.data?.transaction?.id, status: "3" }, null, null));
    }

    // Sales Orders to invoice show Invoiced status
    if (section === "invoices" && convert === "saleToInvoice" && response) {
        dispatch(saleOrderStatus({ id: itemId, status: "4" }, null));
        dispatch(invoicesStatus({ id: response?.data?.transaction?.id, status: "3" }, null, null));

        const tracking_details = quotationData?.tracking_details
        const parshTracking_details = parseJSONofString(tracking_details)

        if (parshTracking_details?.module_data?.module === "quotationToSale") {
            dispatch(quotationStatus({ id: parshTracking_details?.module_data?.id, status: "4" }, null));//status shown pending in invoice
        }
    }

    // purchase order to bill show bill status
    if (section === "bills" && convert === "purchase_to_bill") {
        dispatch(purchasesStatus({ id: itemId, status: "4" }, null));//purchase order become billed status...
    }
    if (section === "grn" && convert === "purchase_to_grn") {
        dispatch(purchasesStatus({ id: itemId, status: "3" }, null));//purchase order become Transfer to grn status...
    }

    if (section === "grn" && convert === "grn_to_bill") {
        dispatch(purchasesStatus({ id: itemId, status: "3" }, null));//purchase order become Transfer to grn status...
    }
    if (section === "payment_rec" && convert === "toPayment") {
        dispatch(invoicesStatus({ id: itemId, status: "5" }, null));//paid status when convert invoice to payment receive...
    }
    if (section === "payment_made" && convert === "bill_to_payment") {
        dispatch(billStatus({ id: itemId, status: "5" }, null));//paid status when convert bill to payment made...
    }

};