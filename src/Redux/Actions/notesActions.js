import toast from 'react-hot-toast';
import axiosInstance from '../../Configs/axiosInstance';
import {
    CREDIT_NOTE_DETAIL_REQUEST,
    CREDIT_NOTE_DETAIL_SUCCESS,
    CREDIT_NOTE_DETAIL_ERROR,

    CREDIT_NOTE_DELETE_REQUEST,
    CREDIT_NOTE_DELETE_SUCCESS,
    CREDIT_NOTE_DELETE_ERROR,

    DEBIT_DETAILS_REQUEST,
    DEBIT_DETAILS_SUCCESS,
    DEBIT_DETAILS_ERROR,

    DEBIT_NOTE_DELETE_REQUEST,
    DEBIT_NOTE_DELETE_SUCCESS,
    DEBIT_NOTE_DELETE_ERROR,

    DEBIT_STATUS_REQUEST,
    DEBIT_STATUS_SUCCESS,
    DEBIT_STATUS_ERROR,

    CREDIT_NOTE_STATUS_REQUEST,
    CREDIT_NOTE_STATUS_SUCCESS,
    CREDIT_NOTE_STATUS_ERROR,

    CREDIT_NOTE_SEND_REQUEST,
    CREDIT_NOTE_SEND_SUCCESS,
    CREDIT_NOTE_SEND_ERROR,

    CREATE_CREDIT_NOTES_REQUEST,
    CREATE_CREDIT_NOTES_SUCCESS,
    CREATE_CREDIT_NOTES_ERROR,
} from "../Constants/noteConstants";
import { creditNoteHelper } from '../../Views/Helper/ReduxHelperFunctions/creditNoteHelper';
import Swal from 'sweetalert2';
import { autoGenerateIdFunction } from '../../Views/Helper/ReduxHelperFunctions/autoGenerateIdFunction';
import { debitNoteHelper } from '../../Views/Helper/ReduxHelperFunctions/debitNoteHelper';

