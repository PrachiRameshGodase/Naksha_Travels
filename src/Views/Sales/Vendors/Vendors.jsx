import React, { useState, useEffect, useRef, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import PaginationComponent from "../../Common/Pagination/PaginationComponent";
import TableViewSkeleton from "../../../Components/SkeletonLoder/TableViewSkeleton";
import "../../Items/ManageItems.scss";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";
import { exportItems, importItems } from "../../../Redux/Actions/itemsActions";
import { fetchMasterData } from "../../../Redux/Actions/globalActions";
import { vendorsLists } from "../../../Redux/Actions/listApisActions";

import sortbyIco from "../../../assets/outlineIcons/othericons/sortbyIco.svg";
import FilterIco from "../../../assets/outlineIcons/othericons/FilterIco.svg";
import ResizeFL from "../../../Components/ExtraButtons/ResizeFL";

import newmenuicoslz from "../../../assets/outlineIcons/othericons/newmenuicoslz.svg";
import { OutsideClick } from "../../Helper/ComponentHelper/OutsideClick";
import SearchBox from "../../Common/SearchBox/SearchBox";
import SortBy from "../../Common/SortBy/SortBy";
import DatePicker from "../../Common/DatePicker/DatePicker";
import { formatDate } from "../../Helper/DateFormat";
import SortBy2 from "../../Common/SortBy/SortBy2";
const Vendors = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dataChanging, setDataChanging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const cusList = useSelector((state) => state?.vendorList);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [searchTrigger, setSearchTrigger] = useState(0);
  // reset current page to 1 when any filters are applied
  const resetPageIfNeeded = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  };
  // dropdwon filter,sortby and import/export
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);
  const dropdownRef = useRef(null);

  // outside close and open filter and sortBy
  const filterDropdown = OutsideClick();
  const sortByDropdown = OutsideClick();
  const moreDropdown = OutsideClick();
  // serch,filter and sortBy//////////////////////////////////////////////////////////
  const [searchCall, setSearchCall] = useState(false);

  // filter/
  const [selectAllCustomer, setSelectAllCustomer] = useState(false);
  const [customerType, setCustomerType] = useState("");
  const [status, setStatus] = useState("");
  const [allFilters, setAllFilters] = useState({});

  const handleApplyFilter = () => {
    const filterValues = {
      is_vendor: selectAllCustomer ? 1 : "",
      status:status === "active"? 1: status === "inactive"? 0:  "",
      customer_type: customerType,
  };

    const filteredValues = Object.fromEntries(
      Object.entries(filterValues).filter(([_, value]) => value !== "")
    );

    const filterButton = document.getElementById("filterButton");
    if (
      filterValues.customer_type === "" &&
      filterValues.is_vendor === 1 &&
      filterValues.status === ""
    ) {
      filterButton.classList.remove("filter-applied");
    } else {
      filterButton.classList.add("filter-applied");
    }
    resetPageIfNeeded();
    setSearchTrigger((prev) => prev + 1);
    filterDropdown.handleToggle();
    setAllFilters(filteredValues);
  };

  const handleAllVendorsChange = (checked) => {
    setSelectAllCustomer(checked);
    if (checked) {
      setCustomerType("");
      setStatus("");
      setAllFilters({})
    }
    const filterButton1 = document.getElementById("filterButton");
    if (selectAllCustomer) {
      filterButton1.classList.remove("filter-applied");
    } else {
      filterButton1.classList.remove("filter-applied");
    }
    resetPageIfNeeded();
    setSearchTrigger((prev) => prev + 1);
    filterDropdown.handleToggle();
  };
  // filter//

  // sortBy
  const [selectedSortBy, setSelectedSortBy] = useState("Normal");
  const [sortOrder, setSortOrder] = useState(1);
  //sortby

 
  //serch
  const [searchTermFromChild, setSearchTermFromChild] = useState("");
  const onSearch = (term) => {
    resetPageIfNeeded()
    setSearchTrigger((prev) => prev + 1);
    setSearchTermFromChild(term); // Update parent state with search term from child
  };
  //Search
  // serch,filter and sortBy//////////////////////////////////////////////////////////

  const fetchCustomers = useCallback(async () => {
    try {
      const fy = localStorage.getItem("FinancialYear");
      const currentpage = currentPage;

      const sendData = {
        fy,
        noofrec: itemsPerPage,
        status: 1,
        currentpage,
        ...(selectedSortBy !== "Normal" && {
          sort_by: selectedSortBy,
          sort_order: sortOrder,
        }),
        ...(status && {
          status: status
        }),
        ...(allFilters && {
          customer_type: allFilters?.customer_type,
        }),
        ...(searchTermFromChild && { search: searchTermFromChild }),
      
      };

      dispatch(vendorsLists(sendData));

      setDataChanging(false);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  }, [searchTrigger]);

  useEffect(() => {
    fetchCustomers();
  }, [searchTrigger]);

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
    const areAllRowsSelected = cusList?.data?.user.every((row) =>
      selectedRows.includes(row.id)
    );
    setSelectAll(areAllRowsSelected);
  }, [selectedRows, cusList?.data?.user]);

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setSelectedRows(selectAll ? [] : cusList?.data?.user.map((row) => row.id));
  };
  //logic for checkBox...

  //for import and export .xlsx file drag and dorp/////////////////////////////////
  //export data
  const handleFileExport = async () => {
    try {
      dispatch(exportItems()).finally(() => {
        toast.success("Vendor exported successfully");
        moreDropdown.handleToggle();
      });
    } catch (error) {
      toast.error("Error exporting Vendors:", error);
      moreDropdown.handleToggle();
    }
  };
  //export data

  const fileInputRef = useRef(null);

  const [showImportPopup, setShowImportPopup] = useState(false); // State variable for popup visibility

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

  // for drag and drop files
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileImport(files[0]); // Pass the first dropped file to handleFileImport
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

  const handleAllItemsChange1 = (checked, name, val) => {
    if (name === "normal") {
      setSelectAllCustomer(checked);

      if (checked) {
        setCustomerType("");
        setOverdue("");
        setStatus("");
      }
    } else if (name === "overdue") {
      setOverdue(checked);
      if (checked) {
        setSelectAllCustomer(false);
      }
    } else if (name === "type" && val) {
      if (checked) {
        setCustomerType(val);
        setSelectAllCustomer(false);
      } else {
        setCustomerType("");
      }
    } else if (name === "status" && val) {
      if (checked) {
        setStatus(val);
        setSelectAllCustomer(false);
      } else {
        setStatus("");
      }
    }
  };

  const handleDataChange = (newValue) => {
    setDataChanging(newValue);
  };

  const handleRowClicked = (quotation) => {
    Navigate(`/dashboard/vendor-details?id=${quotation.id}`);
  };

  const masterData = useSelector((state) => state?.masterData?.masterData);

  useEffect(() => {
    dispatch(fetchMasterData());
  }, [dispatch]);

  return (
    <>
      <TopLoadbar />

      <div id="Anotherbox" className="formsectionx1">
        <div id="leftareax12">
          <h1 id="firstheading">
            {/* <img src={"/assets/Icons/allcustomers.svg"} alt="" /> */}
            <svg
              id="fi_12371422"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 1"
            >
              <path
                d="m467.112 38.078a75.38 75.38 0 1 0 0 106.6 75.382 75.382 0 0 0 0-106.6zm-90.243 56.69a5.747 5.747 0 0 1 7.83-8.415l19.924 18.566 38.1-39.118a5.744 5.744 0 0 1 8.235 8.01l-41.93 43.058a5.749 5.749 0 0 1 -8.123.292zm-252.005-15.326v-.022a44.081 44.081 0 0 0 -43.583 44.5l.023.045h-.024a44.081 44.081 0 0 0 44.5 43.584l.045-.023v.022a44.079 44.079 0 0 0 43.582-44.5l-.022-.045h.022a44.079 44.079 0 0 0 -44.5-43.582l-.044.023zm0-11.521v.023a55.564 55.564 0 0 1 56.036 55.056h-.022a55.564 55.564 0 0 1 -55.058 56.04v-.022a55.564 55.564 0 0 1 -56.041-55.059h.021a55.566 55.566 0 0 1 55.058-56.041zm29.882-15.309a76.592 76.592 0 0 1 12.493 6.6 5.745 5.745 0 0 0 6.339-.054l.006.009 15.027-10.171 11.146 10.934-10.073 15.51a5.745 5.745 0 0 0 .066 6.357 76.391 76.391 0 0 1 10.662 25.838 5.747 5.747 0 0 0 4.545 4.474l17.8 3.43.151 15.607-18.085 3.854a5.751 5.751 0 0 0 -4.481 4.685c-1.633 8.589-5.98 18.408-10.725 25.694a5.741 5.741 0 0 0 .054 6.339l-.009.006 10.171 15.027-10.933 11.149-15.514-10.071a5.743 5.743 0 0 0 -6.357.066 76.391 76.391 0 0 1 -25.838 10.662 5.746 5.746 0 0 0 -4.474 4.545l-3.43 17.8-15.606.15-3.848-18.084a5.752 5.752 0 0 0 -4.685-4.481c-8.588-1.633-18.41-5.981-25.7-10.726a5.745 5.745 0 0 0 -6.592.235l-14.766 9.99-11.16-10.947 10.07-15.514a5.743 5.743 0 0 0 -.066-6.357 76.379 76.379 0 0 1 -10.661-25.838 5.747 5.747 0 0 0 -4.546-4.474l-17.8-3.43-.151-15.607 18.085-3.847a5.754 5.754 0 0 0 4.482-4.685c1.635-8.587 5.982-18.412 10.726-25.697a5.741 5.741 0 0 0 -.054-6.339l.009-.006-10.172-15.029 10.934-11.147 15.514 10.069a5.743 5.743 0 0 0 6.357-.066 76.391 76.391 0 0 1 25.843-10.662 5.747 5.747 0 0 0 4.474-4.546l3.43-17.8 15.606-.151 3.847 18.087a5.752 5.752 0 0 0 4.685 4.482 75.908 75.908 0 0 1 13.2 4.129zm-49.379 213.121v57.6l16.24-11.8a5.753 5.753 0 0 1 6.849-.073l16.862 12.251v-57.978zm-57.492 176.187a5.761 5.761 0 0 1 0-11.521h43.232a5.761 5.761 0 1 1 0 11.521zm0-26.45a5.76 5.76 0 1 1 0-11.52h43.232a5.76 5.76 0 1 1 0 11.52zm287.219-193.919c-7.5-8.364-18.416-12.585-31.026-12.585-12.915 0-24.861 4.41-33.207 13.151-18.494 19.368-14.585 56.521 1.056 76.8 17.081 22.145 44.094 22.145 61.174 0 8.24-10.683 13.338-25.54 13.338-42.038 0-15.628-4.236-27.408-11.335-35.326zm-160.052 249.249h-148.323a3.935 3.935 0 0 1 -3.909-3.909v-197.249a3.935 3.935 0 0 1 3.909-3.909h67.128v68.891h.008a5.776 5.776 0 0 0 9.127 4.658l22.1-16.056 22.367 16.251a5.76 5.76 0 0 0 9.39-4.473v-69.271h67.128a3.935 3.935 0 0 1 3.909 3.909v89.967a75.879 75.879 0 0 0 -52.833 72.074v39.117zm11.52 25.2h42.087v-30.515a5.761 5.761 0 0 1 11.521 0v30.515h124.666v-30.515a5.76 5.76 0 0 1 11.52 0v30.515h42.088v-64.317a64.281 64.281 0 0 0 -64.079-64.077h-103.722a64.282 64.282 0 0 0 -64.081 64.077z"
                fill="#3a8aaa"
                fill-rule="evenodd"
              ></path>
            </svg>
            All Vendors
          </h1>

          <p id="firsttagp">{cusList?.data?.count} Records</p>

          <SearchBox placeholder="Search In Vendor" onSearch={onSearch} />
        </div>

        <div id="buttonsdata">
          <SortBy2
            setSearchTrigger={setSearchTrigger}
            selectedSortBy={selectedSortBy}
            setSelectedSortBy={setSelectedSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            section="Vendor Name"
            sortById="display_name"
            resetPageIfNeeded={resetPageIfNeeded}
          />

          {/* <DatePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            setSpecificDate={setSpecificDate}
            setClearFilter={setClearFilter}
            setSearchTrigger={setSearchTrigger}
          /> */}
          <div className={`maincontainmiainx1`}>
            <div
              data-tooltip-content="Filter"
              data-tooltip-id="my-tooltip"
              data-tooltip-place="bottom"
              className="filtersorticos5w"
              id="filterButton"
              onClick={filterDropdown.handleToggle}
              ref={filterDropdown.buttonRef}
            >
              <img
                src={FilterIco}
                alt=""
                data-tooltip-content="Filter"
                data-tooltip-id="my-tooltip"
                data-tooltip-place="bottom"
              />
            </div>
            {filterDropdown?.isOpen && (
              <div className="" ref={filterDropdown.ref}>
                <div className="filter-container">
                  <label
                    className={
                      selectAllCustomer ? "active-filter" : "labelfistc51s"
                    }
                  >
                    <input
                      type="checkbox"
                      checked={selectAllCustomer}
                      // onChange={(e) => setSelectAllCustomer(e.target.checked)}
                      // onChange={(e) => handleAllItemsChange1(e.target.checked, "normal")}
                      onChange={(e) => handleAllVendorsChange(e.target.checked)}
                      hidden
                    />
                    All Vendors
                  </label>
                  {/* <label
                    className={`${overdue ? "active-filter" : "labelfistc51s"
                      } `}
                  >
                    <input
                      type="checkbox"
                      checked={overdue}
                      onChange={(e) => handleAllItemsChange1(e.target.checked, 'overdue')}
                      hidden
                    />
                    Overdue
                  </label> */}
                  {/* <div className="cusfilters12x2">
                    <p className="custtypestext4s">Vendor Type</p>
                    <div
                      className={`cusbutonscjks54 
                       
                      `}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={customerType === "Business"}
                          onChange={(e) =>
                            handleAllItemsChange1(e.target.checked, 'type', 'Business')
                          }
                        />
                        <span
                          className={`filter-button ${customerType === "Business" ? "selected" : ""
                            }`}

                        >
                          Business
                        </span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={customerType === "Individual"}
                          onChange={(e) =>
                            handleAllItemsChange1(e.target.checked, 'type', 'Individual')
                          }
                        />
                        <span
                          className={`filter-button ${customerType === "Individual" ? "selected" : ""
                            }`}

                        >
                          Individual
                        </span>
                      </label>
                    </div>
                  </div> */}
                  <div className={`cusfilters12x2`}>
                    <p className="custtypestext4s">Status</p>
                    <div
                      className={`cusbutonscjks54 
                       
                      `}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={status === "1"}
                          onChange={(e) =>
                            handleAllItemsChange1(
                              e.target.checked,
                              "status",
                              "1"
                            )
                          }
                        />
                        <span
                          className={`filter-button ${status === "active" ? "selected" : ""
                            }`}
                        >
                          Active
                        </span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={status === "0"}
                          onChange={(e) =>
                            handleAllItemsChange1(
                              e.target.checked,
                              "status",
                              "0"
                            )
                          }
                        />
                        <span
                          className={`filter-button ${status === "0" ? "selected" : ""
                            }`}
                        >
                          Inactive
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    className="buttonofapplyfilter"
                    onClick={handleApplyFilter}
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link className="linkx1" to={"/dashboard/create-vendor"}>
            New Vendor <GoPlus />
          </Link>
          <ResizeFL />

          {/* More dropdown */}
          <div className="maincontainmiainx1">
            <div
              className="mainx2"
              data-tooltip-content="More Options"
              data-tooltip-id="my-tooltip"
              data-tooltip-place="bottom"
              onClick={moreDropdown.handleToggle}
              ref={moreDropdown.buttonRef}
            >
              <img
                src={newmenuicoslz}
                alt=""
                data-tooltip-content="More Options"
                data-tooltip-place="bottom"
                data-tooltip-id="my-tooltip"
              />
            </div>
            {moreDropdown?.isOpen && (
              <div className="dropdowncontentofx35" ref={moreDropdown.ref}>
                <div
                  onClick={() => {
                    moreDropdown.handleToggle();
                    setShowImportPopup(true);
                  }}
                  className="dmncstomx1 xs2xs23"
                >
                  {otherIcons?.import_svg}
                  <div>Import Vendors</div>
                </div>

                <div className="dmncstomx1 xs2xs23" onClick={handleFileExport}>
                  {otherIcons?.export_svg}
                  Export Vendors
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="">
        <div id="middlesection">
          <div id="mainsectioncsls">
            <div id="leftsidecontentxls">
              <div
                id="item-listsforcontainer"
                className="listsectionsgrheigh"
                style={{ height: "unset" }}
              >
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
                    <div className="table-cellx12 x125cd01">
                      {/* <TbListDetails /> */}
                      Vendor Name
                    </div>

                    {/* <div className="table-cellx12 x125cd04">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        color={"#5d369f"}
                        fill={"none"}
                        className=""
                      >
                        <path
                          d="M12 2H6C3.518 2 3 2.518 3 5V22H15V5C15 2.518 14.482 2 12 2Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18 8H15V22H21V11C21 8.518 20.482 8 18 8Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 6L10 6M8 9L10 9M8 12L10 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.5 22V18C11.5 17.0572 11.5 16.5858 11.2071 16.2929C10.9142 16 10.4428 16 9.5 16H8.5C7.55719 16 7.08579 16 6.79289 16.2929C6.5 16.5858 6.5 17.0572 6.5 18V22"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                      TYPE
                    </div> */}
                    <div className="table-cellx12 x125cd02">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        color={"#5d369f"}
                        fill={"none"}
                        className=""
                      >
                        <path
                          d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M11 7L17 7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M7 7L8 7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M7 12L8 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M7 17L8 17"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M11 12L17 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M11 17L17 17"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      COMPANY NAME
                    </div>

                    <div className="table-cellx12 x125cd03">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        color={"#5d369f"}
                        fill={"none"}
                        className=""
                      >
                        <path
                          d="M12 22L10 16H2L4 22H12ZM12 22H16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 13V12.5C12 10.6144 12 9.67157 11.4142 9.08579C10.8284 8.5 9.88562 8.5 8 8.5C6.11438 8.5 5.17157 8.5 4.58579 9.08579C4 9.67157 4 10.6144 4 12.5V13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19 13C19 14.1046 18.1046 15 17 15C15.8954 15 15 14.1046 15 13C15 11.8954 15.8954 11 17 11C18.1046 11 19 11.8954 19 13Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M10 4C10 5.10457 9.10457 6 8 6C6.89543 6 6 5.10457 6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M14 17.5H20C21.1046 17.5 22 18.3954 22 19.5V20C22 21.1046 21.1046 22 20 22H19"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      EMAIL
                    </div>
                    <div className="table-cellx12 x125cd04">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        color={"#5d369f"}
                        fill={"none"}
                        className=""
                      >
                        <path
                          d="M15 3V21M15 3H10M15 3H21M10 12H7.5C5.01472 12 3 9.98528 3 7.5C3 5.01472 5.01472 3 7.5 3H10M10 12V3M10 12V21"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      WORK PHONE
                    </div>
                    <div className="table-cellx12 x125cd05">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        color={"#5d369f"}
                        fill={"none"}
                        className=""
                      >
                        <path
                          d="M12 22C16.4183 22 20 18.4183 20 14C20 8 12 2 12 2C11.6117 4.48692 11.2315 5.82158 10 8C8.79908 7.4449 8.5 7 8 5.75C6 8 4 11 4 14C4 18.4183 7.58172 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 17L14 13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 13H10.009M13.991 17H14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      PAYABLES
                    </div>
                    <div className="table-cellx12 x125cd06">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        color={"#5d369f"}
                        fill={"none"}
                        className=""
                      >
                        <path
                          d="M4.46334 4.5C4.145 4.62804 3.86325 4.78886 3.60746 4.99087C3.40678 5.14935 3.22119 5.32403 3.0528 5.5129C2 6.69377 2 8.46252 2 12C2 15.5375 2 17.3062 3.0528 18.4871C3.22119 18.676 3.40678 18.8506 3.60746 19.0091C4.86213 20 6.74142 20 10.5 20H13.5C16.4923 20 18.2568 20 19.5 19.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 4.01578C8.7277 4 9.55437 4 10.5 4H13.5C17.2586 4 19.1379 4 20.3925 4.99087C20.5932 5.14935 20.7788 5.32403 20.9472 5.5129C22 6.69377 22 8.46252 22 12C22 14.3126 22 15.8693 21.7058 17"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 2L22 22"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M2.5 9H9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21.5 9L13.5 9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      UNUSED CREDITS
                    </div>
                  </div>

                  {cusList?.loading || dataChanging === true ? (
                    <TableViewSkeleton />
                  ) : (
                    <>
                      {cusList?.data?.user?.length >= 1 ? (
                        <>
                          {cusList?.data?.user?.map((quotation, index) => (
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
                                  onChange={() =>
                                    handleCheckboxChange(quotation.id)
                                  }
                                />
                                <div className="checkmark"></div>
                              </div>
                              <div
                                onClick={() => handleRowClicked(quotation)}
                                className="table-cellx12 x125cd01"
                              >
                                {quotation.display_name || ""}
                              </div>
                              {/* <div
                                onClick={() => handleRowClicked(quotation)}
                                className="table-cellx12 x125cd02"
                              >
                                {quotation.customer_type || ""}
                              </div> */}
                              <div
                                onClick={() => handleRowClicked(quotation)}
                                className="table-cellx12 x125cd02"
                                data-tooltip-content={
                                  quotation.company_name || ""
                                }
                                data-tooltip-id="my-tooltip"
                              >
                                {quotation.company_name || ""}
                              </div>
                              <div
                                onClick={() => handleRowClicked(quotation)}
                                className="table-cellx12 x125cd03"
                              >
                                {quotation.email || ""}
                              </div>
                              <div
                                onClick={() => handleRowClicked(quotation)}
                                className="table-cellx12 x125cd04"
                              >
                                {quotation.work_phone || ""}
                              </div>
                              <div
                                onClick={() => handleRowClicked(quotation)}
                                className="table-cellx12 x125cd05"
                              >
                                {/* {quotation.first_name || ""} */}
                              </div>
                              <div
                                onClick={() => handleRowClicked(quotation)}
                                className="table-cellx12 x125cd06"
                              >
                                {/* {quotation.first_name || ""} */}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="notdatafound">
                          <iframe
                            src="https://lottie.host/embed/e8ebd6c5-c682-46b7-a258-5fcbef32b33e/PjfoHtpCIG.json"
                            frameBorder="0"
                          ></iframe>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <PaginationComponent
                itemList={cusList?.data?.count}
                // setDataChangingProp={handleDataChange}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                setSearchCall={setSearchTrigger}
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
                  <h2>Import Vendors</h2>

                  <form onSubmit={handleFileImport}>
                    <div className="midpopusec12x">
                      <div className="cardofselcetimage5xs">
                        {otherIcons?.drop_file_svg}
                        <h1>
                          Drop your file here, or{" "}
                          <label onClick={openFileDialog}>browse</label>{" "}
                        </h1>
                        <input
                          id="browse"
                          type="file"
                          accept=".xlsx"
                          ref={fileInputRef}
                          onChange={handleFileInputChange}
                          hidden
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Vendors;
