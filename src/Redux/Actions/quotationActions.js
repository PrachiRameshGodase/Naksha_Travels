import toast from 'react-hot-toast';
import axiosInstance from '../../Configs/axiosInstance';
import {
    QUOTATION_DETAIL_REQUEST,
    QUOTATION_DETAIL_SUCCESS,
    QUOTATION_DETAIL_ERROR,

    QUOTATION_UPDATE_REQUEST,
    QUOTATION_UPDATE_SUCCESS,
    QUOTATION_UPDATE_ERROR,

    QUOTATION_STATUS_REQUEST,
    QUOTATION_STATUS_SUCCESS,
    QUOTATION_STATUS_ERROR,

    QUOTATION_DELETE_REQUEST,
    QUOTATION_DELETE_SUCCESS,
    QUOTATION_DELETE_ERROR,

    QUOTATION_SEND_REQUEST,
    QUOTATION_SEND_SUCCESS,
    QUOTATION_SEND_ERROR,
} from "../Constants/quotationConstants";

import Swal from 'sweetalert2';
import { handleQuotationNavigation } from '../../Views/Helper/ReduxHelperFunctions/quotationsHelper';
import { handleSaleOrderNavigation } from '../../Views/Helper/ReduxHelperFunctions/salesOrdersHelper';
import { convertStatus } from '../../Views/Helper/ReduxHelperFunctions/convertStatus';
import { invoiceHelper } from '../../Views/Helper/ReduxHelperFunctions/invoiceHelper';
import { autoGenerateIdFunction } from '../../Views/Helper/ReduxHelperFunctions/autoGenerateIdFunction';
import { parseJSONofString } from '../../Views/Helper/HelperFunctions';

export const quotationDetails = (queryParams, setDetail_api_data) => async (dispatch) => {
    try {
        dispatch({ type: QUOTATION_DETAIL_REQUEST });

        const { data } = await axiosInstance.post(
            '/quotations/details',
            queryParams
        );

        if (data?.quotation && setDetail_api_data) {
            setDetail_api_data(data?.quotation)
        }

        dispatch({
            type: QUOTATION_DETAIL_SUCCESS,
            payload: {
                data
            },
        });

    } catch (error) {
        dispatch({ type: QUOTATION_DETAIL_ERROR, payload: error.message });
    }
};

export const updateQuotation = (quotationData, navigate, section, editDub, buttonName, showAllSequenceId, itemId, convert) => async (dispatch) => {

    dispatch({ type: QUOTATION_UPDATE_REQUEST });
    try {
        const response = await axiosInstance.post(`/sales/create/update`, quotationData);

        dispatch({ type: QUOTATION_UPDATE_SUCCESS, payload: response.data });

        if (response?.data?.message === "Transaction Created Successfully") {

            convertStatus(dispatch, section, navigate, itemId, convert, response, quotationData);

            let confirmed = null;
            if (buttonName === "saveAndSend" && confirmed === null) {
                const result = await Swal.fire({
                    text: `Do you want to send the copy of the ${section} via email?`,
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    customClass: {
                        popup: 'swal-wide', // Add a custom class to the popup
                    },
                });
                confirmed = result.isConfirmed;
            }

            // autoGenerateIdFunction(dispatch, editDub, itemId, showAllSequenceId)

            if (section === "quotation") {
                handleQuotationNavigation(editDub, buttonName, confirmed, navigate, response);
            } else if (section === "sale-order") {
                handleSaleOrderNavigation(editDub, buttonName, confirmed, navigate, response)
            } else if (section === "invoices" || section === "delivery_challan") {
                invoiceHelper(editDub, buttonName, navigate, section);
            }

        } else {
            toast.error(response?.data?.message);
        }
    } catch (error) {
        dispatch({ type: QUOTATION_UPDATE_ERROR, payload: error.message });
        toast.error(error.message);
    }
};





export const updateCreditNote = (quotationData, Navigate, val) => async (dispatch) => {
    // console.log("quotationData", quotationData)
    try {
        dispatch({ type: QUOTATION_UPDATE_REQUEST });

        const { data } = await axiosInstance.post(
            `/credit-debit/create/update`,
            quotationData
        );

        dispatch({
            type: QUOTATION_UPDATE_SUCCESS,
            payload: {
                data
            },
        });


        if (data?.message === "Transaction Created Successfully") {
            toast.success(data?.message);
            if (val === "debit_note") {
                Navigate('/dashboard/debit-notes');
            } else {
                Navigate('/dashboard/credit-notes');
            }
        } else {
            toast.error(data?.message);
        }

    } catch (error) {
        dispatch({ type: QUOTATION_UPDATE_ERROR, payload: error.message });
    }
};



export const quotationStatus = (quotationData, setCallApi) => async (dispatch) => {
    try {
        dispatch({ type: QUOTATION_STATUS_REQUEST });

        const { data } = await axiosInstance.post(
            `/quotation/status`,
            quotationData
        );

        dispatch({
            type: QUOTATION_STATUS_SUCCESS,
            payload: {
                data
            },
        });

        if (setCallApi) {
            if (data?.message === "Quotation Declined Updated Successfully") {
                setCallApi((prev) => prev + 1);
                toast.success(data?.message);
            } else if (data?.message === "Quotation Approved Updated Successfully") {
                setCallApi((prev) => prev + 1);
                toast.success(data?.message);
            }
            else if (data?.message === "Quotation  Updated Successfully") {
                setCallApi((prev) => prev + 1);
                toast.success(data?.message);
            } else {
                toast.error(data?.message);
            }

        }

    } catch (error) {
        dispatch({ type: QUOTATION_STATUS_ERROR, payload: error.message });
    }
};

export const quotationDelete = (quotationData, Navigate) => async (dispatch) => {
    // console.log("quotationData", quotationData)
    try {
        dispatch({ type: QUOTATION_DELETE_REQUEST });

        const { data } = await axiosInstance.post(
            `/quotation/delete`,
            quotationData
        );

        dispatch({
            type: QUOTATION_DELETE_SUCCESS,
            payload: {
                data
            },
        });


        if (data?.message === "Quotation is Approved. You can't delete this quotation.") {
            toast.error(data?.message);
        } else if (data?.message === "Quotation Deleted Successfully") {
            toast.success(data?.message);
            Navigate('/dashboard/quotation');
        }

    } catch (error) {
        dispatch({ type: QUOTATION_DELETE_ERROR, payload: error.message });
    }
};

export const quotationSend = (quotationData, Navigate) => async (dispatch) => {
    try {
        dispatch({ type: QUOTATION_SEND_REQUEST });

        const { data } = await axiosInstance.post(
            `/quotation/send`,
            quotationData
        );


        dispatch({
            type: QUOTATION_SEND_SUCCESS,
            payload: {
                data
            },
        });

        // console.log("quotaion send data", quotationData)

        if (data?.message === "Quotation sent Successfully") {

            const sendData = {
                id: quotationData?.id,
                status: 6,
            };
            await dispatch(quotationStatus(sendData, ""));
            toast.success(data?.message);
            Navigate('/dashboard/quotation');
        } else {
            toast.error(data?.message)
        }

    } catch (error) {
        dispatch({ type: QUOTATION_SEND_ERROR, payload: error.message });
    }
};


