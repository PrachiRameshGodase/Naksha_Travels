import { autoGenerateId } from "../../../Redux/Actions/globalActions";

export const autoGenerateIdFunction = async (dispatch, editDub, itemId, showAllSequenceId) => {
    if (!editDub && !itemId) {
        await dispatch(autoGenerateId(showAllSequenceId));
    }
}