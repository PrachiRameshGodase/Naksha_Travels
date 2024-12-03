import React, { useState, useEffect, useRef } from "react";

import { TbListDetails } from "react-icons/tb";
import { fetchMasterData } from "../../Redux/Actions/globalActions";
import { useDispatch, useSelector } from "react-redux";
import {
  accountLists,
  vendorsLists,
} from "../../Redux/Actions/listApisActions";
import { otherIcons } from "../Helper/SVGIcons/ItemsIcons/Icons";
import {
  items_Table_Detail_Transction_Icon,
  warehouse_Table_Detail_Transction_Icon,
} from "../Helper/SVGIcons/ItemsIcons/ItemsTableIcons";
import NoDataFound from "../../Components/NoDataFound/NoDataFound";
import { Link, useNavigate } from "react-router-dom";
import { formatDate3 } from "../Helper/DateFormat";
import sortbyIco from "../../assets/outlineIcons/othericons/sortbyIco.svg";
import FilterIco from "../../assets/outlineIcons/othericons/FilterIco.svg";
import { RiSearch2Line } from "react-icons/ri";
import PaginationComponent from "../Common/Pagination/PaginationComponent";

import calendaricofillx5 from "../../assets/outlineIcons/othericons/calendaricofillx5.svg";

import overviewIco from "../../assets/outlineIcons/othericons/overviewIco.svg";
import stocktransactionIco from "../../assets/outlineIcons/othericons/stocktransactionIco.svg";
import activityIco from "../../assets/outlineIcons/othericons/activityIco.svg";
import { activityTransactionAction, stockTransactionAction } from "../../Redux/Actions/itemsActions";
import WarehouseInformation from "./ShowAllWarehouses/WarehouseInformation";
import { RxCross2 } from "react-icons/rx";
import ShowMastersValue from "../Helper/ShowMastersValue";
import {
  showAmountWithCurrencySymbol,
  showRateWithPercent,
} from "../Helper/HelperFunctions";
import { OutsideClick } from "../Helper/ComponentHelper/OutsideClick";
import TableViewSkeleton from "../../Components/SkeletonLoder/TableViewSkeleton"

