import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import TableViewSkeleton from "../../../Components/SkeletonLoder/TableViewSkeleton";
import PaginationComponent from "../../Common/Pagination/PaginationComponent";
import { expenseTableIcons } from "../../Helper/SVGIcons/ItemsIcons/ItemsTableIcons";
import { exportItems, importItems } from "../../../Redux/Actions/itemsActions";
import { RxCross2 } from "react-icons/rx";
import MainScreenFreezeLoader from "../../../Components/Loaders/MainScreenFreezeLoader";
import NoDataFound from "../../../Components/NoDataFound/NoDataFound";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { expenseLists } from "../../../Redux/Actions/expenseActions";
import newmenuicoslz from "../../../assets/outlineIcons/othericons/newmenuicoslz.svg";
import { OutsideClick } from "../../Helper/ComponentHelper/OutsideClick";
import ResizeFL from "../../../Components/ExtraButtons/ResizeFL";
import { showAmountWithCurrencySymbol } from "../../Helper/HelperFunctions";
import SearchBox from "../../Common/SearchBox/SearchBox";
import SortBy from "../../Common/SortBy/SortBy";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";
import { formatDate, formatDate3 } from "../../Helper/DateFormat";
import DatePicker from "../../Common/DatePicker/DatePicker";
import { expenseSortOptions } from "../../Helper/SortByFilterContent/sortbyContent";

