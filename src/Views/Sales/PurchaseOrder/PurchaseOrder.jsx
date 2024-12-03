import React, { useState, useEffect, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { GoPlus } from "react-icons/go";
import { purchseOrdersLists } from "../../../Redux/Actions/listApisActions";
import { useDispatch, useSelector } from "react-redux";
import PaginationComponent from "../../Common/Pagination/PaginationComponent";
import TableViewSkeleton from "../../../Components/SkeletonLoder/TableViewSkeleton";
import ResizeFL from "../../../Components/ExtraButtons/ResizeFL";
import { showAmountWithCurrencySymbol } from "../../Helper/HelperFunctions";
import { formatDate,formatDate3 } from "../../Helper/DateFormat";
import SearchBox from "../../Common/SearchBox/SearchBox";
import SortBy from "../../Common/SortBy/SortBy";
import DatePicker from "../../Common/DatePicker/DatePicker";
import FilterBy from "../../Common/FilterBy/FilterBy";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";
import { purchaseOrderFilterOptions } from "../../Helper/SortByFilterContent/filterContent";
import { purchaseOrderSortOptions } from "../../Helper/SortByFilterContent/sortbyContent";


const PurchaseOrder = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const qutList = useSelector((state) => state?.purchseList);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dataChanging, setDataChanging] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);
  // reset current page to 1 when any filters are applied
  const resetPageIfNeeded = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  };

  // serch,filter and sortby////////////////////////////////////
  // sortBy
  const [selectedSortBy, setSelectedSortBy] = useState("Normal");
  const [sortOrder, setSortOrder] = useState(1);
  //sortby

  //date range picker
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [specificDate, setSpecificDate] = useState(null);
  const [clearFilter, setClearFilter] = useState(true);
  //date range picker

  // filter
  const [selectedSortBy2, setSelectedSortBy2] = useState("Normal");
  const [status, setStatus] = useState("");
  // filter

  //search
  const [searchTermFromChild, setSearchTermFromChild] = useState(""); // Receive from child

  const onSearch = (term) => {
    resetPageIfNeeded();
    setSearchTrigger((prev) => prev + 1);
    setSearchTermFromChild(term); // Update parent state with search term from child
  };

  //search

  // serch,filter and sortby////////////////////////////////////

  const fetchQuotations = useCallback(async () => {
    try {
      const fy = localStorage.getItem("FinancialYear");
      const currentpage = currentPage;

      const sendData = {
        fy,
        noofrec: itemsPerPage,
        currentpage,
        ...(selectedSortBy !== "Normal" && {
          sort_by: selectedSortBy,
          sort_order: sortOrder,
        }),
        ...(status && {
          status: status === "expiry_date" ? 6 : status,
          ...(status === "expiry_date" && { expiry_date: 1 }),
        }),
        ...(searchTermFromChild && { search: searchTermFromChild }),
        ...(clearFilter === false && {
          ...(specificDate
            ? { custom_date: formatDate(new Date(specificDate)) }
            : dateRange[0]?.startDate &&
            dateRange[0]?.endDate && {
              from_date: formatDate(new Date(dateRange[0].startDate)),
              to_date: formatDate(new Date(dateRange[0].endDate)),
            }),
        }),
      };

      dispatch(purchseOrdersLists(sendData));
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  }, [searchTrigger]);

  useEffect(() => {
    fetchQuotations();
  }, [searchTrigger]);

  const handleRowClicked = (quotation) => {
    Navigate(`/dashboard/purchase-details?id=${quotation.id}`);
  };

  //logic for checkBox...
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const handleCheckboxChange = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };
  useEffect(() => {
    const areAllRowsSelected = qutList?.data?.purchase_order?.every((row) =>
      selectedRows.includes(row.id)
    );
    setSelectAll(areAllRowsSelected);
  }, [selectedRows, qutList?.data]);

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setSelectedRows(
      selectAll ? [] : qutList?.data?.purchase_order?.map((row) => row.id)
    );
  };

  return (
    <>
      <TopLoadbar />
      <div id="middlesection">
        <div id="Anotherbox">
          <div id="leftareax12">
            <h1 id="firstheading">
              {/* <img src={"/assets/Icons/allcustomers.svg"} alt="" /> */}
              {otherIcons.all_purchase_svg}
              All Purchase Order
            </h1>
            <p id="firsttagp">
              {qutList?.data?.total} records
            </p>
            <SearchBox
              placeholder="Search In Purchase Order"
              onSearch={onSearch}
            />
          </div>

          <div id="buttonsdata">
            <SortBy
              setSearchTrigger={setSearchTrigger}
              selectedSortBy={selectedSortBy}
              setSelectedSortBy={setSelectedSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortOptions={purchaseOrderSortOptions}
              resetPageIfNeeded={resetPageIfNeeded}
            />
            <DatePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
              setSpecificDate={setSpecificDate}
              setClearFilter={setClearFilter}
              setSearchTrigger={setSearchTrigger}
              resetPageIfNeeded={resetPageIfNeeded}
            />

            <FilterBy
              setStatus={setStatus}
              selectedSortBy={selectedSortBy2}
              setSearchTrigger={setSearchTrigger}
              setSelectedSortBy={setSelectedSortBy2}
              filterOptions={purchaseOrderFilterOptions}
              resetPageIfNeeded={resetPageIfNeeded}
            />

            <Link
              className="linkx1"
              to={"/dashboard/create-purchases"}
              data-tooltip-content="New Purchase"
              data-tooltip-id="my-tooltip"
              data-tooltip-place="bottom"
            >
              New Purchase <GoPlus />
            </Link>

            <ResizeFL />
          </div>
        </div>

        <div
          id="mainsectioncsls"
          className="commonmainqusalincetcsecion listsectionsgrheigh"
        >
          <div id="leftsidecontentxls">
            <div id="item-listsforcontainer">
              <div id="newtableofagtheme">
                <div className="table-headerx12">
                  <div
                    className="table-cellx12 checkboxfx1"
                    id="styl_for_check_box"
                  >
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                    <div className="checkmark"></div>
                  </div>
                  <div className="table-cellx12 quotiosalinvlisxs1">
                    {otherIcons.date_svg}
                    Date
                  </div>
                  <div className="table-cellx12 quotiosalinvlisxs2">
                    {otherIcons.quotation_icon}
                    PURCHASE ORDER
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs3">
                    {otherIcons.customer_svg}
                    VENDOR Name
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs4">
                    {otherIcons.refrence_svg}
                    REFRENCE NUMBER
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs5">
                    {otherIcons.doller_svg}
                    AMOUNT
                  </div>
                  <div className="table-cellx12 quotiosalinvlisxs6">
                    {otherIcons.status_svg}
                    STATUS
                  </div>
                </div>

                {qutList?.loading || dataChanging === true ? (
                  <TableViewSkeleton />
                ) : (
                  <>
                    {qutList?.data?.purchase_order?.map((quotation, index) => (
                      <div
                        className={`table-rowx12 ${selectedRows.includes(quotation.id)
                          ? "selectedresult"
                          : ""
                          }`}
                        key={index}
                      >
                        <div
                          className="table-cellx12 checkboxfx1"
                          id="styl_for_check_box"
                        >
                          <input
                            checked={selectedRows.includes(quotation.id)}
                            type="checkbox"
                            onChange={() => handleCheckboxChange(quotation.id)}
                          />
                          <div className="checkmark"></div>
                        </div>
                        <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs1"
                        >
                         
                            
                            {quotation.created_at
                        ? formatDate3(quotation.created_at)
                        : ""}
                        </div>

                        <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs2"
                        >
                          <p style={{ width: "40%", marginLeft: "7px" }}>
                            {quotation.purchase_order_id || ""}
                          </p>
                        </div>
                        <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs3"
                        >
                          <p style={{ marginLeft: "12px" }}>
                            {quotation.display_name === "0"
                              ? ""
                              : quotation.display_name || ""}
                          </p>
                        </div>
                        <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs4"
                        >
                          <p style={{ marginLeft: "25px" }}>
                            {quotation.reference == 0
                              ? ""
                              : quotation.reference || ""}
                          </p>
                        </div>
                        {/* <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs5"
                        >
                          {showAmountWithCurrencySymbol(quotation.total)}
                        </div> */}
                        <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs5_item"
                          style={{ marginRight: "25px" }}
                        >
                          <p>
                            {" "}
                            {showAmountWithCurrencySymbol(quotation.total)}
                          </p>
                        </div>
                        <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs6 sdjklfsd565 s25x85werse5d4rfsd"
                          style={{ marginRight: "10px" }}
                        >
                          <div>
                            <p
                              className={
                                quotation?.status === "1"
                                  ? "approved" :
                                  quotation?.status === "6"
                                    ? "open"
                                    : quotation?.status === "0"
                                      ? "draft"
                                      : quotation?.status == "2"
                                        ? "declined"
                                        : quotation?.status === "3"
                                          ? "pending"
                                          : quotation?.status === "4"
                                            ? "overdue"
                                            : ""
                              }
                            >
                              <p>
                                {quotation?.status === "0"
                                  ? "Draft"
                                  : quotation?.status === "1"
                                    ? "Approved"
                                    : quotation?.status === "6"
                                      ? "Open"
                                      : quotation?.status == "2"
                                        ? "Declined"
                                        : quotation?.status == "3"
                                          ? "Transfer To GRN"
                                          : quotation?.status == "4"
                                            ? "Billed"
                                            : ""}
                              </p>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <PaginationComponent
          itemList={qutList?.data?.total}
          setSearchCall={setSearchTrigger}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
        <Toaster />
      </div>
    </>
  );
};

export default PurchaseOrder;