const InsideItemDetailsBox = ({
  itemDetails,
  preferred_vendor,
  warehouseData,
}) => {
  // Helper function to display the value or '' if it's null/empty
  const displayValue = (value) => (value ? value : "");
  const [activeSection, setActiveSection] = useState("overview");
  const cusList = useSelector((state) => state?.vendorList);
  const itemStockeducer = useSelector((state) => state?.itemStock);
  const stockDetails = itemStockeducer?.data?.stock_details;
  const activity = useSelector((state) => state?.activity);


  const [popupImageUrl, setPopupImageUrl] = useState(""); // State to store the image URL
  const [showPopup, setShowPopup] = useState(""); // State to store the image URL
  const popupRef = useRef();
  // Refs for dropdowns
  const filterDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  const handleClickOutside = (event) => {
    if (
      sortDropdownRef.current &&
      !sortDropdownRef.current.contains(event.target)
    ) {
      setIsSortByDropdownOpen(false);
    }
    if (
      filterDropdownRef.current &&
      !filterDropdownRef.current.contains(event.target)
    ) {
      setIsFilterDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility

  const dispatch = useDispatch();
  const masterData = useSelector((state) => state?.masterData?.masterData);
  const accList = useSelector((state) => state?.accountList);

  const [salesAccountName, setSalesAccountName] = useState("");
  const [purchaseAccountName, setPurchaseAccountName] = useState("");

  useEffect(() => {
    const salesAccount = accList?.data?.accounts?.find(
      (account) => account.id == itemDetails?.sale_acc_id
    );
    const purchaseAccount = accList?.data?.accounts?.find(
      (account) => account.id == itemDetails?.purchase_acc_id
    );
    if (salesAccount) {
      setSalesAccountName(salesAccount?.account_name);
      setPurchaseAccountName(purchaseAccount?.account_name);
    }
  }, [accList, itemDetails]);


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dataChanging, setDataChanging] = useState(false);
  // serach and sortby

  //serch
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCall, setSearchCall] = useState(false);

  const searchItems = () => {
    setSearchCall(!searchCall);
  };

  const handleSearch = (e) => {
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

  // sortBy
  const sortByDropdown = OutsideClick();
  const sortDropdownRef = useRef(null);

  const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState("Normal");
  const currentDate = new Date().toISOString().slice(0, 10);

  const [custom_date, setCustom_date] = useState(""); // Initial state is an empty string
  const [fromDate, setFromDate] = useState(currentDate); // Initial state is an empty string
  const [toDate, setToDate] = useState(""); // Initial state is an empty string

  const handleSortBySelection = (sortBy) => {
    setSelectedSortBy(sortBy);
    sortByDropdown.handleToggle();
    const sortByButton = document?.getElementById("sortByButton");
    if (sortByButton) {
      if (sortBy !== "Normal") {
        sortByButton?.classList.add("filter-applied");
      } else {
        sortByButton?.classList.remove("filter-applied");
      }
    }
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setCustom_date(selectedDate); // Update the date state here
    setSelectedSortBy("custom_date");
    sortByDropdown.handleToggle();
    sortByButton.classList.add("filter-applied");
  };
  const handleDateRangeFrom = (event) => {
    const selectedDate = event.target.value;
    setFromDate(selectedDate); // Update the date state here
    sortByButton.classList.add("filter-applied");
  };

  const handleDateRangeTo = (event) => {
    const selectedDate = event.target.value;
    setToDate(selectedDate); // Update the date state here
    setSelectedSortBy("toDate");
    sortByDropdown.handleToggle();
    sortByButton.classList.add("filter-applied");
  };
  //sortby

  // serach and sortby
  const handleDataChange = (newValue) => {
    setDataChanging(newValue);
  };

  const createSendData = () => {
    const sendData = {
      item_id: itemDetails?.id,
      fy: localStorage.getItem("FinancialYear"),
      currentpage: searchTerm ? 1 : currentPage,
    };

    switch (selectedSortBy) {
      case "Name":
        sendData.name = 1;
        break;
      case "custom_date":
        sendData.custom_date = custom_date;
        break;
      case "toDate":
        sendData.fromDate = fromDate;
        sendData.toDate = toDate;
        break;
      default:
    }

    if (searchTerm) {
      sendData.search = searchTerm;
    }

    return sendData;
  };

  const filterActivity = () => {
    dispatch(activityTransactionAction(createSendData()));
  };

  const filterTransactions = () => {
    dispatch(stockTransactionAction(createSendData()));
  };

  useEffect(() => {

    if (activeSection === "stock_history") {
      filterTransactions();
    }
    if (activeSection === "activity") {
      filterActivity();
    }

  }, [currentPage, itemsPerPage, toDate, selectedSortBy, searchCall]);



  useEffect(() => {

    dispatch(vendorsLists());
    dispatch(accountLists());
    dispatch(activityTransactionAction(createSendData()));
    dispatch(stockTransactionAction(createSendData()));

  }, [dispatch]);

  function getDisplayDate(stock) {
    if (!stock) {
      return formatDate3(new Date()); // Return current date if transaction date is not provided
    } else {
      return formatDate3(new Date(stock)); // Return formatted transaction date
    }
  }

  return (
    <div id="itemsdetailsrowskl" className="secondinsidedatax15s">
      <div className="buttonscontainxs2">
        <div
          className={`divac12cs32 ${activeSection === "overview" ? "activediv12cs" : ""
            }`}
          onClick={() => setActiveSection("overview")}
        >
          <img src={overviewIco} alt="" />
          Overview
        </div>
        {/* <div
          className={`divac12cs32 ${activeSection === 'transaction' ? 'activediv12cs' : ''}`}
          onClick={() => setActiveSection('transaction')}
        >
          Transaction
        </div> */}
        <div
          className={`divac12cs32 ${activeSection === "stock_history" ? "activediv12cs" : ""
            }`}
          onClick={() => setActiveSection("stock_history")}
        >
          <img src={stocktransactionIco} alt="" />
          Stock Transaction
        </div>
        <div
          className={`divac12cs32 ${activeSection === "activity" ? "activediv12cs" : ""
            }`}
          onClick={() => setActiveSection("activity")}
        >
          <img src={activityIco} alt="" />
          Activitiy
        </div>
      </div>
      <div className="insidcontain">

        {/* over view */}
        {activeSection === "overview" && (
          <>
            <div className="inidbx1">
              <div className="inidbx1s1">
                <div className="inidbs1x1a1">
                  {otherIcons?.information_svg}
                  Item Information
                </div>

                <ul style={{ width: "453px" }}>
                  <li>
                    <span>Item Type</span>
                    <h1>:</h1>
                    <p>
                      {displayValue(
                        itemDetails?.type === "Raw"
                          ? "Raw Material"
                          : itemDetails?.type
                      )}
                    </p>
                  </li>
                  <li>
                    <span>Stock</span>
                    <h1>:</h1>
                    <p>
                      <span
                        style={{
                          color: itemDetails?.stock < 0 ? "red" : "inherit",
                        }}
                      >
                        {itemDetails?.stock || 0.0}
                      </span>{" "}
                      &nbsp; QTY
                    </p>
                  </li>
                  <li>
                    <span>Catogory</span>
                    <h1>:</h1>
                    <p>{displayValue(itemDetails?.category?.name || "")}</p>
                  </li>
                  <li>
                    <span>Sub-Category</span>
                    <h1>:</h1>
                    <p>{displayValue(itemDetails?.sub_category?.name
                    )}</p>
                  </li>
                  <li>
                    <span>SKU</span>
                    <h1>:</h1>
                    <p>{displayValue(itemDetails?.sku)}</p>
                  </li>
                  <li>
                    <span>Unit</span>
                    <h1>:</h1>
                    <p>
                      {" "}
                      <ShowMastersValue type="2" id={itemDetails?.unit} />
                    </p>
                  </li>
                  <li>
                    <span>HSN Code</span>
                    <h1>:</h1>
                    <p>{itemDetails?.hsn_code?.toUpperCase()}</p>
                  </li>
                  <li>
                    <span>Tag ID</span>
                    <h1>:</h1>

                    <p> {itemDetails?.tag_ids}</p>
                  </li>
                  <li>
                    <span>Tax Rate</span>
                    <h1>:</h1>
                    <p> {showRateWithPercent(itemDetails?.tax_rate)}</p>
                  </li>
                  <li>
                    <span>Attachment</span>
                    <h1>:</h1>
                    <p className="file_att_21"
                      onClick={() => {
                        setShowPopup(true);
                        setPopupImageUrl(itemDetails?.image_url); // Set the image URL for the popup
                      }}>  {otherIcons?.file_svg} File Attached</p>
                  </li>
                  <li>
                    <span>Remark</span>
                    <h1>:</h1>
                    <p> {(itemDetails?.description)}</p>
                  </li>
                </ul>
              </div>
              <div id="coninsd2x3s">
                {itemDetails?.price ||
                  salesAccountName ||
                  itemDetails?.sale_description ? (
                  <div className="inidbx1s2 inidbx1s2x21s5" style={{ width: "fit-content", marginRight: "26%" }}>
                    <div className="inidbs1x1a1">
                      {otherIcons?.selling_svg}
                      Selling Information
                    </div>
                    <ul>
                      <li>
                        <span>Selling Price</span>
                        <h1>:</h1>
                        <p>
                          {showAmountWithCurrencySymbol(itemDetails?.price)}
                        </p>
                      </li>
                      <li>
                        <span>Sales Account</span>
                        <h1>:</h1>
                        <p>
                          {displayValue(
                            itemDetails?.sale_account?.account_name
                          )}
                        </p>
                      </li>
                      <li>
                        <p style={{ marginRight: "49px" }}>Description</p>
                        <h1 >:</h1>
                        <p title={itemDetails?.sale_description || ""}>
                          {((itemDetails?.sale_description))}
                        </p>
                      </li>
                    </ul>
                  </div>
                ) : (
                  ""
                )}
                {itemDetails?.purchase_price ||
                  purchaseAccountName ||
                  itemDetails?.purchase_description ? (
                  <div className="inidbx1s2 inidbx1s2x21s6" style={{ width: "fit-content", marginRight: "26%" }}>
                    <div >
                      <div className="inidbs1x1a1">
                        {otherIcons?.purchase_svg}
                        Purchase Information
                      </div>
                      <ul>
                        <li>
                          <span>Purchase Price</span>
                          <h1>:</h1>
                          <p>
                            {showAmountWithCurrencySymbol(
                              itemDetails?.purchase_price
                            )}
                          </p>
                        </li>
                        <li>
                          <span>Purchase Account</span>
                          <h1>:</h1>
                          <p>
                            {displayValue(
                              itemDetails?.purchase_account?.account_name
                            )}
                          </p>
                        </li>

                        <li><p style={{ marginRight: "3px" }}>Preferred Vendors</p><h1>:</h1>
                          {preferred_vendor?.length >= 1
                            ?
                            <p style={{ width: "68%" }}>
                              {
                                preferred_vendor &&

                                preferred_vendor?.map((val, index) => (
                                  <p className="primarycolortext" key={index} style={{ display: "inline" }}>
                                    {val?.display_name}{index < preferred_vendor?.length - 1 && ', '}
                                  </p>
                                ))
                              }
                            </p>
                            :
                            <p className="primarycolortext">

                            </p>
                          }
                        </li>
                        <li><p style={{ marginRight: "48px" }}>Description</p><h1>:</h1><p>{displayValue(itemDetails?.purchase_description)}</p></li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="inidbx1s2 inidbx1s2x21s6">
                  {/* <>
                    <div className="inidbs1x1a1">
                      {otherIcons?.purchase_svg}
                      Warehouse Details
                    </div>
                    <ul>
                      <li><span>Purchase Price</span><h1>:</h1><p>{displayValue(itemDetails?.purchase_price)}</p></li>
                      <li><span>Purchase Account</span><h1>:</h1><p>{displayValue(itemDetails?.purchase_account?.account_name)}</p></li>

                      <li><span>Preferred Vendors</span><h1>:</h1>
                        {preferred_vendor?.length >= 1
                          ?
                          <>
                            {
                              preferred_vendor &&
                              preferred_vendor?.map((val, index) => (
                                <p className="primarycolortext" key={index}>
                                  {val?.display_name}{index < preferred_vendor?.length - 1 && ','}
                                </p>
                              ))
                            }
                          </>
                          :
                          <p className="primarycolortext">
                            NA
                          </p>
                        }

                      </li>
                      <li><span>Description</span><h1>:</h1><p>{displayValue(itemDetails?.purchase_description)}</p></li>

                    </ul>
                  </> */}
                </div>
              </div>

              {showPopup && (
                <div className="mainxpopups2" ref={popupRef}>
                  <div className="popup-content02">
                    <span
                      className="close-button02"
                      onClick={() => setShowPopup(false)}
                    >
                      <RxCross2 />
                    </span>
                    <img
                      src={popupImageUrl}
                      name="popup_image"
                      alt="Popup Image"
                      height={500}
                      width={500}
                    />
                  </div>
                </div>
              )}
            </div>
            <WarehouseInformation
              warehouseData={warehouseData}
              itemDetails={itemDetails}
            />
          </>
        )}
        {/* over view */}



        {activeSection === "transaction" && (
          <div className="inidbx2_stock">
            <div className="notdatafound">
              <iframe
                src="https://lottie.host/embed/e8ebd6c5-c682-46b7-a258-5fcbef32b33e/PjfoHtpCIG.json"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        )}

        {/* Stock Transaction started */}
        {activeSection === "stock_history" && (
          <div className="sdjklifinskxclw56">
            <div className="inidbx2_stock">
              <div className="searfiltsortcks">
                <div className="inseac5w">
                  <input type="text" placeholder="Search Stock Transaction" onChange={handleSearch} />

                  {/* <RiSearch2Line id="" /> */}
                </div>
                <div className="maincontainmiainx1">
                  <div
                    className="filtersorticos5w"
                    id="sortByButton"
                    onClick={sortByDropdown?.handleToggle}
                    ref={sortByDropdown?.buttonRef}
                  >
                    <img
                      src={sortbyIco}
                      alt=""
                      data-tooltip-content="Sort By"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-place="bottom"
                    />
                  </div>
                  {sortByDropdown?.isOpen && (
                    <div className="dropdowncontentofx35" ref={sortByDropdown.ref}>
                      <div
                        className={`dmncstomx1 ${selectedSortBy === "Normal" ? "activedmc" : ""
                          }`}
                        onClick={() => handleSortBySelection("Normal")}
                      >
                        Set Default
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width={20}
                          height={20}
                          color={"#6b6b6b"}
                          fill={"none"}
                        >
                          <path
                            d="M18.952 8.60657L21.4622 8.45376C19.6629 3.70477 14.497 0.999914 9.4604 2.34474C4.09599 3.77711 0.909631 9.26107 2.34347 14.5935C3.77731 19.926 9.28839 23.0876 14.6528 21.6553C18.6358 20.5917 21.4181 17.2946 22 13.4844"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 8V12L14 14"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <div>
                        <div
                          className={`dmncstomx1 newdateformationofsortbuy ${selectedSortBy === "custom_date" ? "activedmc" : ""
                            }`}
                        >
                          <div className="s1d65fds56">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width={20}
                              height={20}
                              color={"#6b6b6b"}
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
                                d="M11.9955 13H12.0045M11.9955 17H12.0045M15.991 13H16M8 13H8.00897M8 17H8.00897"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M3.5 8H20.5"
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
                            Custom Date
                          </div>
                          <div>
                            <input
                              type="date"
                              name="custom_date"
                              id=""
                              value={custom_date}
                              onChange={handleDateChange}
                              onKeyDown={(e) => e.preventDefault()}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <span
                          className={`dmncstomx1 newdateformationofsortbuy2 ${selectedSortBy === "toDate" ? "activedmc" : ""
                            }`}
                        >
                          <div className="s1d65fds56">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width={20}
                              height={20}
                              color={"#6b6b6b"}
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
                                d="M11.9955 13H12.0045M11.9955 17H12.0045M15.991 13H16M8 13H8.00897M8 17H8.00897"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M3.5 8H20.5"
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
                            Date Range
                          </div>

                          <span className="newdateformationofsortbuy23">
                            <div>
                              {" "}
                              From:
                              <div>
                                <input
                                  type="date"
                                  name="fromDate"
                                  id=""
                                  value={fromDate}
                                  onChange={handleDateRangeFrom}
                                  onKeyDown={(e) => e.preventDefault()}

                                />
                              </div>
                            </div>
                            <div>
                              {" "}
                              To:
                              <div>
                                <input
                                  type="date"
                                  name="toDate"
                                  id=""
                                  value={toDate}
                                  onChange={handleDateRangeTo}
                                  onKeyDown={(e) => e.preventDefault()}

                                />
                              </div>
                            </div>
                          </span>
                        </span>
                      </div>

                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: 0 }} id="mainsectioncsls_stock121">
                <div id="newtableofagtheme">
                  <div className="table-headerx12">
                    {items_Table_Detail_Transction_Icon?.map((val) => (
                      <div
                        id="table-cellx12"
                        className={`table-cellx12_font  ${val.className}`}
                        index={val.id}
                      >
                        {val?.svg}
                        {val?.name}
                      </div>
                    ))}
                  </div>
                  {itemStockeducer?.loading || dataChanging === true ? (
                    <TableViewSkeleton />
                  ) : (
                    stockDetails?.map((stock, index) => (
                      <div
                        key={index}
                        className="table-rowx12_stock"
                      // id="table-rowx12_"
                      >
                        <div className="table-cellx12_font stockhistoryxjlk41 ">
                          {getDisplayDate(stock?.transaction_date)}
                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk45 "> <ShowMastersValue type="11" id={stock?.transaction_type} /></div>
                        <div className="table-cellx12_font stockhistoryxjlk43 ">
                          {stock?.inout === "1" ? "IN" : "Out" || ""}
                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk44 ">
                          {stock?.quantity || ""}
                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk45 ">
                          {" "}
                          <ShowMastersValue
                            type="7"
                            id={stock?.reason_type === "0" ? "" : stock?.reason_type}
                          />
                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk46 ">
                          {stock?.description || ""}
                        </div>

                        <div
                          className="table-cellx12_font stockhistoryxjlk47 _7"
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content={stock?.warehouse?.name}
                        >
                          {stock?.warehouse ? <>  {`${stock?.warehouse?.name?.slice(0, 10)}...` || ""}</> : <></>}


                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk48">
                          {stock?.zone?.name || ""}
                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk49">
                          {stock?.rack?.name}
                        </div>
                        <div
                          className="table-cellx12_font stockhistoryxjlk50"
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content={stock?.bin?.name}
                        >
                          {stock?.bin?.name || ""}
                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk51">
                          {/* {stock?.image_url} */}
                          {stock?.image_url ? (
                            <div
                              onClick={() => {
                                setShowPopup(true);
                                setPopupImageUrl(stock?.image_url); // Set the image URL for the popup
                              }}
                            >
                              {otherIcons?.file_svg} File Attached
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {showPopup && (
                  <div className="mainxpopups2" ref={popupRef}>

                    <div className="popup-content02">
                      <span
                        className="close-button02"
                        onClick={() => setShowPopup(false)}
                      >
                        <RxCross2 />
                      </span>
                      <img
                        src={popupImageUrl}
                        name="popup_image"
                        alt="Popup Image"
                        height={500}
                        width={500}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <PaginationComponent
              itemList={stockDetails?.length}
              setDataChangingProp={handleDataChange}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        )}
        {/* Stock Transaction End */}



        {/* Activity started */}
        {activeSection === "activity" && (
          <div className="activityofitem">
            <div className="searfiltsortcks">
              <div className="maincontainmiainx1">
                <div
                  className="filtersorticos5w"
                  id="sortByButton"
                  onClick={sortByDropdown?.handleToggle}
                  ref={sortByDropdown?.buttonRef}
                >
                  <img
                    src={sortbyIco}
                    alt=""
                    data-tooltip-content="Sort By"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-place="bottom"
                  />
                </div>
                {sortByDropdown?.isOpen && (
                  <div className="dropdowncontentofx35" ref={sortByDropdown.ref}>
                    <div
                      className={`dmncstomx1 ${selectedSortBy === "Normal" ? "activedmc" : ""
                        }`}
                      onClick={() => handleSortBySelection("Normal")}
                    >
                      Set Default
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={20}
                        height={20}
                        color={"#6b6b6b"}
                        fill={"none"}
                      >
                        <path
                          d="M18.952 8.60657L21.4622 8.45376C19.6629 3.70477 14.497 0.999914 9.4604 2.34474C4.09599 3.77711 0.909631 9.26107 2.34347 14.5935C3.77731 19.926 9.28839 23.0876 14.6528 21.6553C18.6358 20.5917 21.4181 17.2946 22 13.4844"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 8V12L14 14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div>
                      <div
                        className={`dmncstomx1 newdateformationofsortbuy ${selectedSortBy === "custom_date" ? "activedmc" : ""
                          }`}
                      >
                        <div className="s1d65fds56">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width={20}
                            height={20}
                            color={"#6b6b6b"}
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
                              d="M11.9955 13H12.0045M11.9955 17H12.0045M15.991 13H16M8 13H8.00897M8 17H8.00897"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3.5 8H20.5"
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
                          Custom Date
                        </div>
                        <div>
                          <input
                            type="date"
                            name="custom_date"
                            id=""
                            value={custom_date}
                            onChange={handleDateChange}
                            onKeyDown={(e) => e.preventDefault()}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`dmncstomx1 newdateformationofsortbuy2 ${selectedSortBy === "toDate" ? "activedmc" : ""
                          }`}
                      >
                        <div className="s1d65fds56">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width={20}
                            height={20}
                            color={"#6b6b6b"}
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
                              d="M11.9955 13H12.0045M11.9955 17H12.0045M15.991 13H16M8 13H8.00897M8 17H8.00897"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3.5 8H20.5"
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
                          Date Range
                        </div>

                        <span className="newdateformationofsortbuy23">
                          <div>
                            {" "}
                            From:
                            <div>
                              <input
                                type="date"
                                name="fromDate"
                                id=""
                                value={fromDate}
                                onChange={handleDateRangeFrom}
                                onKeyDown={(e) => e.preventDefault()}

                              />
                            </div>
                          </div>
                          <div>
                            {" "}
                            To:
                            <div>
                              <input
                                type="date"
                                onKeyDown={(e) => e.preventDefault()}
                                name="toDate"
                                id=""
                                value={toDate}
                                onChange={handleDateRangeTo}
                              />
                            </div>
                          </div>
                        </span>
                      </span>
                    </div>

                  </div>
                )}
              </div>
            </div>

            <div className="">
              {activity?.data.activity?.length === 0 ? (
                <NoDataFound />
              ) : (
                activity?.data?.activity?.map((item, index, arr) => {
                  const currentCreatedAt = new Date(item.created_at);
                  const currentDate = currentCreatedAt.toDateString();

                  // Check if current date is different from the previous date
                  const displayDate =
                    index === 0 ||
                    currentDate !==
                    new Date(arr[index - 1].created_at).toDateString();

                  const hours = currentCreatedAt.getHours();
                  const minutes = currentCreatedAt.getMinutes();
                  const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? "0" : ""
                    }${minutes} ${hours >= 12 ? "PM" : "AM"}`;

                  return (
                    <div className="activitylogxjks5">
                      {displayDate && (
                        <div className="datscxs445sde">
                          <img src={calendaricofillx5} alt="" />
                          {new Date(item.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      )}
                      <div key={item.id} className="childactivuytsd154">
                        <div className="flexsd5fs6dx6w">
                          <div className="svgfiwithrolin">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width={40}
                              height={40}
                              color={"#5c5c5c"}
                              fill={"none"}
                            >
                              <path
                                d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                          <p className="sdf623ptag">{formattedTime}</p>
                          <div className="descxnopcs45s">
                            <div className="chislsdf465s">
                              <p>Action by  </p>
                              <span>-</span>
                              <b>{item?.action_type}</b>
                            </div>
                            <div className="chislsdf465s">
                              <p>{item?.action_type} by  </p>
                              <span>-</span>
                              <b>{item.entryby.name}</b>
                            </div>
                            {/* <p className='c99atags56d'>{item.comment || "Data Not Found"}</p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
        {/* Activity end */}

      </div>
    </div >
  );
};
export default InsideItemDetailsBox;












export const InsideWarehouseDetailsBox = ({ itemDetails }) => {
  const masterData = useSelector((state) => state?.masterData?.masterData);
  const mainDeparmentVal = masterData?.filter((val) => val?.type === "10");

  // Helper function to display the value or '' if it's null/empty
  const displayValue = (value) => (value ? value : "");
  const [activeSection, setActiveSection] = useState("overview");

  const Navigate = useNavigate();
  // Refs for dropdowns
  const sortDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  const handleClickOutside = (event) => {
    if (
      sortDropdownRef.current &&
      !sortDropdownRef.current.contains(event.target)
    ) {
      setIsSortByDropdownOpen(false);
    }
    if (
      filterDropdownRef.current &&
      !filterDropdownRef.current.contains(event.target)
    ) {
      setIsFilterDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const dispatch = useDispatch();

  const showDeparmentLabels = (department, mainDeparmentVal) => {
    if (typeof department !== "string") return "";

    try {
      const depArray = JSON.parse(department);
      const labels = depArray
        .map((depId) => {
          const depObj = mainDeparmentVal.find((val) => val.labelid === depId);
          return depObj ? depObj.label : "";
        })
        .filter((label) => label !== "");

      return labels.join(", ");
    } catch (e) {
      console.error("Invalid JSON string in department:", department);
      return "";
    }
  };

  const opneSections = (val) => {
    const queryParams = new URLSearchParams();
    queryParams?.set("id", itemDetails?.data?.id);
    Navigate(`/dashboard/${val}?${queryParams.toString()}`);
  };

  useEffect(() => {
    dispatch(fetchMasterData());
  }, [dispatch]);

  return (
    <div id="itemsdetailsrowskl" className="secondinsidedatax15s">
      <div className="buttonscontainxs2">
        <div
          className={`divac12cs32 ${activeSection === "overview" ? "activediv12cs" : ""
            }`}
          onClick={() => setActiveSection("overview")}
        >
          <img src={overviewIco} alt="" />
          Basic Details
        </div>
      </div>
      <div className="insidcontain">
        {activeSection === "overview" && (
          <>
            <div className="inidbx1">
              <div className="inidbx1s1">
                <div className="inidbs1x1a1">
                  {otherIcons?.information_svg}
                  Information
                </div>
                <ul>
                  <li>
                    <span>Warehouse Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.data?.name || ""} </p>
                  </li>
                  <li>
                    <span>Type Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.data?.warehouse_type || ""} </p>
                  </li>
                  {/* <li><span>Capacity</span><h1>:</h1><p>{displayValue(itemDetails?.data?.capacity)}</p></li> */}
                  <li>
                    <span>Department</span>
                    <h1>:</h1>
                    <p>
                      {" "}
                      {showDeparmentLabels(
                        itemDetails?.data?.department,
                        mainDeparmentVal
                      )}
                    </p>
                  </li>
                  {itemDetails?.data?.warehouse_type !== "Silo" ? (
                    <>
                      <li className="ware_clilds">
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => opneSections("zone")}
                        >
                          No Of Zones
                        </span>
                        <h1>:</h1>
                        <p>{itemDetails?.no_of_zones} </p>
                      </li>
                      <li className="ware_clilds">
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => opneSections("racks")}
                        >
                          No Of Racks
                        </span>
                        <h1>:</h1>
                        <p>{itemDetails?.no_of_racks} </p>
                      </li>
                      <li className="ware_clilds">
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => opneSections("bin")}
                        >
                          No Of Bins
                        </span>
                        <h1>:</h1>
                        <p>{itemDetails?.no_of_bins} </p>
                      </li>
                    </>
                  ) : (
                    ""
                  )}
                </ul>
              </div>

              <div id="coninsd2x3s">
                <div className="inidbx1s2 inidbx1s2x21s5">
                  <div className="inidbs1x1a1">
                    {otherIcons?.selling_svg}
                    Address
                  </div>
                  <ul>
                    <li>
                      <span>Address</span>
                      <h1>:</h1>
                      <p>{displayValue(itemDetails?.data?.address)}</p>
                    </li>
                    <li>
                      <span>Country</span>
                      <h1>:</h1>
                      <p>{displayValue(itemDetails?.data?.country?.name)}</p>
                    </li>
                    <li>
                      <span>State</span>
                      <h1>:</h1>
                      <p>{displayValue(itemDetails?.data?.state?.name)}</p>
                    </li>
                    <li>
                      <span>City</span>
                      <h1>:</h1>
                      <p>{displayValue(itemDetails?.data?.city?.name)}</p>
                    </li>
                    {/* <li><span>Pincode</span><h1>:</h1><p>{displayValue(itemDetails?.sale_description)}</p></li> */}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
        {activeSection === "transaction" && (
          <div className="inidbx2">
            <div className="notdatafound">
              <iframe
                src="https://lottie.host/embed/e8ebd6c5-c682-46b7-a258-5fcbef32b33e/PjfoHtpCIG.json"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        )}
        {activeSection === "stock_history" && (
          <div className="sdjklifinskxclw56">
            <div className="inidbx2">
              <div style={{ padding: 0 }} id="mainsectioncsls">
                <div id="newtableofagtheme">
                  <div className="table-headerx12">
                    {warehouse_Table_Detail_Transction_Icon?.map((val) => (
                      <div
                        className={`table-cellx12_font ${val.className}`}
                        index={val.id}
                      >
                        {val?.svg}
                        {val?.name}
                      </div>
                    ))}
                  </div>
                  {stockDetails?.length === 0 ? (
                    <NoDataFound />
                  ) : (
                    stockDetails?.map((stock, index) => (
                      <div key={index} className="table-rowx12">
                        <div className="table-cellx12_font stockhistoryxjlk41">
                          {getDisplayDate(stock?.transaction_date)}
                        </div>

                        <div className="table-cellx12_font stockhistoryxjlk42">
                          {showTransationValue(stock.transaction_type)}
                        </div>

                        <div className="table-cellx12_font stockhistoryxjlk43">
                          {stock.inout == 2 ? "out" : "in"}
                        </div>

                        <div className="table-cellx12_font stockhistoryxjlk44">
                          {parseFloat(stock.quantity) || ""}
                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk45">
                          {findReasonTypeNameById(stock?.reason_type)}
                        </div>

                        <div className="table-cellx12_font stockhistoryxjlk46">
                          {stock.description || ""}
                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk47_7">
                          {stock?.attachment ? (
                            <>
                              <div>{otherIcons?.file_svg} File Attached</div>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <PaginationComponent
              itemList={stockDetails?.length}
              setDataChangingProp={handleDataChange}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export const InsideExpenseDetailsBox = ({ itemDetails }) => {
  const masterData = useSelector((state) => state?.masterData?.masterData);
  const mainDeparmentVal = masterData?.filter((val) => val?.type === "10");

  // Helper function to display the value or '' if it's null/empty
  const displayValue = (value) => (value ? value : "");
  const [activeSection, setActiveSection] = useState("overview");

  const Navigate = useNavigate();
  // Refs for dropdowns
  const sortDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  const handleClickOutside = (event) => {
    if (
      sortDropdownRef.current &&
      !sortDropdownRef.current.contains(event.target)
    ) {
      setIsSortByDropdownOpen(false);
    }
    if (
      filterDropdownRef.current &&
      !filterDropdownRef.current.contains(event.target)
    ) {
      setIsFilterDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const dispatch = useDispatch();

  const showDeparmentLabels = (department, mainDeparmentVal) => {
    if (typeof department !== "string") return "";

    try {
      const depArray = JSON.parse(department);
      const labels = depArray
        .map((depId) => {
          const depObj = mainDeparmentVal.find((val) => val.labelid === depId);
          return depObj ? depObj.label : "";
        })
        .filter((label) => label !== "");

      return labels.join(", ");
    } catch (e) {
      console.error("Invalid JSON string in department:", department);
      return "";
    }
  };

  const opneSections = (val) => {
    const queryParams = new URLSearchParams();
    queryParams?.set("id", itemDetails?.data?.id);
    Navigate(`/dashboard/${val}?${queryParams.toString()}`);
  };

  useEffect(() => {
    dispatch(fetchMasterData());
  }, [dispatch]);

  return (
    <div id="itemsdetailsrowskl" className="secondinsidedatax15s">
      <div className="insidcontain">
        {activeSection === "overview" && (
          <>
            <div className="inidbx1">
              <div className="inidbx1s1">
                <div className="inidbs1x1a1">
                  {otherIcons?.information_svg}
                  Basic Information
                </div>
                <ul>
                  <li>
                    <span>Expense Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.expense_head?.expense_name || ""} </p>
                  </li>
                  <li>
                    <span>Expense Account Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.expense_account?.account_name || ""} </p>
                  </li>
                  <li>
                    <span>Amount</span>
                    <h1>:</h1>
                    <p> {showAmountWithCurrencySymbol(itemDetails?.amount)}</p>
                  </li>
                  <li>
                    <span>User Type</span>
                    <h1>:</h1>
                    <p>
                      {" "}
                      {itemDetails?.user_type === "2" ? "Vendor" : "Customer"}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
        {activeSection === "transaction" && (
          <div className="inidbx2">
            <div className="notdatafound">
              <iframe
                src="https://lottie.host/embed/e8ebd6c5-c682-46b7-a258-5fcbef32b33e/PjfoHtpCIG.json"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        )}
        {activeSection === "stock_history" && (
          <div className="sdjklifinskxclw56">
            <div className="inidbx2_stock121">
              <div style={{ padding: 0 }} id="mainsectioncsls">
                <div id="newtableofagtheme">
                  <div className="table-headerx12">
                    {warehouse_Table_Detail_Transction_Icon?.map((val) => (
                      <div
                        className={`table-cellx12_font ${val.className}`}
                        index={val.id}
                      >
                        {val?.svg}
                        {val?.name}
                      </div>
                    ))}
                  </div>
                  {stockDetails?.length === 0 ? (
                    <NoDataFound />
                  ) : (
                    stockDetails?.map((stock, index) => (
                      <div key={index} className="table-rowx12">
                        <div className="table-cellx12_font stockhistoryxjlk41">
                          {getDisplayDate(stock?.transaction_date)}
                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk42">
                          {showTransationValue(stock.transaction_type)}
                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk43">
                          {stock.inout == 2 ? "out" : "in"}
                        </div>

                        <div className="table-cellx12_font stockhistoryxjlk44">
                          {parseFloat(stock.quantity) || ""}
                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk45">
                          {findReasonTypeNameById(stock?.reason_type)}
                        </div>

                        <div className="table-cellx12_font stockhistoryxjlk46">
                          {stock.description || ""}
                        </div>
                        <div className="table-cellx12_font stockhistoryxjlk47_7">
                          {stock?.attachment ? (
                            <>
                              <div>{otherIcons?.file_svg} File Attached</div>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <PaginationComponent
              itemList={stockDetails?.length}
              setDataChangingProp={handleDataChange}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const InsideZoneBox = ({ itemDetails }) => {
  const masterData = useSelector((state) => state?.masterData?.masterData);
  const mainDeparmentVal = masterData?.filter((val) => val?.type === "10");

  const [activeSection, setActiveSection] = useState("overview");

  const Navigate = useNavigate();
  // Refs for dropdowns
  const sortDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  const handleClickOutside = (event) => {
    if (
      sortDropdownRef.current &&
      !sortDropdownRef.current.contains(event.target)
    ) {
      setIsSortByDropdownOpen(false);
    }
    if (
      filterDropdownRef.current &&
      !filterDropdownRef.current.contains(event.target)
    ) {
      setIsFilterDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const dispatch = useDispatch();

  const showDeparmentLabels = (department, mainDeparmentVal) => {
    if (typeof department !== "string") return "";

    try {
      const depArray = JSON.parse(department);
      const labels = depArray
        .map((depId) => {
          const depObj = mainDeparmentVal.find((val) => val.labelid === depId);
          return depObj ? depObj.label : "";
        })
        .filter((label) => label !== "");

      return labels.join(", ");
    } catch (e) {
      console.error("Invalid JSON string in department:", department);
      return "";
    }
  };

  const opneSections = (val) => {
    const queryParams = new URLSearchParams();
    queryParams?.set("id", itemDetails?.data?.id);
    Navigate(`/dashboard/${val}?${queryParams.toString()}`);
  };

  useEffect(() => {
    dispatch(fetchMasterData());
  }, [dispatch]);

  return (
    <div id="itemsdetailsrowskl" className="secondinsidedatax15s">
      <div className="buttonscontainxs2">
        <div
          className={`divac12cs32 ${activeSection === "overview" ? "activediv12cs" : ""
            }`}
          onClick={() => setActiveSection("overview")}
        >
          <img src={overviewIco} alt="" />
          Basic Details
        </div>
      </div>
      <div className="insidcontain">
        {activeSection === "overview" && (
          <>
            <div className="inidbx1">
              <div className="inidbx1s1">
                <div className="inidbs1x1a1">
                  {otherIcons?.information_svg}
                  Information
                </div>
                <ul>
                  <li>
                    <span>Zone Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.name || ""} </p>
                  </li>
                  <li>
                    <span>Zone Type</span>
                    <h1>:</h1>
                    <p>{itemDetails?.zone_type || ""} </p>
                  </li>
                  <li>
                    <span>Warehouse Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.warehouse?.name || ""} </p>
                  </li>
                  <li>
                    <span>Description</span>
                    <h1>:</h1>
                    <p>{itemDetails?.description || ""} </p>
                  </li>
                  <li>
                    <span>Level</span>
                    <h1>:</h1>
                    <p>{itemDetails?.level || ""} </p>
                  </li>
                  <li>
                    <span>No Of Racks</span>
                    <h1>:</h1>
                    <p>{itemDetails?.no_of_racks || ""} </p>
                  </li>
                  <li>
                    <span>No Of Aisle</span>
                    <h1>:</h1>
                    <p>{itemDetails?.no_of_aisle || ""} </p>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const InsideRacksBox = ({ itemDetails }) => {
  const masterData = useSelector((state) => state?.masterData?.masterData);
  const mainDeparmentVal = masterData?.filter((val) => val?.type === "10");

  const [activeSection, setActiveSection] = useState("overview");

  const Navigate = useNavigate();
  // Refs for dropdowns
  const sortDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  const handleClickOutside = (event) => {
    if (
      sortDropdownRef.current &&
      !sortDropdownRef.current.contains(event.target)
    ) {
      setIsSortByDropdownOpen(false);
    }
    if (
      filterDropdownRef.current &&
      !filterDropdownRef.current.contains(event.target)
    ) {
      setIsFilterDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const dispatch = useDispatch();

  const showDeparmentLabels = (department, mainDeparmentVal) => {
    if (typeof department !== "string") return "";

    try {
      const depArray = JSON.parse(department);
      const labels = depArray
        .map((depId) => {
          const depObj = mainDeparmentVal.find((val) => val.labelid === depId);
          return depObj ? depObj.label : "";
        })
        .filter((label) => label !== "");

      return labels.join(", ");
    } catch (e) {
      console.error("Invalid JSON string in department:", department);
      return "";
    }
  };

  const opneSections = (val) => {
    const queryParams = new URLSearchParams();
    queryParams?.set("id", itemDetails?.data?.id);
    Navigate(`/dashboard/${val}?${queryParams.toString()}`);
  };

  useEffect(() => {
    dispatch(fetchMasterData());
  }, [dispatch]);

  return (
    <div id="itemsdetailsrowskl" className="secondinsidedatax15s">
      <div className="buttonscontainxs2">
        <div
          className={`divac12cs32 ${activeSection === "overview" ? "activediv12cs" : ""
            }`}
          onClick={() => setActiveSection("overview")}
        >
          <img src={overviewIco} alt="" />
          Basic Details
        </div>
      </div>
      <div className="insidcontain">
        {activeSection === "overview" && (
          <>
            <div className="inidbx1">
              <div className="inidbx1s1">
                <div className="inidbs1x1a1">
                  {otherIcons?.information_svg}
                  Information
                </div>
                <ul>
                  <li>
                    <span>Rack Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.name || ""} </p>
                  </li>
                  <li>
                    <span>Zone Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.zone?.name || ""} </p>
                  </li>
                  <li>
                    <span>Warehouse Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.warehouse?.name || ""} </p>
                  </li>
                  <li>
                    <span>Warehouse Type</span>
                    <h1>:</h1>
                    <p>{itemDetails?.warehouse?.warehouse_type || ""} </p>
                  </li>
                  <li>
                    <span>Current Load</span>
                    <h1>:</h1>
                    <p>{itemDetails?.current_load || ""} </p>
                  </li>
                  <li>
                    <span>Dimentions</span>
                    <h1>:</h1>
                    <p>{itemDetails?.dimension || ""} </p>
                  </li>
                  <li>
                    <span>Level</span>
                    <h1>:</h1>
                    <p>{itemDetails?.level || ""} </p>
                  </li>
                  <li>
                    <span>Description</span>
                    <h1>:</h1>
                    <p>{itemDetails?.description || ""} </p>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const InsideBinBox = ({ itemDetails }) => {
  const masterData = useSelector((state) => state?.masterData?.masterData);
  const mainDeparmentVal = masterData?.filter((val) => val?.type === "10");

  const [activeSection, setActiveSection] = useState("overview");

  const Navigate = useNavigate();
  // Refs for dropdowns
  const sortDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  const handleClickOutside = (event) => {
    if (
      sortDropdownRef.current &&
      !sortDropdownRef.current.contains(event.target)
    ) {
      setIsSortByDropdownOpen(false);
    }
    if (
      filterDropdownRef.current &&
      !filterDropdownRef.current.contains(event.target)
    ) {
      setIsFilterDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const dispatch = useDispatch();

  const showDeparmentLabels = (department, mainDeparmentVal) => {
    if (typeof department !== "string") return "";

    try {
      const depArray = JSON.parse(department);
      const labels = depArray
        .map((depId) => {
          const depObj = mainDeparmentVal.find((val) => val.labelid === depId);
          return depObj ? depObj.label : "";
        })
        .filter((label) => label !== "");

      return labels.join(", ");
    } catch (e) {
      console.error("Invalid JSON string in department:", department);
      return "";
    }
  };

  const opneSections = (val) => {
    const queryParams = new URLSearchParams();
    queryParams?.set("id", itemDetails?.data?.id);
    Navigate(`/dashboard/${val}?${queryParams.toString()}`);
  };

  return (
    <div id="itemsdetailsrowskl" className="secondinsidedatax15s">
      <div className="buttonscontainxs2">
        <div
          className={`divac12cs32 ${activeSection === "overview" ? "activediv12cs" : ""
            }`}
          onClick={() => setActiveSection("overview")}
        >
          <img src={overviewIco} alt="" />
          Basic Details
        </div>
      </div>
      <div className="insidcontain">
        {activeSection === "overview" && (
          <>
            <div className="inidbx1">
              <div className="inidbx1s1">
                <div className="inidbs1x1a1">
                  {otherIcons?.information_svg}
                  Information
                </div>
                <ul>
                  <li>
                    <span>Bin Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.name || ""} </p>
                  </li>
                  <li>
                    <span>Rack Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.rack?.name || ""} </p>
                  </li>
                  <li>
                    <span>Zone Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.zone?.name || ""} </p>
                  </li>
                  <li>
                    <span>Warehouse Name</span>
                    <h1>:</h1>
                    <p>{itemDetails?.warehouse?.name || ""} </p>
                  </li>
                  <li>
                    <span>Warehouse Type</span>
                    <h1>:</h1>
                    <p>{itemDetails?.warehouse?.warehouse_type || ""} </p>
                  </li>

                  <li>
                    <span>Description</span>
                    <h1>:</h1>
                    <p>{itemDetails?.description || ""} </p>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const InsideGrnDetailsBox = ({ itemDetails }) => {
  const displayValue = (value) => (value ? value : "");
  const [activeSection, setActiveSection] = useState("overview");
  return (
    <div id="itemsdetailsrowskl" className="secondinsidedatax15s">
      <div className="buttonscontainxs2">
        <div
          className={`divac12cs32 ${activeSection === "overview" ? "activediv12cs" : ""
            }`}
          onClick={() => setActiveSection("overview")}
        >
          <img src={overviewIco} alt="" />
          Overview
        </div>
      </div>
      <div className="insidcontain">
        {activeSection === "overview" && (
          <>
            <div className="inidbx1">
              <div className="inidbx1s1">
                <div className="inidbs1x1a1">
                  {otherIcons?.information_svg}
                  GRN Information
                </div>

                <ul>
                  <li>
                    <span>GRN Number</span>
                    <h1>:</h1>
                    <p>{displayValue(itemDetails?.grn?.grn_no)}</p>
                  </li>
                  <li>
                    <span>GRN Type</span>
                    <h1>:</h1>
                    <p>{displayValue(itemDetails?.grn?.grn_type)}</p>
                  </li>
                  <li>
                    <span>GRN QTY</span>
                    <h1>:</h1>
                    <p>
                      {displayValue(itemDetails?.gr_qty)}{" "}
                      <ShowMastersValue type="2" id={itemDetails?.unit_id} />
                    </p>
                  </li>
                  <li>
                    <span>Purchase Order</span>
                    <h1>:</h1>
                    <p>
                      {displayValue(
                        itemDetails?.grn?.purchase_order?.purchase_order_id
                      )}
                    </p>
                  </li>
                  <li>
                    <span>Vendor Name</span>
                    <h1>:</h1>
                    <p>
                      {(itemDetails?.grn?.vendor?.salutation || "") +
                        " " +
                        (itemDetails?.grn?.vendor?.first_name || "") +
                        " " +
                        (itemDetails?.grn?.vendor?.last_name || "")}
                    </p>
                  </li>
                  <li>
                    <span>GRN Charge</span>
                    <h1>:</h1>
                    <p>{displayValue(itemDetails?.grn?.total_grn_charges)}</p>
                  </li>
                  <li>
                    <span>Shipping Charge</span>
                    <h1>:</h1>
                    <p>{displayValue(itemDetails?.grn?.shipping_charge)}</p>
                  </li>
                  <li>
                    <span>Final Amount</span>
                    <h1>:</h1>
                    <p>{displayValue(itemDetails?.grn?.total)}</p>
                  </li>
                </ul>
              </div>
              <div id="coninsd2x3s">
                <div className="inidbx1s2 inidbx1s2x21s5">
                  <div className="inidbs1x1a1">
                    {otherIcons?.selling_svg}
                    Item Information
                  </div>
                  <ul >
                    <li>
                      <span>Item Name</span>
                      <h1>:</h1>
                      <p>{displayValue(itemDetails?.item?.name)}</p>
                    </li>
                    <li>
                      <span>Item Type</span>
                      <h1>:</h1>
                      <p>
                        {displayValue(
                          itemDetails?.item?.type === "Raw"
                            ? "Raw Material"
                            : itemDetails?.item?.type
                        )}
                      </p>
                    </li>
                    <li>
                      <span>Stock</span>
                      <h1>:</h1>
                      <p>
                        <span
                          style={{
                            color:
                              itemDetails?.item?.stock < 0 ? "red" : "inherit",
                          }}
                        >
                          {itemDetails?.item?.stock || 0.0}
                        </span>{" "}
                        &nbsp; QTY
                      </p>
                    </li>
                    <li>
                      <span>SKU</span>
                      <h1>:</h1>
                      <p>{displayValue(itemDetails?.item?.sku)}</p>
                    </li>
                    <li>
                      <span>Unit</span>
                      <h1>:</h1>
                      <p>{itemDetails?.item?.unit?.toUpperCase()}</p>
                    </li>
                    <li>
                      <span>HSN Code</span>
                      <h1>:</h1>
                      <p>{itemDetails?.item?.hsn_code?.toUpperCase()}</p>
                    </li>
                    <li>
                      <span>Tax Rate</span>
                      <h1>:</h1>
                      <p>{itemDetails?.item?.tax_rate?.toUpperCase()}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
