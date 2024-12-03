import toast from "react-hot-toast";


// Separate function to handle the conditions

export const debitNoteHelper = (editDub, buttonName, confirmed, navigate, response) => {
    // console.log('editDub', editDub, buttonName, confirmed, navigate, response)

    // Debit Note in create
    if (!editDub) {
        if (buttonName === "saveAndSend" && confirmed === true) {
            const queryParams = new URLSearchParams();
            queryParams.set("debit_note_sent", true);
            navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data?.data } });
        } else if (buttonName === "saveAndSend" && confirmed === false) {
            toast.success("Debit Note Saved As Draft");
            navigate(`/dashboard/debit-notes`);
        } else if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/debit-notes`);
            toast.success(" Saved As Draft");
        }

        // Debit Note in update
    } else if (editDub) {
        if (buttonName === "saveAndSend" && confirmed === true) {
            const queryParams = new URLSearchParams();
            queryParams.set("credit_note_send", true);
            navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data?.data } });
        } else if (buttonName === "saveAndSend" && confirmed === false) {
            toast.success("Debit Note Updated Successfully");
            navigate(`/dashboard/debit-notes`);
        } else if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/debit-notes`);
            toast.success("Debit Note Updated Successfully");
        }
    }

};



