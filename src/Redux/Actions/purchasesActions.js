import toast from 'react-hot-toast';
import axiosInstance from '../../Configs/axiosInstance';
import {
    PURCHASES_CREATE_REQUEST,
    PURCHASES_CREATE_SUCCESS,
    PURCHASES_CREATE_ERROR,

    PURCHASES_DETAIL_REQUEST,
    PURCHASES_DETAIL_SUCCESS,
    PURCHASES_DETAIL_ERROR,

    PURCHASES_DELETE_REQUEST,
    PURCHASES_DELETE_SUCCESS,
    PURCHASES_DELETE_ERROR,

    PURCHASES_SEND_REQUEST,
    PURCHASES_SEND_SUCCESS,
    PURCHASES_SEND_ERROR,

    PURCHASES_STATUS_REQUEST,
    PURCHASES_STATUS_SUCCESS,
    PURCHASES_STATUS_ERROR,
} from '../Constants/purchasesConstants.js';
import SendMail from '../../Components/SendMail/SendMail.jsx';
import Swal from 'sweetalert2';
import { billStatus } from './billActions.js';
import { GRNstatusActions } from './grnActions.js';
import { autoGenerateIdFunction } from '../../Views/Helper/ReduxHelperFunctions/autoGenerateIdFunction.js';
import { Nav } from 'react-bootstrap';
import { handlePurchaseOrderNavigation } from '../../Views/Helper/ReduxHelperFunctions/purchasesNavigation.js';
import { handleBillsNavigation } from '../../Views/Helper/ReduxHelperFunctions/billsNavigation.js';
import { convertStatus } from '../../Views/Helper/ReduxHelperFunctions/convertStatus.js';

export const createPurchases = (queryParams, Navigate, section, editDub, buttonName, showAllSequenceId, itemId, convert) => async (dispatch) => {

    // console.log("section, editDub, buttonName, showAllSequenceId", section, editDub, buttonName, showAllSequenceId, convert)

    dispatch({ type: PURCHASES_CREATE_REQUEST });

    try {
        const response = await axiosInstance.post(`/purchase/create/update`, queryParams);

        dispatch({ type: PURCHASES_CREATE_SUCCESS, payload: response.data });

        if (response?.data?.message === "Transaction Created Successfully") {

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

            // autoGenerateIdFunction(dispatch, editDub, itemId, showAllSequenceId);
            convertStatus(dispatch, section, Navigate, itemId, convert, response, queryParams);


            if (section === "purchase order") {
                handlePurchaseOrderNavigation(editDub, buttonName, confirmed, Navigate, response);
            } else if (section === "bills") {
                handleBillsNavigation(editDub, buttonName, confirmed, Navigate, response, convert);
            }

            // bill in convert

            if (section === "bills" && buttonName === "saveAsDraft" && !editDub && convert) {
                const sendData = {
                    id: itemId,
                    status: 2
                };
                await dispatch(purchasesStatus(sendData, ""));
                toast.success("Convert As Draft");
                Navigate(`/dashboard/bills`);
            } else if (section === "bills" && buttonName === "saveAndOpen" && !editDub && convert) {
                const sendBillData = {
                    id: response?.data?.transaction?.id,
                    status: 1
                }
                await dispatch(billStatus(sendBillData, ""));
                const sendPurchaseData = {
                    id: itemId,
                    status: 2
                };
                if (convert === "grn_to_bill") {
                    await dispatch(GRNstatusActions(sendPurchaseData));
                } else {
                    await dispatch(purchasesStatus(sendPurchaseData, ""));
                }
                toast.success("Convert As Open");
                Navigate(`/dashboard/bill-details?id=${sendBillData?.id}`);

            }
            // toast.success("Purchase Order Convert Successfully")
        } else {
            toast.error(response?.data?.message);
        }

    } catch (error) {
        dispatch({ type: PURCHASES_CREATE_ERROR, payload: error.message });
        toast.error(error.message);
    }
};

export const purchasesStatus = (queryParams, setCallApi) => async (dispatch) => {


    try {
        dispatch({ type: PURCHASES_STATUS_REQUEST });
        const response = await axiosInstance.post(`/purchase-order/status`, queryParams);

        if (setCallApi) {
            if (response?.data?.message === "Purchase Order Declined Updated Successfully") {
                toast.success(response?.data?.message);

            } else if (response?.data?.message === "Purchase Order Approved Updated Successfully") {
                toast.success(response?.data?.message);

            }
            else {
                toast.error(response?.data?.message);
            }
        }
        dispatch({ type: PURCHASES_STATUS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: PURCHASES_STATUS_ERROR, payload: error.message });
        toast.error(error?.message);
    }
};




export const purchasesDetails = (queryParams, setDetail_api_data) => async (dispatch) => {
    // console.log("queryParams", queryParams)
    dispatch({ type: PURCHASES_DETAIL_REQUEST });
    try {
        const response = await axiosInstance.post(`/purchase-order/details`,
            queryParams
        );

        dispatch({ type: PURCHASES_DETAIL_SUCCESS, payload: response.data });

        if (response?.data?.purchaseOrder) {
            setDetail_api_data(response?.data?.purchaseOrder)
        }

    } catch (error) {
        dispatch({ type: PURCHASES_DETAIL_ERROR, payload: error.message });
    }
};


export const purchasesDelete = (queryParams, Navigate) => async (dispatch) => {
    // console.log("queryParams", queryParams)
    dispatch({ type: PURCHASES_DELETE_REQUEST });
    try {
        const response = await axiosInstance.post(`/purchase-order/delete`,
            queryParams
        );

        dispatch({ type: PURCHASES_DELETE_SUCCESS, payload: response.data });

        if (response?.data?.message === "Purchase Order deleted Successfully") {
            toast.success(response?.data?.message);
            Navigate("/dashboard/purchase")

        } else {
            toast.error(response?.data?.message)
        }

    } catch (error) {
        dispatch({ type: PURCHASES_DELETE_ERROR, payload: error.message });
        toast.error(error?.message)
    }
};


export const purchasesSendMail = (queryParams, Navigate) => async (dispatch) => {
    dispatch({ type: PURCHASES_SEND_REQUEST });
    try {
        const response = await axiosInstance.post(`/purchase-order/send`,
            queryParams
        );

        dispatch({ type: PURCHASES_SEND_SUCCESS, payload: response.data });

        if (response?.data?.message === "Purchase Order sent Successfully") {
            const sendData = {
                id: queryParams?.id,
                status: 6,
            };
            await dispatch(purchasesStatus(sendData, ""));
            toast.success(response?.data?.message)
            Navigate('/dashboard/purchase');
        } else {
            toast.error(response?.data?.message)
        }
        // console.log("response", response);
    } catch (error) {
        dispatch({ type: PURCHASES_SEND_ERROR, payload: error.message });
        toast.error(error?.message)
    }
};