const Expenses = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dataChanging, setDataChanging] = useState(false);
  const itemListState = useSelector((state) => state?.expenseList);
  const itemList = itemListState?.data || [];
  const totalItems = itemList?.length || 0;
  const itemListLoading = itemListState?.loading || false;

  const Navigate = useNavigate();
  const [searchTrigger, setSearchTrigger] = useState(0);

  // reset current page to 1 when any filters are applied
  const resetPageIfNeeded = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  };
  const importItemss = useSelector((state) => state?.importItems);
  const exportItemss = useSelector((state) => state?.exportItems);
  // outside close and open filter and sortBy

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  const moreDropdownRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleCheckboxChange = (rowId) => {
    setSelectedRows((prevRows) =>
      prevRows.includes(rowId)
        ? prevRows.filter((id) => id !== rowId)
        : [...prevRows, rowId]
    );
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setSelectedRows(selectAll ? [] : itemList?.expense?.map((row) => row.id));
  };

  const handleRowClicked = (quotation) => {
    Navigate(`/dashboard/expense-details?id=${quotation.id}`);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //for import and export .xlsx file
  const fileInputRef = useRef(null);

  const [showImportPopup, setShowImportPopup] = useState(false); // State variable for popup visibility

  // Function to handle import button click and toggle popup visibility
  const handleImportButtonClick = () => {
    setShowImportPopup(true);
  };

  const [callApi, setCallApi] = useState(false);

  const handleFileImport = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append("file", file);
    dispatch(importItems(formData)).then(() => {
      setShowImportPopup(false);
      setCallApi((preState) => !preState);
      // Reset file input value after import operation is completed
      fileInputRef.current.value = ""; // Clearing file input value
      // Reset fileName state
      setFileName("");
    });
  };

  const handleFileExport = async () => {
    try {
      dispatch(exportItems()).finally(() => {
        toast.success("Item exported successfully");
        setIsMoreDropdownOpen(false);
      });
    } catch (error) {
      toast.error("Error exporting items:", error);
      setIsMoreDropdownOpen(false);
    }
  };

  // serch and filter

  //sortBy
  const [selectedSortBy, setSelectedSortBy] = useState("Normal");
  const [sortOrder, setSortOrder] = useState(1);
  //sortBy

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

  //serch
  const [searchTermFromChild, setSearchTermFromChild] = useState("");
  const onSearch = (term) => {
    resetPageIfNeeded();
    setSearchTrigger((prev) => prev + 1);
    setSearchTermFromChild(term); // Update parent state with search term from child
  };
  //Search

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

      dispatch(expenseLists(sendData));
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  }, [searchTrigger]);

  useEffect(() => {
    fetchQuotations();
  }, [searchTrigger]);

  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Update the file input value
      fileInputRef.current.files = files;
      setFileName(files[0].name); // Set the file name
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileImport(files[0]); // Pass the first dropped file to handleFileImport
      setFileName(files[0].name); // Set the file name
    }
  };

  //DropDown for fitler, sortby and import/export

  const handleMoreDropdownToggle = () => {
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (
      moreDropdownRef.current &&
      !moreDropdownRef.current.contains(event.target)
    ) {
      setIsMoreDropdownOpen(false);
    }

    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {importItemss?.loading && <MainScreenFreezeLoader />}
      {exportItemss?.loading && <MainScreenFreezeLoader />}
      <TopLoadbar />
      <div id="middlesection" className="">
        <div id="Anotherbox" className="formsectionx1">
          <div id="leftareax12">
            <h1 id="firstheading">
              {otherIcons.all_expense_svg}
              All Expenses
            </h1>
            <p id="firsttagp">{itemList?.count} Records</p>
            <SearchBox placeholder="Search In Expenses" onSearch={onSearch} />
          </div>

          <div id="buttonsdata">
            <SortBy
              setSearchTrigger={setSearchTrigger}
              selectedSortBy={selectedSortBy}
              setSelectedSortBy={setSelectedSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortOptions={expenseSortOptions}
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

            <Link className="linkx1" to={"/dashboard/create-expenses"}>
              New Expense Record <GoPlus />
            </Link>

            <ResizeFL
              data-tooltip-content="Expand"
              data-tooltip-id="my-tooltip"
              data-tooltip-place="bottom"
            />

            {/* More dropdown */}
            <div className="maincontainmiainx1">
              <div className="mainx2" onClick={handleMoreDropdownToggle}>
                <img
                  src={newmenuicoslz}
                  alt=""
                  data-tooltip-content="More Options"
                  data-tooltip-place="bottom"
                  data-tooltip-id="my-tooltip"
                />
              </div>
              {isMoreDropdownOpen && (
                <div className="dropdowncontentofx35" ref={moreDropdownRef}>
                  <div
                    onClick={handleImportButtonClick}
                    className="dmncstomx1 xs2xs23"
                  >
                    {otherIcons?.import_svg}
                    <div>Import</div>
                  </div>

                  <div
                    className="dmncstomx1 xs2xs23"
                    onClick={handleFileExport}
                  >
                    {otherIcons?.export_svg}
                    Export
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <div className="bordersinglestroke"></div> */}
        <div id="mainsectioncsls" className="listsectionsgrheigh">
          <div id="leftsidecontentxls">
            <div id="item-listsforcontainer">
              <div id="newtableofagtheme">
                <div className="table-headerx12">
                  <div
                    className="table-cellx12 checkboxfx1 x2s5554"
                    id="styl_for_check_box"
                  >
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                    <div className="checkmark"></div>
                  </div>
                  {expenseTableIcons?.map((val, index) => (
                    <div
                      key={index}
                      className={`table-cellx12 ${val?.className}`}
                    >
                      {val?.svg}
                      {val?.name}
                    </div>
                  ))}
                </div>

                {itemListLoading || dataChanging ? (
                  <TableViewSkeleton />
                ) : (
                  <>
                    {itemList?.expense?.length >= 1 ? (
                      itemList?.expense?.map((quotation, index) => (
                        <div
                          className={`table-rowx12 ${
                            selectedRows.includes(quotation?.id)
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
                              checked={selectedRows.includes(quotation?.id)}
                              type="checkbox"
                              onChange={() =>
                                handleCheckboxChange(quotation?.id)
                              }
                            />
                            <div className="checkmark"></div>
                          </div>
                          <div
                            onClick={() => handleRowClicked(quotation)}
                            className="table-cellx12 journalx4s1"
                          >
                            {quotation.created_at
                              ? formatDate3(quotation.created_at)
                              : ""}
                          </div>
                          <div
                            onClick={() => handleRowClicked(quotation)}
                            className="table-cellx12 journalx4s2"
                          >
                            {quotation?.expense_account?.account_name || ""}
                          </div>
                          <div
                            onClick={() => handleRowClicked(quotation)}
                            className="table-cellx12 journalx4s3"
                          >
                            {quotation?.expense_head?.expense_name || ""}
                          </div>

                          <div
                            onClick={() => handleRowClicked(quotation)}
                            className="table-cellx12 quotiosalinvlisxs5_item"
                          >
                            <p style={{ marginRight: "55px" }}>
                              {showAmountWithCurrencySymbol(quotation?.amount)}
                            </p>
                          </div>
                          <div
                            onClick={() => handleRowClicked(quotation)}
                            className="table-cellx12 journalx4s4"
                          >
                            {quotation?.paid_through?.account_name || ""}
                          </div>
                          <div
                            // onClick={() => handleRowClicked(quotation)}
                            className="table-cellx12 journalx4s6 "
                          >
                            <p
                              className={`stockhistoryxjlk478 ${
                                quotation?.document ? "" : ""
                              }`}
                            >
                              {quotation?.document ? (
                                <>
                                  <Link
                                    target="_blank"
                                    to={`${quotation?.document}`}
                                  >
                                    {otherIcons?.file_svg} File Attached
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                            </p>
                          </div>
                        </div>
                      ))
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
          itemList={itemList?.count}
          setSearchCall={setSearchTrigger}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      </div>

      {showImportPopup && (
        <div
          className={`mainxpopups1 ${isDragging ? "dragover" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <div className="popup-content">
            <span
              className="close-button"
              onClick={() => setShowImportPopup(false)}
            >
              <RxCross2 />
            </span>
            <h2>Import Items</h2>

            <form onSubmit={handleFileImport}>
              <div className="midpopusec12x">
                <div className="cardofselcetimage5xs">
                  {otherIcons?.drop_file_svg}
                  <h1>
                    Drop your file here, or{" "}
                    <label onClick={openFileDialog}>browse</label>{" "}
                  </h1>
                  <input
                    className="custominputofc156s"
                    id="browse"
                    type="file"
                    accept=".xlsx"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    required
                  />
                  <b>{fileName}</b>
                  <p>Supports: .xlsx</p>
                </div>
                <button type="submit" className="submitbuttons1">
                  <span>
                    <p>Import</p>
                    {otherIcons?.import_svg}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default Expenses;
