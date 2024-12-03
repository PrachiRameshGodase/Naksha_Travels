import toast from "react-hot-toast";

export const paymentMadeNavigation = (editDub, navigate) => {

    if (!editDub) {
        navigate(`/dashboard/payment-made`);
        toast.success(`Payment Made Created Successfully `);


    } else if (editDub) {
        navigate(`/dashboard/payment-made`);
        toast.success(`Payment Made Updated Successfully`);

    }

};
export const paymentReceiveNavigation = (editDub, navigate) => {
    if (!editDub) {
        navigate(`/dashboard/payment-recieved`);
        toast.success(`Payment Receive Created Successfully`);


    } else if (editDub) {
        navigate(`/dashboard/payment-recieved`);
        toast.success(`Payment Receive Updated Successfully`);

    }

};