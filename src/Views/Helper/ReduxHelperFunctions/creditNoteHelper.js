import toast from "react-hot-toast";


// Separate function to handle the conditions

export const creditNoteHelper = (editDub, buttonName, confirmed, navigate, response) => {
    // console.log('editDub', editDub, buttonName, confirmed, navigate, response)

    // Credit Note in create
    if (!editDub) {
        if (buttonName === "saveAndSend" && confirmed === true) {
            const queryParams = new URLSearchParams();
            queryParams.set("credit_note_send", true);
            navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data?.data } });
        } else if (buttonName === "saveAndSend" && confirmed === false) {
            toast.success("Credit Note Saved As Draft");
            navigate(`/dashboard/credit-notes`);
        } else if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/credit-notes`);
            toast.success("Credit Note Saved As Draft");
        }

        // Credit Note in update
    } else if (editDub) {
        if (buttonName === "saveAndSend" && confirmed === true) {
            const queryParams = new URLSearchParams();
            queryParams.set("credit_note_send", true);
            navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data?.data } });
        } else if (buttonName === "saveAndSend" && confirmed === false) {
            toast.success("Credit Note Updated Successfully");
            navigate(`/dashboard/credit-notes`);
        } else if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/credit-notes`);
            toast.success("Credit Note Updated Successfully");
        }
    }

};



