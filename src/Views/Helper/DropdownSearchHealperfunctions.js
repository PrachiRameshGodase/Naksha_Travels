import { customersList } from '../../Redux/Actions/customerActions';
import { categoryList, itemLists, purchseOrdersLists } from '../../Redux/Actions/listApisActions';

export const DropdownSearchHealperfunctions = (searchTerm, type, dispatch) => {
    if (type === "select_item") {
        // dispatch(itemLists({ search: searchTerm, active: 1 }));
    }
    else if (type === "vendor" || type === "vendor_charges") {
        dispatch(customersList({ search: searchTerm, status: "1", fy: localStorage.getItem("FinancialYear"), }));
    }

    else if (type === "categories") {
        dispatch(categoryList({ search: searchTerm, status: "1", fy: localStorage.getItem("FinancialYear"), }));
    }


};

