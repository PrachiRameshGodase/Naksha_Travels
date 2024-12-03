import toast from "react-hot-toast";
import { quotationStatus } from "../../../Redux/Actions/quotationActions";

export const handleSaleOrderNavigation = (editDub, buttonName, confirmed, navigate, response) => {
    // console.log('editDub, buttonName, confirmed, navigate, response', editDub, buttonName, confirmed, response)

    // Sales Orders in create
    if (!editDub) {
        if (buttonName === "saveAndSend" && confirmed === true) {
            const queryParams = new URLSearchParams();
            queryParams.set("sales_orders_send", true);
            navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data?.transaction } });
        } else if (buttonName === "saveAndSend" && confirmed === false) {
            toast.success("Sales Orders Saved As Draft");
            navigate(`/dashboard/sales-orders`);
        } else if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/sales-orders`);
            toast.success("Sales Orders Saved As Draft");
        }

        // Sales Orders in update
    } else if (editDub) {
        if (buttonName === "saveAndSend" && confirmed === true) {
            const queryParams = new URLSearchParams();
            queryParams.set("sales_orders_send", true);
            navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data?.transaction } });
        } else if (buttonName === "saveAndSend" && confirmed === false) {
            toast.success("Sales Orders Updated Successfully");
            navigate(`/dashboard/sales-orders`);
        } else if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/sales-orders`);
            toast.success("Sales Orders Updated Successfully");
        }
    }

};



