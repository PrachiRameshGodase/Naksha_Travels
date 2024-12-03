import toast from "react-hot-toast";

export const invoiceHelper = (editDub, buttonName, navigate, section) => {

    // Sales Orders in create
    if (!editDub) {
        if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/${section}`);
            toast.success(`${section === "delivery_challan" ? "Delivery Challan" : "Invoice"} Saved As Draft`);
        }

    } else if (editDub) {
        if (buttonName === "saveAsDraft") {
            navigate(`/dashboard/${section}`);
            toast.success(`${section === "delivery_challan" ? "Delivery Challan" : "Invoice"} Updated Successfully`);
        }
    }

};


