import toast from 'react-hot-toast';
import axiosInstance from '../../Configs/axiosInstance';
import {
    PAYMENT_CREATE_REQUEST,
    PAYMENT_CREATE_SUCCESS,
    PAYMENT_CREATE_ERROR,

    PAYMENT_DETAIL_REQUEST,
    PAYMENT_DETAIL_SUCCESS,
    PAYMENT_DETAIL_ERROR,

    PAYMENT_DELETE_REQUEST,
    PAYMENT_DELETE_SUCCESS,
    PAYMENT_DELETE_ERROR,

    PAYMENT_STATUS_REQUEST,
    PAYMENT_STATUS_SUCCESS,
    PAYMENT_STATUS_ERROR,

    FETCH_PAYMENT_REC_LIST_DATA_REQUEST,
    FETCH_PAYMENT_REC_LIST_DATA_SUCCESS,
    FETCH_PAYMENT_REC_LIST_DATA_FAILURE,


    PAYMENT_REC_SEND_REQUEST,
    PAYMENT_REC_SEND_SUCCESS,
    PAYMENT_REC_SEND_ERROR,

} from '../Constants/paymentConstatnt';
import Swal from 'sweetalert2';
import { autoGenerateIdFunction } from '../../Views/Helper/ReduxHelperFunctions/autoGenerateIdFunction';
// import { paymentMadeHelper } from '../../Views/Helper/ReduxHelperFunctions/invoiceHelper';
import { convertStatus } from '../../Views/Helper/ReduxHelperFunctions/convertStatus';
import { paymentMadeNavigation, paymentReceiveNavigation } from '../../Views/Helper/ReduxHelperFunctions/paymentNavigation';
import { handleSaleOrderNavigation } from '../../Views/Helper/ReduxHelperFunctions/salesOrdersHelper';


export const updatePaymentRec = (quotationData, navigate, section, editDub, buttonName, itemId, convert, showAllSequenceId) => async (dispatch) => {

    console.log("section", section)
    try {
        dispatch({ type: PAYMENT_CREATE_REQUEST });

        const { data } = await axiosInstance.post(
            `/payment/create/update`,
            quotationData
        );

        dispatch({
            type: PAYMENT_CREATE_SUCCESS,
            payload: {
                data
            },
        });


        if (data?.message === "Payment has been added.") {
            // autoGenerateIdFunction(dispatch, editDub, "", showAllSequenceId);
            convertStatus(dispatch, section, navigate, itemId, convert, data, quotationData);

            if (section === "payment_made") {
                paymentMadeNavigation(editDub, navigate);
            }
            else if (section === "payment_rec") {
                paymentReceiveNavigation(editDub, navigate);
            }
        } else {
            // toast.error(data?.message);
        }


    } catch (error) {
        dispatch({ type: PAYMENT_CREATE_ERROR, payload: error.message });
    }
};


export const paymentRecList = (quotationData, setAllListValue) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_PAYMENT_REC_LIST_DATA_REQUEST });

        const { data } = await axiosInstance.post(
            `/payments/list`,
            quotationData
        );

        if (setAllListValue) {
            setAllListValue(data);
        }

        dispatch({
            type: FETCH_PAYMENT_REC_LIST_DATA_SUCCESS,
            payload: {
                data
            },
        });

    } catch (error) {
        dispatch({ type: FETCH_PAYMENT_REC_LIST_DATA_FAILURE, payload: error.message });
    }
};


export const paymentRecDetail = (quotationData, Navigate) => async (dispatch) => {
    try {
        dispatch({ type: PAYMENT_DETAIL_REQUEST });

        const { data } = await axiosInstance.post(
            `/payments/details`,
            quotationData
        );

        // console.log("dataaaaaaaaa", data)

        dispatch({
            type: PAYMENT_DETAIL_SUCCESS,
            payload: {
                data
            },
        });


    } catch (error) {
        dispatch({ type: PAYMENT_DETAIL_ERROR, payload: error.message });
    }
};


export const paymentRecDelete = (quotationData, Navigate, val) => async (dispatch) => {
    try {
        dispatch({ type: PAYMENT_DELETE_REQUEST });

        const { data } = await axiosInstance.post(
            `/payments/delete`,
            quotationData
        );

        dispatch({
            type: PAYMENT_DELETE_SUCCESS,
            payload: {
                data
            },
        });

        if (data?.message === "Payment Deleted Successfully" && val) {
            toast.success(data?.message);
            Navigate(`/dashboard/${val}`);
        }
        else {
            toast.error(data?.message);
        }
    } catch (error) {
        dispatch({ type: PAYMENT_DELETE_ERROR, payload: error.message });
    }
};


export const paymentRecStatus = (quotationData, Navigate, setCallApi) => async (dispatch) => {
    try {
        dispatch({ type: PAYMENT_STATUS_REQUEST });

        const { data } = await axiosInstance.post(
            `/payments/status`,
            quotationData
        );
        // console.log("status", data?.message)
        if (setCallApi) {
            if (data?.message === "Sales Order Declined Updated Successfully") {
                toast.success(data?.message);
            } else if (data?.message === "Sales Order Approved Updated Successfully") {
                toast.success(data?.message);
            } else {
                toast.error(data?.message);
            }
        }

        dispatch({
            type: PAYMENT_STATUS_SUCCESS,
            payload: {
                data
            },
        });

        // toast.success("data from actions", data);

        setTimeout(() => {
            Navigate('/dashboard/payment-recieved');
        }, 500);
    } catch (error) {
        dispatch({ type: PAYMENT_STATUS_ERROR, payload: error.message });
    }
};

export const paymentRecSend = (quotationData, Navigate) => async (dispatch) => {
    try {
        dispatch({ type: PAYMENT_REC_SEND_REQUEST });

        const { data } = await axiosInstance.post(
            `/payment-recieved/send`,
            quotationData
        );


        dispatch({
            type: PAYMENT_REC_SEND_SUCCESS,
            payload: {
                data
            },
        });

        // console.log("quotaion send data", quotationData)

        if (data?.message === "PaymentRec sent Successfully") {

            const sendData = {
                id: quotationData?.id,
                status: 6,
            };
            await dispatch(paymentRecStatus(sendData, ""));
            toast.success(data?.message);
            Navigate('/dashboard/payment-recieved');
        } else {
            toast.error(data?.message)
        }

    } catch (error) {
        dispatch({ type: PAYMENT_REC_SEND_ERROR, payload: error.message });
    }
};
