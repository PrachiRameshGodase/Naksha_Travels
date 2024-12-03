import toast from "react-hot-toast";

export const handlePurchaseOrderNavigation = (editDub, buttonName, confirmed, navigate, response) => {

    // Purchase Order in create
    if (!editDub) {
        if (buttonName === "saveAndSend" && confirmed === true) {
            const queryParams = new URLSearchParams();
            queryParams.set("purchase_send", true);
            navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data } });
        } else if (buttonName === "saveAndSend" && confirmed === false) {
            toast.success("Purchase Order Saved As Draft");
            navigate(`/dashboard/purchase`);
        } else if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/purchase`);
            toast.success("Purchase Order Saved As Draft");
        }

        // Purchase Order in update
    } else if (editDub) {
        if (buttonName === "saveAndSend" && confirmed === true) {
            const queryParams = new URLSearchParams();
            queryParams.set("purchase_send", true);
            navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data?.transaction } });
        } else if (buttonName === "saveAndSend" && confirmed === false) {
            toast.success("Purchase Order Updated Successfully");
            navigate(`/dashboard/purchase`);
        } else if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/purchase`);
            toast.success("Purchase Order Updated Successfully");
        }
    }

};