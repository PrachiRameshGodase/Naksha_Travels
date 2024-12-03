import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { IoPricetagsOutline, IoSearchOutline } from "react-icons/io5";
import TopLoadbar from "../../Components/Toploadbar/TopLoadbar";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { itemLists } from "../../Redux/Actions/listApisActions";
import TableViewSkeleton from "../../Components/SkeletonLoder/TableViewSkeleton";
import PaginationComponent from "../Common/Pagination/PaginationComponent";
import { otherIcons } from "../Helper/SVGIcons/ItemsIcons/Icons";
import { exportItems, importItems } from "../../Redux/Actions/itemsActions";
import { RxCross2 } from "react-icons/rx";
import MainScreenFreezeLoader from "../../Components/Loaders/MainScreenFreezeLoader";

import newmenuicoslz from "../../assets/outlineIcons/othericons/newmenuicoslz.svg";
import sortbyIco from "../../assets/outlineIcons/othericons/sortbyIco.svg";
import FilterIco from "../../assets/outlineIcons/othericons/FilterIco.svg";
import ResizeFL from "../../Components/ExtraButtons/ResizeFL";
import { Tooltip } from "react-tooltip";
import { OutsideClick } from "../Helper/ComponentHelper/OutsideClick";
import { showAmountWithCurrencySymbol } from "../Helper/HelperFunctions";

