import toast from 'react-hot-toast';
import axiosInstance from '../../Configs/axiosInstance';
import {
    SALE_DETAIL_REQUEST,
    SALE_DETAIL_SUCCESS,
    SALE_DETAIL_ERROR,

    SALEORDER_STATUS_REQUEST,
    SALEORDER_STATUS_SUCCESS,
    SALEORDER_STATUS_ERROR,

    SALEORDER_DELETE_REQUEST,
    SALEORDER_DELETE_SUCCESS,
    SALEORDER_DELETE_ERROR,

    SALE_ORDER_SEND_REQUEST,
    SALE_ORDER_SEND_SUCCESS,
    SALE_ORDER_SEND_ERROR,

} from "../Constants/saleOrderConstants";

export const saleOrderDetails = (queryParams, setDetail_api_data) => async (dispatch) => {
    try {

        dispatch({ type: SALE_DETAIL_REQUEST });

        const { data } = await axiosInstance?.post(`/sales-order/details`,
            queryParams,
        );

        if (data?.salesOrder && setDetail_api_data) {
            setDetail_api_data(data?.salesOrder)
        }

        dispatch({
            type: SALE_DETAIL_SUCCESS,
            payload: {
                data
            },
        });

    } catch (error) {
        dispatch({ type: SALE_DETAIL_ERROR, payload: error.message });
    }
};



export const saleOrderStatus = (saleOrderData, setCallApi) => async (dispatch) => {
    try {
        dispatch({ type: SALEORDER_STATUS_REQUEST });

        const { data } = await axiosInstance.post(
            `/sales-order/status`,
            saleOrderData
        );

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
            type: SALEORDER_STATUS_SUCCESS,
            payload: {
                data
            },
        });

    } catch (error) {
        dispatch({ type: SALEORDER_STATUS_ERROR, payload: error.message });
    }
};

export const saleOrderDelete = (saleOrderData, Navigate) => async (dispatch) => {
    // console.log("saleOrderData", saleOrderData)
    try {
        dispatch({ type: SALEORDER_DELETE_REQUEST });

        const { data } = await axiosInstance.post(
            `/sales-order/delete`,
            saleOrderData
        );

        dispatch({
            type: SALEORDER_DELETE_SUCCESS,
            payload: {
                data
            },
        });

        if (data?.message === "Sale Order deleted Successfully") {
            toast.success(data?.message);
            Navigate('/dashboard/sales-orders');
        } else {
            toast.error(data?.message);
        }

    } catch (error) {
        dispatch({ type: SALEORDER_DELETE_ERROR, payload: error.message });
        toast.error("Something went wrong sale order not deleted");

    }
};

export const saleOrderSend = (queryParams, Navigate) => async (dispatch) => {
    try {
        dispatch({ type: SALE_ORDER_SEND_REQUEST });

        const { data } = await axiosInstance.post(
            `/sales-order/send`,
            queryParams
        );

        if (data?.message === "Sales Order sent Successfully") {
            const sendData = {
                id: queryParams?.id,
                status: 6,
            };
            await dispatch(saleOrderStatus(sendData, ""));
            toast.success(data?.message);
            Navigate('/dashboard/sales-orders');
        } else {
            toast.error(data?.message)
        }

        dispatch({
            type: SALE_ORDER_SEND_SUCCESS,
            payload: {
                data
            },
        });

    } catch (error) {
        dispatch({ type: SALE_ORDER_SEND_ERROR, payload: error.message });
        toast.error("Something went wrong.");

    }
};