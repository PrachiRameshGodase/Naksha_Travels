import toast from 'react-hot-toast';
import axiosInstance from '../../Configs/axiosInstance';
import {
    CREATE_GRN_REQUEST,
    CREATE_GRN_SUCCESS,
    CREATE_GRN_ERROR,

    GET_GRN_REQUEST,
    GET_GRN_SUCCESS,
    GET_GRN_ERROR,

    GRN_DETAILS_REQUEST,
    GRN_DETAIL_SUCCESS,
    GRN_DETAILS_ERROR,

    GET_GRN_RECEIPT_LIST__REQUEST,
    GET_GRN_RECEIPT_LIST__SUCCESS,
    GET_GRN_RECEIPT_LIST__ERROR,

    GET_GRN_RECEIPT_DETAIL__REQUEST,
    GET_GRN_RECEIPT_DETAIL__SUCCESS,
    GET_GRN_RECEIPT_DETAIL__ERROR,

    GRN_STATUS_REQUEST,
    GRN_STATUS_SUCCESS,
    GRN_STATUS_ERROR,


    GRN_DELETE_REQUEST,
    GRN_DELETE_SUCCESS,
    GRN_DELETE_ERROR,

    MOVE_ITEM_LIST__REQUEST,
    MOVE_ITEM_LIST__SUCCESS,
    MOVE_ITEM_LIST__ERROR,
} from '../Constants/grnConstants.js';
import { createPurchases, purchasesStatus } from './purchasesActions.js';
import { handleGrnNavigation } from '../../Views/Helper/ReduxHelperFunctions/grnNavigation.js';
import { autoGenerateIdFunction } from '../../Views/Helper/ReduxHelperFunctions/autoGenerateIdFunction.js';
import { convertStatus } from '../../Views/Helper/ReduxHelperFunctions/convertStatus.js';
import { purchasesOrderStatus } from '../../Views/Helper/ReduxHelperFunctions/purchasesStatus.js';
import { Navigate } from 'react-router-dom';

export const GRNcreateActions = (queryParams, Navigate, editDub, buttonName, itemId, convert, showAllSequenceId) => async (dispatch) => {
    dispatch({ type: CREATE_GRN_REQUEST });

    try {
        const response = await axiosInstance.post(`/grn/create/update`, queryParams);
        dispatch({ type: CREATE_GRN_SUCCESS, payload: response.data });


        if (response?.data?.message === "Transaction Created Successfully") {
            convertStatus(dispatch, "grn", Navigate, itemId, convert, response, queryParams);
            // autoGenerateIdFunction(dispatch, editDub, itemId, showAllSequenceId);
            handleGrnNavigation(dispatch, editDub, buttonName, Navigate, response);
        }
        else {
            toast.error(response?.data?.message);
        }

    } catch (error) {
        dispatch({ type: CREATE_GRN_ERROR, payload: error.message });
        toast.error(error?.message);
    }
};


export const GRNlistActions = (queryParams, setAllListValue) => async (dispatch) => {
    dispatch({ type: GET_GRN_REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/list`, queryParams);

        dispatch({ type: GET_GRN_SUCCESS, payload: response.data });
        if (setAllListValue) {
            setAllListValue(response?.data)
        }

    } catch (error) {
        dispatch({ type: GET_GRN_ERROR, payload: error.message });
        toast.error(error?.message);
    }
};

export const GRNdetailsActions = (queryParams) => async (dispatch) => {
    dispatch({ type: GRN_DETAILS_REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/details`, queryParams);


        dispatch({ type: GRN_DETAIL_SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: GRN_DETAILS_ERROR, payload: error.message });
        toast.error(error?.message);
    }
};


export const GRNstatusActions = (queryParams, setCallApi, billData, autoId, tracking_details, Navigate) => async (dispatch) => {
    dispatch({ type: GRN_STATUS_REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/status`, queryParams);

        if (response?.data?.message === "GRN Declined Updated Successfully") {
            toast.success(response?.data?.message);
            setCallApi((preState) => !preState);

        } else if (response?.data?.message === "GRN Approved Updated Successfully") {

            //for generate auto id when we convert grn to bill
            const extractedData = {
                prefix: autoId.prefix,
                delimiter: autoId.delimiter,
                sequence_number: (+autoId.sequence_number + 1),
                sequence_type: autoId.sequence_type,
                module: autoId.module,
                notes: autoId.notes,
                id: autoId?.id
            };

            //when grn approved the purchase order(tracking_details) status convert into billed 
            if (tracking_details?.module === "purchase_to_grn") {
                purchasesOrderStatus(tracking_details, dispatch);
            }

            // for create a copy of grn in bill when grn is approved successfully
            if (billData) {
                await dispatch(createPurchases(billData, null, null, null, null, extractedData, billData?.id, "grn_to_bill"));
            }

            toast.success(response?.data?.message);
            setCallApi((preState) => !preState);
            Navigate("/dashboard/grn_approval");
        }
        dispatch({ type: GRN_STATUS_SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: GRN_STATUS_ERROR, payload: error.message });
        toast.error(error?.message);
    }
};

export const GRNdeleteActions = (queryParams, Navigate) => async (dispatch) => {
    dispatch({ type: GRN_DELETE_REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/delete`, queryParams);

        if (response?.data?.message === "GRN deleted Successfully") {
            toast.success(response?.data?.message);
            Navigate("/dashboard/grn");
        } else {
            toast.error(response?.data?.message);
        }
        dispatch({ type: GRN_DELETE_SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: GRN_DELETE_ERROR, payload: error.message });
        toast.error(error?.message);
    }
};


export const GRNreceiptListActions = (queryParams) => async (dispatch) => {
    dispatch({ type: GET_GRN_RECEIPT_LIST__REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/receipt/list`, queryParams);

        dispatch({ type: GET_GRN_RECEIPT_LIST__SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: GET_GRN_RECEIPT_LIST__ERROR, payload: error.message });
        toast.error(error?.message);
    }
};


export const GRNreceipDetailsActions = (queryParams) => async (dispatch) => {
    dispatch({ type: GET_GRN_RECEIPT_DETAIL__REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/receipt/details`, queryParams);

        dispatch({ type: GET_GRN_RECEIPT_DETAIL__SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: GET_GRN_RECEIPT_DETAIL__ERROR, payload: error.message });
        toast.error(error?.message);
    }
};


export const GRNreceiptMoveItemActions = (queryParams, setMoveItem, Navigate) => async (dispatch) => {
    dispatch({ type: MOVE_ITEM_LIST__REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/receipt/stock/adjust`, queryParams);

        if (response?.data?.message === "GRN Item Moved Successfully") {
            toast?.success(response?.data?.message);
            setMoveItem(false)
            Navigate("/dashboard/grn_receipt");
        } else {
            toast?.error(response?.data?.message);
        }

        dispatch({ type: MOVE_ITEM_LIST__SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: MOVE_ITEM_LIST__ERROR, payload: error.message });
        toast.error(error?.message);
    }
};

