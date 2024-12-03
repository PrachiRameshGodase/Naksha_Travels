import toast from "react-hot-toast";

export const handleBillsNavigation = (editDub, buttonName, confirmed, navigate, response) => {

    // Bill in create
    if (!editDub) {
        if (buttonName === "saveAndSend" && confirmed === true) {
            const queryParams = new URLSearchParams();
            queryParams.set("bill_send", true);
            navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data?.transaction } });
        }
        else if (buttonName === "saveAndSend" && confirmed === false) {
            toast.success("Bill Saved As Draft");
            navigate(`/dashboard/bills`);
        }

        else if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/bills`);
            toast.success("Bill Saved As Draft");
        }

        // Bill in update
    } else if (editDub) {
        if (buttonName === "saveAndSend" && confirmed === true) {
            const queryParams = new URLSearchParams();
            queryParams.set("bill_send", true);
            navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data?.transaction } });
        } else if (buttonName === "saveAndSend" && confirmed === false) {
            toast.success("Bill Updated Successfully");
            navigate(`/dashboard/bills`);
        } else if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/bills`);
            toast.success("Bill Updated Successfully");
        }
    }

};