import React, { useState, useEffect, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import PaginationComponent from "../../Common/Pagination/PaginationComponent";
import TableViewSkeleton from "../../../Components/SkeletonLoder/TableViewSkeleton";
import useOutsideClick from "../../Helper/PopupData";
import { paymentRecList } from "../../../Redux/Actions/PaymentRecAction";
import NoDataFound from "../../../Components/NoDataFound/NoDataFound";
import { OutsideClick } from "../../Helper/ComponentHelper/OutsideClick";
import sortbyIco from "../../../assets/outlineIcons/othericons/sortbyIco.svg";
import FilterIco from "../../../assets/outlineIcons/othericons/FilterIco.svg";
import ResizeFL from "../../../Components/ExtraButtons/ResizeFL";
import {
  showAmountWithCurrencySymbol,
  showRateWithPercent,
} from "../../Helper/HelperFunctions";
import ShowMastersValue from "../../Helper/ShowMastersValue";
import { DateRangePicker } from "react-date-range";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";
import SearchBox from "../../Common/SearchBox/SearchBox";
import SortBy from "../../Common/SortBy/SortBy";
import DatePicker from "../../Common/DatePicker/DatePicker";
import { formatDate, formatDate3} from "../../Helper/DateFormat";
import { paymentMadeOptions } from "../../Helper/SortByFilterContent/sortbyContent";
import FilterBy from "../../Common/FilterBy/FilterBy";
import { paymentRecOptions } from "../../Helper/SortByFilterContent/filterContent";

const PaymentMade = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const qutList = useSelector((state) => state?.paymentRecList);
  const masterData = useSelector((state) => state?.masterData?.masterData);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  //serch
  const [searchTermFromChild, setSearchTermFromChild] = useState("");
  const onSearch = (term) => {
    resetPageIfNeeded()
    setSearchTrigger((prev) => prev + 1);
    setSearchTermFromChild(term); // Update parent state with search term from child
  };
  //Search
  // serch,filter and sortby////////////////////////////////////

  const fetchQuotations = useCallback(async () => {
    try {
      const fy = localStorage.getItem("FinancialYear");
      const currentpage = currentPage;

      const sendData = {
        fy,
        noofrec: itemsPerPage,
        inout: 2,
        currentpage,
        ...(selectedSortBy !== "Normal" && { sort_by: selectedSortBy, sort_order: sortOrder }),
        ...(status && { payment_mode: status }),
        ...(searchTermFromChild && { search: searchTermFromChild }),
        ...(clearFilter === false && {
          ...(specificDate
            ? { custom_date: formatDate(new Date(specificDate)) }
            : dateRange[0]?.startDate && dateRange[0]?.endDate && {
              from_date: formatDate(new Date(dateRange[0].startDate)),
              to_date: formatDate(new Date(dateRange[0].endDate)),
            }),
        }),
      };

      dispatch(paymentRecList(sendData));
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  }, [searchTrigger]);

  useEffect(() => {
    fetchQuotations();
  }, [searchTrigger]);

  const handleRowClicked = (quotation) => {
    Navigate(`/dashboard/payment-made-detail?id=${quotation.id}`);
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
    const areAllRowsSelected = qutList?.data?.data?.payments?.every((row) =>
      selectedRows.includes(row.id)
    );
    setSelectAll(areAllRowsSelected);
  }, [selectedRows, qutList?.data?.data?.payments]);

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setSelectedRows(
      selectAll ? [] : qutList?.data?.data?.payments?.map((row) => row.id)
    );
  };
  //logic for checkBox...

  return (
    <>
      <TopLoadbar />
      <div id="middlesection">
        <div id="Anotherbox">
          <div id="leftareax12">
            <h1 id="firstheading">
              {otherIcons.all_payment_made_svg}
              All Payment Made
            </h1>
            <p id="firsttagp">{qutList?.data?.data?.count} Records</p>
            <SearchBox placeholder="Search In Payment Made" onSearch={onSearch} />
          </div>

          <div id="buttonsdata">
            <SortBy
              setSearchTrigger={setSearchTrigger}
              selectedSortBy={selectedSortBy}
              setSelectedSortBy={setSelectedSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortOptions={paymentMadeOptions}
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
              filterOptions={paymentRecOptions}
              resetPageIfNeeded={resetPageIfNeeded}
            />

            <Link className="linkx1" to={"/dashboard/create-payment-made"}>
              New Payment <GoPlus />
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
                    Payment Number
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs3">
                    {otherIcons.customer_svg}
                    Vendor Name
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs4">
                    {otherIcons.refrence_svg}
                    Refrence No
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs5">

                    Mode
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs5">
                    {otherIcons.doller_svg}
                    Amount
                  </div>
                </div>

                {qutList?.loading ? (
                  <TableViewSkeleton />
                ) : (
                  <>
                    {qutList?.data?.data?.payments?.length >= 1 ? (
                      <>
                        {qutList?.data?.data?.payments?.map(
                          (quotation, index) => (
                            <div
                              className={`table-rowx12 ${selectedRows?.includes(quotation?.id)
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
                                  checked={selectedRows?.includes(
                                    quotation?.id
                                  )}
                                  type="checkbox"
                                  onChange={() =>
                                    handleCheckboxChange(quotation?.id)
                                  }
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
                                {quotation?.payment_id || ""}
                              </div>
                              <div
                                onClick={() => handleRowClicked(quotation)}
                                className="table-cellx12 quotiosalinvlisxs3"
                              >
                                {quotation?.display_name || ""}
                              </div>

                              <div
                                onClick={() => handleRowClicked(quotation)}
                                className="table-cellx12 quotiosalinvlisxs5"
                              >
                                {quotation?.reference == 0 ? "" : quotation?.reference || ""}
                              </div>
                              <div
                                onClick={() => handleRowClicked(quotation)}
                                className="table-cellx12 quotiosalinvlisxs5"
                              >
                                <ShowMastersValue
                                  type="9"
                                  id={quotation?.payment_mode}
                                />
                              </div>

                              <div
                                onClick={() => handleRowClicked(quotation)}
                                className="table-cellx12 quotiosalinvlisxs5_item"

                              >
                                <p style={{ paddingRight: "20px" }}>
                                  {showAmountWithCurrencySymbol(
                                    quotation?.credit
                                  )}
                                </p>

                              </div>
                            </div>
                          )
                        )}
                      </>
                    ) : (
                      <NoDataFound />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <PaginationComponent
          itemList={qutList?.data?.data?.count}
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

export default PaymentMade;
