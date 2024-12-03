import { purchasesStatus } from "../../../Redux/Actions/purchasesActions";

export const purchasesOrderStatus = (tracking_details, dispatch) => {

    // console.log("tracking_details of purchse when approved in grn", tracking_details)

    if (tracking_details?.module === "purchase_to_grn") {
        dispatch(purchasesStatus({ id: tracking_details?.id, status: "4" }, null));
    }

};


