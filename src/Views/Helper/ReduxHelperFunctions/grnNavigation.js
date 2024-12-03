import toast from "react-hot-toast";
import { GRNstatusActions } from "../../../Redux/Actions/grnActions";

export const handleGrnNavigation = (dispatch, editDub, buttonName, navigate, response) => {

    // Purchase Order in create
    if (!editDub) {

        if (buttonName === "saveAsDraft") {
            const sendData = {
                status: 3,
                id: response?.data?.transaction?.id
            }
            dispatch(GRNstatusActions(sendData, null, null))//shown send for approval in grn list
            toast.success("GRN Send For Approval");
            navigate(`/dashboard/grn`);
        }

        // Purchase Order in update
    }
    //  else if (editDub) {
    //     if (buttonName === "saveAndSend" && confirmed === true) {
    //         const queryParams = new URLSearchParams();
    //         queryParams.set("purchase_send", true);
    //         navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data?.transaction } });
    //     } else if (buttonName === "saveAndSend" && confirmed === false) {
    //         toast.success("Purchase Order Updated Successfully");
    //         navigate(`/dashboard/purchase`);
    //     } else if (buttonName === "saveAsDraft") {
    //         navigate(`/dashboard/purchase`);
    //         toast.success("Purchase Order Updated Successfully");
    //     }
    // }

};