export const createCreditNotes = (quotationData, navigate, section, editDub, buttonName, showAllSequenceId, itemId, convert) => async (dispatch) => {

    // console.log("autoGenerateIdFunction", editDub, itemId);
    // console.log("showAllSequenceId", showAllSequenceId);

    dispatch({ type: CREATE_CREDIT_NOTES_REQUEST });
    try {
        const response = await axiosInstance.post(`/credit-debit/create/update`, quotationData);

        dispatch({ type: CREATE_CREDIT_NOTES_SUCCESS, payload: response.data });

        if (response?.data?.message === "Transaction Created Successfully") {

            let confirmed = null;
            if (buttonName === "saveAndSend" && confirmed === null) {
                const result = await Swal.fire({
                    text: 'Do you want to send this Credit Notes via Email?',
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

            if (section === "credit") {
                creditNoteHelper(editDub, buttonName, confirmed, navigate, response);
            }
            if (section === "debit_note") {
                debitNoteHelper(editDub, buttonName, confirmed, navigate, response);
            }





        }


    } catch (error) {
        dispatch({ type: CREATE_CREDIT_NOTES_ERROR, payload: error.message });
        toast.error(error.message);
    }
};

export const CreditNotesStatus = (quotationData) => async (dispatch) => {
    try {
        dispatch({ type: CREDIT_NOTE_STATUS_REQUEST });

        const response = await axiosInstance.post(`/credit-note/status`,
            quotationData,
        );

        dispatch({
            type: CREDIT_NOTE_STATUS_SUCCESS,
            payload: (response?.data?.message)
        });

    } catch (error) {
        dispatch({ type: CREDIT_NOTE_STATUS_ERROR, payload: error.message });
    }
};

export const creditNotesDetails = (queryParams, setDetail_api_data) => async (dispatch) => {
    try {

        dispatch({ type: CREDIT_NOTE_DETAIL_REQUEST });

        const { data } = await axiosInstance.post(`/credit-note/details`,
            queryParams,
        );

        if (setDetail_api_data) {
            setDetail_api_data(data?.CreditNote)
        }
        dispatch({
            type: CREDIT_NOTE_DETAIL_SUCCESS,
            payload: {
                data
            },
        });

    } catch (error) {
        dispatch({ type: CREDIT_NOTE_DETAIL_ERROR, payload: error.message });
    }
};

export const creditNotesDelete = (queryParams, Navigate) => async (dispatch) => {
    try {

        dispatch({ type: CREDIT_NOTE_DELETE_REQUEST });

        const { data } = await axiosInstance.post(`/credit-note/delete`,
            queryParams,
        );
        if (data?.message === "Credit Note deleted Successfully") {
            toast.success(data?.message);
            Navigate("/dashboard/credit-notes");
        } else {
            toast.error(data?.message);
        }
        dispatch({
            type: CREDIT_NOTE_DELETE_SUCCESS,
            payload: {
                data
            },
        });


    } catch (error) {
        dispatch({ type: CREDIT_NOTE_DELETE_ERROR, payload: error.message });
    }
};

export const debitNotesDelete = (queryParams, Navigate) => async (dispatch) => {
    try {

        dispatch({ type: DEBIT_NOTE_DELETE_REQUEST });

        const { data } = await axiosInstance.post(`/debit-note/delete`,
            queryParams,
        );
        if (data?.message === "Debit Note deleted Successfully") {
            toast.success(data?.message);
            Navigate("/dashboard/debit-notes");
        } else {
            toast.error(data?.message);
        }
        dispatch({
            type: DEBIT_NOTE_DELETE_SUCCESS,
            payload: {
                data
            },
        });


    } catch (error) {
        dispatch({ type: DEBIT_NOTE_DELETE_ERROR, payload: error.message });
    }
};

export const debitNotesDetails = (queryParams, Navigate) => async (dispatch) => {
    try {

        dispatch({ type: DEBIT_DETAILS_REQUEST });

        const { data } = await axiosInstance.post(`/debit-note/details`,
            queryParams,
        );

        dispatch({
            type: DEBIT_DETAILS_SUCCESS,
            payload: {
                data
            },
        });


        // console.log("delete from actions", data);
    } catch (error) {
        dispatch({ type: DEBIT_DETAILS_ERROR, payload: error.message });
    }
};

export const debitNotesStatus = (queryParams, setCallApi) => async (dispatch) => {
    try {

        dispatch({ type: DEBIT_STATUS_REQUEST });



        const { data } = await axiosInstance.post(`/debit-note/status`,
            queryParams,
        );

        if (setCallApi) {
            if (data?.message === "Debit Note Approved Updated Successfully") {
                toast.success(data?.message);
                setCallApi((preState) => !preState);
            } else {
                toast.error(data?.message);
            }
        }

        dispatch({
            type: DEBIT_STATUS_SUCCESS,
            payload: {
                data
            },
        });


        // console.log("delete from actions", data);
    } catch (error) {
        dispatch({ type: DEBIT_STATUS_ERROR, payload: error.message });
    }
};

export const creditnoteSend = (quotationData, Navigate) => async (dispatch) => {
    try {
        dispatch({ type: CREDIT_NOTE_SEND_REQUEST });

        const { data } = await axiosInstance.post(
            `/credit_notes/send`,
            quotationData
        );


        dispatch({
            type: CREDIT_NOTE_SEND_SUCCESS,
            payload: {
                data
            },
        });

        // console.log("quotaion send data", quotationData)

        if (data?.message === "Credit Note sent Successfully") {
            const sendData = {
                id: quotationData?.id,
                status: 6,
            };
            await dispatch(CreditNotesStatus(sendData));
            toast.success(data?.message);
            // Navigate('/dashboard/credit-notes');
        } else {
            toast.error(data?.message)
        }

    } catch (error) {
        dispatch({ type: CREDIT_NOTE_SEND_ERROR, payload: error.message });
    }
};