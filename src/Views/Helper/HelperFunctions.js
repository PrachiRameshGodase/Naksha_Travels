import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { autoGenerateIdList } from "../../Redux/Actions/globalActions";
import { isPartiallyInViewport } from "./is_scroll_focus";

const getLocalStorageData = localStorage?.getItem("UserData");
const UserData = JSON.parse(getLocalStorageData);

export const showRateWithPercent = (val) => {
    return val ? `${val} %` : 'Non-Taxable';
}

export const activeOrg_details = UserData?.active_organisation;
export const currencySymbol = activeOrg_details?.symbol ? activeOrg_details?.symbol : "$";
export const getCurrencyFormData = activeOrg_details?.currency ? activeOrg_details?.currency : "INR";
export const orgnizationEmail = activeOrg_details?.email ? activeOrg_details?.email : "";

export const showAmountWithCurrencySymbol = (val) => {
    return val ? `${currencySymbol} ${val}` : '';
}
export const showAmountWithCurrencySymbolWithPoints = (val) => {
    return val ? `${currencySymbol} ${val}.00` : '';
}

export const ShowMasterData = (type) => {
    const masterData = useSelector(state => state?.masterData?.masterData);

    const filteredData = masterData?.filter(item => item.type === type);

    return filteredData || [];
};


export const ShowAutoGenerateId = (module, showField) => {
    const dispatch = useDispatch();
    const moduleIdList = useSelector(state => state?.autoIdList);
    const showMainGenerateIdData = moduleIdList?.data?.sequence[0];

    useEffect(() => {
        // if (!showField) {
        dispatch(autoGenerateIdList({ module: module }))
        // }
    }, [dispatch]);

    return showMainGenerateIdData || [];
};

// list api datas
export const sendData = {
    fy: localStorage.getItem("FinancialYear"),
    noofrec: 15,
    currentpage: 1
}


export const activeCustomerData = (type) => {
    const cusList = useSelector((state) => state?.customerList);
    return cusList;
};

export const showRealatedText = (section, val1, showtext1, val2, showtext2, showtext3) => {
    const showText = section === val1 ? showtext1 : section === val2 ? showtext2 : showtext3
    return showText;
}

export const handleDropdownError = (isSelected, dropdownRef) => {
    if (!isSelected) {
        if (!isPartiallyInViewport(dropdownRef.current)) {
            dropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setTimeout(() => {
            dropdownRef.current.focus();
        }, 500);
        return true;
    }
    return false;
};

export const stringifyJSON = (data) => {
    try {
        return JSON.stringify(data);
    } catch (error) {
        console.error("Error stringifying JSON:", error);
        return null;
    }
};

export const parseJSONofString = (jsonString) => {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
    }
};

export function getDateStatus(createdDate, expiryDate) {
    const now = new Date();
    const created = new Date(createdDate);
    const expiry = new Date(expiryDate);

    const totalDays = (expiry - created) / (1000 * 60 * 60 * 24);

    const passedDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

    const leftDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    const thirtyPercentDays = Math.floor(totalDays * 0.3);

    if (passedDays <= thirtyPercentDays) {
        return "Sent";
    } else if (leftDays > 1) {
        return `Due In ${leftDays} Days`;
    } else if (leftDays === 1) {
        return "Expires Tomorrow";
    } else if (leftDays === 0) {
        return "Expires Today";
    } else {
        return "Expired";
    }
}
export function getDateStatus1(createdDate, expiryDate) {
    const now = new Date();
    const created = new Date(createdDate);
    const expiry = new Date(expiryDate);

    const totalDays = (expiry - created) / (1000 * 60 * 60 * 24);

    const passedDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

    const leftDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    const thirtyPercentDays = Math.floor(totalDays * 0.3);
    if (passedDays <= thirtyPercentDays) {
        return "Approved";
    } else if (leftDays > 1) {
        return `Due In ${leftDays} Days`;
    } else if (leftDays === 1) {
        return `Due In Tomorrow`;
    } else if (leftDays === 0) {
        return `Due In Today`;
    } else if (leftDays < 0) {
        return `Overdue by ${-leftDays} Days`;
    }
}