const Quotations = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dataChanging, setDataChanging] = useState(false);

  const itemListState = useSelector((state) => state?.itemList);
  const itemList = itemListState?.data?.item || [];
  const totalItems = itemListState?.data?.total_items || 0;
  const itemListLoading = itemListState?.loading || false;

  const [searchTerm, setSearchTerm] = useState("");
  const Navigate = useNavigate();

  const importItemss = useSelector((state) => state?.importItems);
  const exportItemss = useSelector((state) => state?.exportItems);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchCall, setSearchCall] = useState(false);

  // reset current page to 1 when any filters are applied
  const resetPageIfNeeded = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  };

  const handleCheckboxChange = (rowId) => {
    setSelectedRows((prevRows) =>
      prevRows.includes(rowId)
        ? prevRows.filter((id) => id !== rowId)
        : [...prevRows, rowId]
    );
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setSelectedRows(selectAll ? [] : itemList.map((row) => row.id));
  };

  const handleRowClicked = (quotation) => {
    Navigate(`/dashboard/item-details?id=${quotation.id}`);
  };

  const handleDataChange = (newValue) => {
    setDataChanging(newValue);
  };

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

  // filter/
  const [selectAllItems, setSelectAllItems] = useState(false);
  const [itemType, setItemType] = useState("");
  const [status, setStatus] = useState("");
  const [allFilters, setAllFilters] = useState({});

  const handleApplyFilter = () => {
    const filterValues = {
      is_is_item: selectAllItems ? 1 : "",
      active: status === "active" ? 1 : status === "inactive" ? 0 : "", // Set status based on selection
      type: itemType,
    };

    const filteredValues = Object.fromEntries(
      Object.entries(filterValues).filter(([_, value]) => value !== "")
    );

    const filterButton = document.getElementById("filterButton");
    if (itemType === "" && status === "") {
      filterButton.classList.remove("filter-applied");
    } else {
      filterButton.classList.add("filter-applied");
    }
    resetPageIfNeeded()
    filterDropdown.handleToggle();
    setAllFilters(filteredValues);
  };

  useEffect(() => {
    if (selectAllItems) {
      handleApplyFilter();
    }
  }, [selectAllItems]);

  const handleAllItemsChange = (checked) => {
    setSelectAllItems(checked);
    if (checked) {
      setItemType("");
      setStatus("");
    }
    resetPageIfNeeded()
  };
  // filter//

  //sortBy
  const [allSort, setAllSort] = useState({});
  const [normal, setNormal] = useState(false);
  const [names, setNames] = useState(false);
  const [price, setPrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  const handleApplySortBy = () => {
    const filterValues = {
      purchase_price:
        purchasePrice === "Ascending"
          ? "1"
          : purchasePrice === "Descending"
            ? "0"
            : "",
      price: price === "Ascending" ? "1" : price === "Descending" ? "0" : "",
      name: names ? "1" : "",
    };

    const filteredValues = Object.fromEntries(
      Object.entries(filterValues).filter(([_, value]) => value !== "")
    );

    const filterButton = document.getElementById("sortByButton");
    if (
      filterValues.price === "" &&
      filterValues.name === "" &&
      filterValues.purchase_price === ""
    ) {
      filterButton.classList.remove("filter-applied");
    } else {
      filterButton.classList.add("filter-applied");
    }
    resetPageIfNeeded()
    sortByDropdown?.handleToggle();
    setAllSort(filteredValues);
  };

  useEffect(() => {
    if (normal || names || price || purchasePrice) {
      handleApplySortBy();
    }
  }, [normal, names, price, purchasePrice]);

  const handleAllItemsChange1 = (checked, name, val) => {
    if (name === "price" && val) {
      if (checked) {
        setPrice(val);
        setNames(false);
        setNormal(false); // Disable "Normal" mode when a price filter is selected
      } else {
        setPrice(""); // Clear the price filter when unchecked

        // Check if both price filters are unchecked
        if (price === val) {
          setNormal(true); // Return to "Normal" mode if no price filter is selected
        }
      }
    } else if (name === "Normal") {
      setNormal(checked);
      if (checked) {
        setPrice("");
        setPurchasePrice("");
        setNames(false);
      }
    } else if (name === "name") {
      setNames(checked);
      if (checked) {
        setPrice("");
        setPurchasePrice("");
        setNormal(false);
      }
    } else if (name === "type" && val) {
      if (checked) {
        setItemType(val);
        setSelectAllItems(false);
      } else {
        setItemType("");
      }
    } else if (name === "status" && val) {
      if (checked) {
        setStatus(val);
        setSelectAllItems(false);
      } else {
        setStatus("");
      }
    }
  };
  //sortBy

  //serch
  const searchItems = () => {

    setSearchCall(!searchCall);
  };

  const handleSearch = (e) => {
    resetPageIfNeeded()
    setSearchTerm(e.target.value);
    setTimeout(() => {
      setSearchCall(!searchCall);
    }, 1000);
    // Add a class to the search input field when the search term is not empty
    const searchInput = document.getElementById("commonmcsearchbar");
    if (searchInput) {
      if (e.target.value) {
        searchInput.classList.add("search-applied");
      } else {
        searchInput.classList.remove("search-applied");
      }
    }
  };
  //serch

  // serch and filter


  //fetch all data
  useEffect(() => {
    let sendData = {
      fy: localStorage.getItem('FinancialYear'),
      noofrec: itemsPerPage,
      currentpage: searchTerm ? 1 : currentPage,
      active: 1,
    };
    if (searchTerm) {
      sendData.search = searchTerm;
    }

    if (Object.keys(allFilters).length > 0 || Object.keys(allSort).length > 0) {
      dispatch(
        itemLists({
          ...sendData,
          ...allFilters,
          ...allSort,
        })
      );
    } else {
      dispatch(itemLists(sendData));
    }

    setDataChanging(false);
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    searchCall,
    allSort,
    allFilters,
    callApi,
  ]);
  //fetch all data

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


  // outside close and open filter, sortBy and more dropdown
  const filterDropdown = OutsideClick();
  const sortByDropdown = OutsideClick();
  const moreDropdown = OutsideClick();
  // outside close and open filter and sortBy and more dropdown

  return (
    <>
      {(importItemss?.loading || exportItemss?.loading) && <MainScreenFreezeLoader />}
      <TopLoadbar />
      <Tooltip id="my-tooltip" className="extraclassoftooltip" />

      <div id="middlesection" className="">
        <div id="Anotherbox" className="formsectionx1">
          <div id="leftareax12">
            <h1 id="firstheading">
              <svg
                version="1.1"
                id="fi_891462"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 490.674 490.674"
                style={{ enableBackground: "new 0 0 490.674 490.674" }}
                xmlSpace="preserve"
              >
                <g>
                  <circle
                    style={{ fill: "#455A64" }}
                    cx="394.667"
                    cy="426.671"
                    r="53.333"
                  />
                  <circle
                    style={{ fill: "#455A64" }}
                    cx="181.333"
                    cy="426.671"
                    r="53.333"
                  />
                </g>
                <path
                  style={{ fill: "#FFC107" }}
                  d="M488,78.276c-2.026-2.294-4.94-3.607-8-3.605H96c-5.891-0.001-10.668,4.773-10.669,10.664c0,0.717,0.072,1.433,0.216,2.136l42.667,213.333c1.014,4.967,5.384,8.534,10.453,8.533c0.469,0.031,0.939,0.031,1.408,0l320-42.667c4.807-0.642,8.576-4.446,9.173-9.259l21.333-170.667C490.989,83.681,490.047,80.592,488,78.276z"
                />
                <g>
                  <path
                    style={{ fill: "#FAFAFA" }}
                    d="M181.333,266.671c-5.214-0.002-9.662-3.774-10.517-8.917l-21.333-128c-0.791-5.838,3.3-11.211,9.138-12.002c5.59-0.758,10.804,2.969,11.897,8.504l21.333,128c0.963,5.808-2.961,11.298-8.768,12.267C182.505,266.622,181.92,266.672,181.333,266.671z"
                  />
                  <path
                    style={{ fill: "#FAFAFA" }}
                    d="M234.667,256.004c-5.536,0.022-10.169-4.193-10.667-9.707l-10.667-117.333c-0.552-5.865,3.755-11.067,9.621-11.619c0.029-0.003,0.057-0.005,0.086-0.008c5.867-0.531,11.053,3.796,11.584,9.663c0,0,0,0.001,0,0.001l10.667,117.333c0.53,5.867-3.796,11.053-9.663,11.584c0,0-0.001,0-0.001,0L234.667,256.004z"
                  />
                  <path
                    style={{ fill: "#FAFAFA" }}
                    d="M288,245.337c-5.891,0-10.667-4.776-10.667-10.667V128.004c0-5.891,4.776-10.667,10.667-10.667c5.891,0,10.667,4.776,10.667,10.667v106.667C298.667,240.562,293.891,245.337,288,245.337z"
                  />
                  <path
                    style={{ fill: "#FAFAFA" }}
                    d="M341.333,234.671h-1.195c-5.858-0.62-10.104-5.872-9.484-11.731c0.004-0.036,0.008-0.073,0.012-0.109l10.667-96c0.692-5.867,5.963-10.093,11.84-9.493c5.855,0.648,10.077,5.919,9.43,11.775c0,0,0,0.001,0,0.001l-10.667,96C351.368,230.543,346.793,234.667,341.333,234.671z"
                  />
                  <path
                    style={{ fill: "#FAFAFA" }}
                    d="M394.667,224.004c-5.891-0.002-10.665-4.779-10.664-10.67c0-0.869,0.107-1.735,0.317-2.578l21.333-85.333c1.293-5.747,7.001-9.358,12.748-8.065c5.747,1.293,9.358,7.001,8.065,12.748c-0.036,0.161-0.076,0.321-0.12,0.48l-21.333,85.333C403.829,220.669,399.562,224.003,394.667,224.004z"
                  />
                </g>
                <path
                  style={{ fill: "#455A64" }}
                  d="M437.333,352.004H191.125c-35.558-0.082-66.155-25.16-73.216-60.011L65.92,32.004H10.667C4.776,32.004,0,27.228,0,21.337s4.776-10.667,10.667-10.667h64c5.07-0.001,9.439,3.566,10.453,8.533l53.717,268.587c5.035,24.896,26.888,42.817,52.288,42.88h246.208c5.891,0,10.667,4.776,10.667,10.667C448,347.228,443.224,352.004,437.333,352.004z"
                />
              </svg>
              All Items
            </h1>
            <p id="firsttagp">{totalItems} Records</p>
            <div id="searchbox">
              <input
                id="commonmcsearchbar" // Add an ID to the search input field
                type="text"
                placeholder="Search In Items"
                value={searchTerm}
                onChange={handleSearch}
                autoComplete="off"
              />

              <IoSearchOutline
                onClick={searchItems}
                data-tooltip-content="Search"
                data-tooltip-id="my-tooltip"
              />
            </div>
          </div>

          <div id="buttonsdata">
            <div className="filtersortconta">
              <div className="maincontainmiainx1">
                <div
                  className="filtersorticos5w"
                  id="sortByButton"
                  onClick={sortByDropdown?.handleToggle}
                  ref={sortByDropdown?.buttonRef}
                >
                  {/* <img src="/Icons/sort-size-down.svg" alt="" /> */}
                  <img
                    src={sortbyIco}
                    alt=""
                    data-tooltip-content="Sort By"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-place="bottom"
                  />
                  {/* <p>Sort by</p> */}
                </div>
                {sortByDropdown?.isOpen && (
                  <div className="" ref={sortByDropdown?.ref}>
                    <div className="filter-container">
                      <h1>
                        Sort By
                        <img src={sortbyIco} alt="" />
                      </h1>
                      <div className="filtezxe41cwws5w">
                        <label
                          className={normal ? "active-filter" : "labelfistc51s"}
                        >
                          <input
                            type="checkbox"
                            checked={normal}
                            // onChange={(e) => setselectAllItems(e.target.checked)}
                            onChange={(e) =>
                              handleAllItemsChange1(e.target.checked, "Normal")
                            }
                            hidden
                          />
                          Normal
                        </label>

                        <label
                          className={`${names ? "active-filter" : "labelfistc51s"
                            } `}
                        >
                          <input
                            type="checkbox"
                            checked={names}
                            onChange={(e) =>
                              handleAllItemsChange1(e.target.checked, "name")
                            }
                            hidden
                          />{" "}
                          Name
                        </label>
                      </div>

                      <div className="cusfilters12x2">
                        <p className="custtypestext4s">
                          <IoPricetagsOutline />
                          Price
                        </p>
                        <div className={`cusbutonscjks54 }`}>
                          <label>
                            <input
                              type="checkbox"
                              checked={price === "Ascending"}
                              onChange={(e) =>
                                handleAllItemsChange1(
                                  e.target.checked,
                                  "price",
                                  "Ascending"
                                )
                              }
                            />
                            <span
                              className={`filter-button ${price === "Ascending" ? "selected" : ""
                                }`}
                            >
                              Ascending
                            </span>
                          </label>

                          <label>
                            <input
                              type="checkbox"
                              checked={price === "Descending"}
                              onChange={(e) =>
                                handleAllItemsChange1(
                                  e.target.checked,
                                  "price",
                                  "Descending"
                                )
                              }
                            />
                            <span
                              className={`filter-button ${price === "Descending" ? "selected" : ""
                                }`}
                            >
                              Descending
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={`maincontainmiainx1`}>
                <div
                  className="labelfistc51s filtersorticos5w"
                  id="filterButton"
                  onClick={filterDropdown?.handleToggle}
                  ref={filterDropdown?.buttonRef}
                >
                  {/* <img src="/Icons/filters.svg" alt="" /> */}
                  <img
                    src={FilterIco}
                    alt=""
                    data-tooltip-content="Filter"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-place="bottom"
                  />
                  {/* <p>Filter</p> */}
                </div>
                {filterDropdown?.isOpen && (
                  <div className="" ref={filterDropdown?.ref}>
                    <div className="filter-container">
                      <h1>
                        Filters
                        <img src={FilterIco} alt="" />
                      </h1>
                      <div className="filtezxe41cwws5w">
                        <label
                          className={
                            selectAllItems ? "active-filter" : "labelfistc51s"
                          }


                        >
                          <input
                            type="checkbox"
                            checked={selectAllItems}
                            onChange={(e) =>
                              handleAllItemsChange(e.target.checked)
                            }
                            hidden
                          />
                          All Items
                        </label>
                      </div>

                      <div className="cusfilters12x2">
                        <p className="custtypestext4s">Item Type</p>
                        <div className={`cusbutonscjks54`}>
                          <label htmlFor="serviceCheckbox2">
                            <input
                              id="serviceCheckbox2"
                              type="checkbox"
                              checked={itemType === "Product"}
                              onChange={(e) =>
                                handleAllItemsChange1(
                                  e.target.checked,
                                  "type",
                                  "Product"
                                )
                              }
                            />
                            <span
                              className={`filter-button ${itemType === "Product" ? "selected" : ""
                                }`}
                            >
                              Products
                            </span>
                          </label>
                          <label htmlFor="serviceCheckbox">
                            <input
                              id="serviceCheckbox"
                              type="checkbox"
                              checked={itemType === "Service"}
                              onChange={(e) =>
                                handleAllItemsChange1(
                                  e.target.checked,
                                  "type",
                                  "Service"
                                )
                              }
                            />
                            <span
                              className={`filter-button ${itemType === "Service" ? "selected" : ""
                                }`}
                            >
                              Services
                            </span>
                          </label>


                          <label htmlFor="serviceCheckbox3">
                            <input
                              id="serviceCheckbox3"
                              type="checkbox"
                              checked={itemType === "Raw"}
                              onChange={(e) =>
                                handleAllItemsChange1(
                                  e.target.checked,
                                  "type",
                                  "Raw"
                                )
                              }
                            />
                            <span
                              className={`filter-button ${itemType === "Raw" ? "selected" : ""
                                }`}
                            >
                              Raw Material
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className={`cusfilters12x2`}>
                        <p className="custtypestext4s">Status</p>
                        <div className={`cusbutonscjks54`}>
                          <label htmlFor="serviceCheckbox4">
                            <input
                              id="serviceCheckbox4"
                              type="checkbox"
                              checked={status === "active"}
                              // onChange={(e) => setStatus(e.target.checked ? "active" : "")}
                              onChange={(e) =>
                                handleAllItemsChange1(
                                  e.target.checked,
                                  "status",
                                  "active"
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
                          <label htmlFor="serviceCheckbox5">
                            <input
                              id="serviceCheckbox5"
                              type="checkbox"
                              checked={status === "inactive"}
                              // onChange={(e) => setStatus(e.target.checked ? "inactive" : "")}
                              onChange={(e) =>
                                handleAllItemsChange1(
                                  e.target.checked,
                                  "status",
                                  "inactive"
                                )
                              }
                            />
                            <span
                              className={`filter-button ${status === "inactive" ? "selected" : ""
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
            </div>

            <Link className="linkx1" to={"/dashboard/create-items"}>
              New Item <GoPlus />
            </Link>
            {/* More dropdown */}
            <div className="maincontainmiainx1">
              <div
                className="mainx2"
                onClick={moreDropdown?.handleToggle}
                ref={moreDropdown?.ref}
                data-tooltip-content="Import-Export"
                data-tooltip-id="my-tooltip"
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
                <div
                  className="dropdowncontentofx35"
                  ref={moreDropdown?.buttonRef}
                >
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
            <ResizeFL
              data-tooltip-content="Expand"
              data-tooltip-id="my-tooltip"
            />
          </div>
        </div>
        {/* <div className="bordersinglestroke"></div> */}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={20}
                      height={20}
                      color={"#5D369F"}
                      fill={"none"}
                    >
                      <path
                        d="M18 2V4M6 2V4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 8H21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Name
                  </div>
                  <div className="table-cellx12 quotiosalinvlisxs2_item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={20}
                      height={20}
                      color={"#5D369F"}
                      fill={"none"}
                    >
                      <path
                        d="M3 10H21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 6L17 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 13V11C21 6.75736 21 4.63604 19.682 3.31802C18.364 2 16.2426 2 12 2C7.75736 2 5.63604 2 4.31802 3.31802C3 4.63604 3 6.75736 3 11V13C3 17.2426 3 19.364 4.31802 20.682C5.63604 22 7.75736 22 12 22C16.2426 22 18.364 22 19.682 20.682C21 19.364 21 17.2426 21 13Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7 14H7.52632M11.7368 14H12.2632M16.4737 14H17"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 18H7.52632M11.7368 18H12.2632M16.4737 18H17"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Category/Sub-Category
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={20}
                      height={20}
                      color={"#5d369f"}
                      fill={"none"}
                    >
                      <path
                        d="M16.3083 4.38394C15.7173 4.38394 15.4217 4.38394 15.1525 4.28405C15.1151 4.27017 15.0783 4.25491 15.042 4.23828C14.781 4.11855 14.5721 3.90959 14.1541 3.49167C13.1922 2.52977 12.7113 2.04882 12.1195 2.00447C12.04 1.99851 11.96 1.99851 11.8805 2.00447C11.2887 2.04882 10.8077 2.52977 9.84585 3.49166C9.42793 3.90959 9.21897 4.11855 8.95797 4.23828C8.92172 4.25491 8.88486 4.27017 8.84747 4.28405C8.57825 4.38394 8.28273 4.38394 7.69171 4.38394H7.58269C6.07478 4.38394 5.32083 4.38394 4.85239 4.85239C4.38394 5.32083 4.38394 6.07478 4.38394 7.58269V7.69171C4.38394 8.28273 4.38394 8.57825 4.28405 8.84747C4.27017 8.88486 4.25491 8.92172 4.23828 8.95797C4.11855 9.21897 3.90959 9.42793 3.49166 9.84585C2.52977 10.8077 2.04882 11.2887 2.00447 11.8805C1.99851 11.96 1.99851 12.04 2.00447 12.1195C2.04882 12.7113 2.52977 13.1922 3.49166 14.1541C3.90959 14.5721 4.11855 14.781 4.23828 15.042C4.25491 15.0783 4.27017 15.1151 4.28405 15.1525C4.38394 15.4217 4.38394 15.7173 4.38394 16.3083V16.4173C4.38394 17.9252 4.38394 18.6792 4.85239 19.1476C5.32083 19.6161 6.07478 19.6161 7.58269 19.6161H7.69171C8.28273 19.6161 8.57825 19.6161 8.84747 19.7159C8.88486 19.7298 8.92172 19.7451 8.95797 19.7617C9.21897 19.8815 9.42793 20.0904 9.84585 20.5083C10.8077 21.4702 11.2887 21.9512 11.8805 21.9955C11.96 22.0015 12.04 22.0015 12.1195 21.9955C12.7113 21.9512 13.1922 21.4702 14.1541 20.5083C14.5721 20.0904 14.781 19.8815 15.042 19.7617C15.0783 19.7451 15.1151 19.7298 15.1525 19.7159C15.4217 19.6161 15.7173 19.6161 16.3083 19.6161H16.4173C17.9252 19.6161 18.6792 19.6161 19.1476 19.1476C19.6161 18.6792 19.6161 17.9252 19.6161 16.4173V16.3083C19.6161 15.7173 19.6161 15.4217 19.7159 15.1525C19.7298 15.1151 19.7451 15.0783 19.7617 15.042C19.8815 14.781 20.0904 14.5721 20.5083 14.1541C21.4702 13.1922 21.9512 12.7113 21.9955 12.1195C22.0015 12.04 22.0015 11.96 21.9955 11.8805C21.9512 11.2887 21.4702 10.8077 20.5083 9.84585C20.0904 9.42793 19.8815 9.21897 19.7617 8.95797C19.7451 8.92172 19.7298 8.88486 19.7159 8.84747C19.6161 8.57825 19.6161 8.28273 19.6161 7.69171V7.58269C19.6161 6.07478 19.6161 5.32083 19.1476 4.85239C18.6792 4.38394 17.9252 4.38394 16.4173 4.38394H16.3083Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8.5 16.5C9.19863 15.2923 10.5044 14.4797 12 14.4797C13.4956 14.4797 14.8014 15.2923 15.5 16.5M14 10C14 11.1046 13.1046 12 12 12C10.8955 12 10 11.1046 10 10C10 8.89544 10.8955 8.00001 12 8.00001C13.1046 8.00001 14 8.89544 14 10Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    SKU
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={20}
                      height={20}
                      color={"#5d369f"}
                      fill={"none"}
                    >
                      <path
                        d="M18.4167 8.14815C18.4167 5.85719 15.5438 4 12 4C8.45617 4 5.58333 5.85719 5.58333 8.14815C5.58333 10.4391 7.33333 11.7037 12 11.7037C16.6667 11.7037 19 12.8889 19 15.8519C19 18.8148 15.866 20 12 20C8.13401 20 5 18.1428 5 15.8519"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 2V22"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Type
                  </div>
                  <div className="table-cellx12 quotiosalinvlisxs5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={20}
                      height={20}
                      color={"#5d369f"}
                      fill={"none"}
                    >
                      <path
                        d="M13 21.9506C12.6711 21.9833 12.3375 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.3375 21.9833 12.6711 21.9506 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M7.5 17C8.90247 15.5311 11.0212 14.9041 13 15.1941M14.4951 9.5C14.4951 10.8807 13.3742 12 11.9915 12C10.6089 12 9.48797 10.8807 9.48797 9.5C9.48797 8.11929 10.6089 7 11.9915 7C13.3742 7 14.4951 8.11929 14.4951 9.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="18.5"
                        cy="18.5"
                        r="3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Stock QTY
                  </div>
                  <div className="table-cellx12 quotiosalinvlisxs5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={20}
                      height={20}
                      color={"#5d369f"}
                      fill={"none"}
                    >
                      <path
                        d="M13 21.9506C12.6711 21.9833 12.3375 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.3375 21.9833 12.6711 21.9506 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M7.5 17C8.90247 15.5311 11.0212 14.9041 13 15.1941M14.4951 9.5C14.4951 10.8807 13.3742 12 11.9915 12C10.6089 12 9.48797 10.8807 9.48797 9.5C9.48797 8.11929 10.6089 7 11.9915 7C13.3742 7 14.4951 8.11929 14.4951 9.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="18.5"
                        cy="18.5"
                        r="3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Tax Rate
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs6_item">
                    <p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={20}
                        height={20}
                        color={"#5d369f"}
                        fill={"none"}
                      >
                        <path
                          d="M13 21.9506C12.6711 21.9833 12.3375 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.3375 21.9833 12.6711 21.9506 13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M7.5 17C8.90247 15.5311 11.0212 14.9041 13 15.1941M14.4951 9.5C14.4951 10.8807 13.3742 12 11.9915 12C10.6089 12 9.48797 10.8807 9.48797 9.5C9.48797 8.11929 10.6089 7 11.9915 7C13.3742 7 14.4951 8.11929 14.4951 9.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="18.5"
                          cy="18.5"
                          r="3.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                      Price
                    </p>
                  </div>
                </div>

                {itemListLoading || dataChanging ? (
                  <TableViewSkeleton />
                ) : (
                  <>
                    {itemList?.map((quotation, index) => (
                      <div
                        className={`table-rowx12 ${selectedRows.includes(quotation.id)
                          ? "selectedresult"
                          : ""
                          }`}
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
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content={quotation?.name}
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs1"
                        >
                          {quotation.name}
                        </div>

                        <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs2_item"
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content={`${quotation?.category?.name || ""
                            }${quotation?.sub_category?.name
                              ? ` / ${quotation?.sub_category?.name}`
                              : ""
                            }`}
                        >
                          {`${quotation?.category?.name || ""}${quotation?.sub_category?.name
                            ? ` / ${quotation?.sub_category?.name}`
                            : ""
                            }`}
                        </div>
                        <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs3"
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content={quotation?.sku}
                        >
                          {quotation?.sku || ""}
                        </div>
                        <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs4"
                        >
                          {quotation?.type === "Raw"
                            ? "Raw Material"
                            : quotation?.type || ""}
                        </div>
                        <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs5"
                        >
                          <span
                            style={{
                              color: quotation?.stock < 0 ? "red" : "inherit",
                            }}
                          >
                            {quotation?.stock || 0.0}
                          </span>
                        </div>
                        <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs5"
                        >
                          {quotation?.tax_rate
                            ? `${parseInt(quotation.tax_rate, 10)} %`
                            : ""}
                        </div>
                        <div
                          onClick={() => handleRowClicked(quotation)}
                          className="table-cellx12 quotiosalinvlisxs5_item"
                        >
                          <p>
                            {" "}
                            {showAmountWithCurrencySymbol(quotation?.price)}
                          </p>
                        </div>
                      </div>
                    ))}

                    <PaginationComponent
                      itemList={totalItems}
                      setDataChangingProp={handleDataChange}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                      setItemsPerPage={setItemsPerPage}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
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

export default Quotations;
