import toast from "react-hot-toast";

export const handleQuotationNavigation = (editDub, buttonName, confirmed, navigate, response) => {

    // quotation in create
    if (!editDub) {
        if (buttonName === "saveAndSend" && confirmed === true) {
            const queryParams = new URLSearchParams();
            queryParams.set("quotation_send", true);
            navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data?.transaction } });
        } else if (buttonName === "saveAndSend" && confirmed === false) {
            toast.success("Quotation Saved As Draft");
            navigate(`/dashboard/quotation`);
        } else if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/quotation`);
            toast.success("Quotation Saved As Draft");
        }

        // quotation in update
    } else if (editDub) {
        if (buttonName === "saveAndSend" && confirmed === true) {
            const queryParams = new URLSearchParams();
            queryParams.set("quotation_send", true);
            navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data?.transaction } });
        } else if (buttonName === "saveAndSend" && confirmed === false) {
            toast.success("Quotation Updated Successfully");
            navigate(`/dashboard/quotation`);
        } else if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/quotation`);
            toast.success("Quotation Updated Successfully");
        }
    }

};



