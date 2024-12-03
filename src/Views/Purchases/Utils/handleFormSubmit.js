import { handleDropdownError } from "../../Helper/HelperFunctions";

export const handleFormSubmitCommon = async ({
    e,
    formData,
    isVendorSelect,
    dropdownRef1,
    isItemSelect,
    dropdownRef2,
    dispatch,
    createPurchases,
    Navigate,
    isEdit,
    showAllSequenceId,
    itemId,
    convert,
    type,
    additionalData = {}
}) => {
    e.preventDefault();
    const button = e.nativeEvent.submitter.name;

    if (handleDropdownError(isVendorSelect, dropdownRef1)) return;
    if (handleDropdownError(isItemSelect, dropdownRef2)) return;

    try {
        const updatedItems = formData?.items?.map(({ tax_name, ...rest }) => rest);

        const mainSendData = {
            ...formData,
            items: updatedItems,
            address: JSON.stringify(formData?.address),
            ...additionalData,
        };

        dispatch(
            createPurchases(
                mainSendData,
                Navigate,
                type,
                isEdit,
                button,
                showAllSequenceId,
                itemId,
                convert
            )
        );
    } catch (error) {
        toast.error(`Error updating ${type}:`, error);
    }
};
