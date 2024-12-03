
import { quotationStatus } from "../../../Redux/Actions/quotationActions";
import { saleOrderStatus } from "../../../Redux/Actions/saleOrderActions";

export const invoiceStatus = ({ tracking_details, dispatch }) => {

    if (tracking_details?.module === "quotationToInvoice") {
        dispatch(quotationStatus({ id: tracking_details?.id, status: "8" }, null));
    }


    if (tracking_details?.module === "saleToInvoice") {
        dispatch(saleOrderStatus({ id: tracking_details?.id, status: "8" }, null));
    }


    if (tracking_details?.module_data?.module === "quotationToSale") {
        dispatch(quotationStatus({ id: tracking_details?.module_data?.id, status: "8" }, null));
    }
};