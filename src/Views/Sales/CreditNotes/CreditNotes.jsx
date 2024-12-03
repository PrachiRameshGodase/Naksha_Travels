import React, { useState, useEffect, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { GoPlus } from "react-icons/go";
import { creditNoteLists } from "../../../Redux/Actions/listApisActions";
import { useDispatch, useSelector } from "react-redux";
import PaginationComponent from "../../Common/Pagination/PaginationComponent";
import TableViewSkeleton from "../../../Components/SkeletonLoder/TableViewSkeleton";
import { ListComponent2 } from "../Quotations/ListComponent";
import ResizeFL from "../../../Components/ExtraButtons/ResizeFL";
import { formatDate } from "../../Helper/DateFormat";
import DatePicker from "../../Common/DatePicker/DatePicker";
import SearchBox from "../../Common/SearchBox/SearchBox";
import SortBy from "../../Common/SortBy/SortBy";
import FilterBy from "../../Common/FilterBy/FilterBy";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";
import NoDataFound from "../../../Components/NoDataFound/NoDataFound";
import { creditNotesOptions } from "../../Helper/SortByFilterContent/filterContent";
const CreditNotes = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const qutList = useSelector((state) => state?.creditNoteList);
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
  const [clearFilter, setClearFilter] = useState(null);

  //date range picker

  // filter
  const [selectedSortBy2, setSelectedSortBy2] = useState("Normal");
  const [status, setStatus] = useState("");
  // filter

  //search
  const [searchTermFromChild, setSearchTermFromChild] = useState("");
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

      dispatch(creditNoteLists(sendData));
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  }, [
    itemsPerPage,
    currentPage,
    selectedSortBy,
    sortOrder,
    status,
    searchTermFromChild,
    specificDate,
    dateRange,
    clearFilter,
    selectedSortBy2,
  ]);

  useEffect(() => {
    fetchQuotations();
  }, [searchTrigger, dispatch]);

  const handleRowClicked = (quotation) => {
    Navigate(`/dashboard/creditnote-details?id=${quotation.id}`);
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
    const areAllRowsSelected = qutList?.data?.creditnote?.every((row) =>
      selectedRows.includes(row.id)
    );
    setSelectAll(areAllRowsSelected);
  }, [selectedRows, qutList?.data?.creditnote]);

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setSelectedRows(
      selectAll ? [] : qutList?.data?.creditnote?.map((row) => row.id)
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
              {/* <img src={"/assets/Icons/allcustomers.svg"} alt="" /> */}
              {otherIcons.all_creditnote_svg}
              All Credit Notes
            </h1>
            <p id="firsttagp">{qutList?.data?.count} Records</p>
            <SearchBox
              placeholder="Search In Credit Notes"
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
              section="Credit Note Number"
              sortById="credit_note_id"
              type='Customer'
              resetPageIfNeeded={resetPageIfNeeded}

            />
            <DatePicker
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
              filterOptions={creditNotesOptions}
              resetPageIfNeeded={resetPageIfNeeded}
            />
            <Link className="linkx1" to={"/dashboard/create-credit-note"}>
              New Credit Notes <GoPlus />
            </Link>
            <ResizeFL />
          </div>
        </div>

        <div id="mainsectioncsls" className="commonmainqusalincetcsecion">
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
                    Credit Note
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs3">
                    {otherIcons.customer_svg}
                    Customer Name
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs4">
                    {otherIcons.refrence_svg}
                    Invoice Id
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs5">
                    <p style={{ display: "flex", alignItems: "center" }}>
                      {otherIcons?.doller_svg}
                      Amount
                    </p>
                  </div>
                  <div className="table-cellx12 quotiosalinvlisxs6">
                    {otherIcons.status_svg}
                    Status
                  </div>
                </div>

                {qutList?.loading ? (
                  <TableViewSkeleton />
                ) : (
                  <>
                    {qutList?.data?.creditnote?.length >= 1 ? <>
                      {qutList?.data?.creditnote?.map((quotation, index) => (
                        <ListComponent2
                          key={index}
                          handleRowClicked={handleRowClicked}
                          quotation={quotation}
                          selectedRows={selectedRows}
                          handleCheckboxChange={handleCheckboxChange}
                        />
                      ))}
                    </>
                      :
                      (
                        <NoDataFound />
                      )}

                    <PaginationComponent
                      itemList={qutList?.data?.count}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                      setItemsPerPage={setItemsPerPage}
                      setSearchCall={setSearchTrigger}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default CreditNotes;
