import React, { useState, useEffect, useRef, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { GoPlus } from "react-icons/go";
import { invoiceLists } from "../../../Redux/Actions/listApisActions";
import { useDispatch, useSelector } from "react-redux";
import PaginationComponent from "../../Common/Pagination/PaginationComponent";
import TableViewSkeleton from "../../../Components/SkeletonLoder/TableViewSkeleton";
import ListComponent from "../Quotations/ListComponent";
import ResizeFL from "../../../Components/ExtraButtons/ResizeFL";
import { OutsideClick } from "../../Helper/ComponentHelper/OutsideClick";
import { showRealatedText } from "../../Helper/HelperFunctions";
import { formatDate } from "../../Helper/DateFormat";
import DatePicker from "../../Common/DatePicker/DatePicker";
import SearchBox from "../../Common/SearchBox/SearchBox";
import FilterBy from "../../Common/FilterBy/FilterBy";
import SortBy from "../../Common/SortBy/SortBy";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";
import NoDataFound from "../../../Components/NoDataFound/NoDataFound";
import { deliveryChallanFilterOptions, invoiceFilterOptions } from "../../Helper/SortByFilterContent/filterContent";

const Invoices = ({ section }) => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const qutList = useSelector((state) => state?.invoiceList);
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

  //serch
  const [searchTermFromChild, setSearchTermFromChild] = useState("");
  const onSearch = (term) => {
    resetPageIfNeeded();
    setSearchTrigger((prev) => prev + 1);
    setSearchTermFromChild(term); // Update parent state with search term from child
  };
  //Search

  // search,filter and sortby////////////////////////////////////

  const fetchQuotations = useCallback(async () => {
    try {
      const fy = localStorage.getItem("FinancialYear");
      const currentpage = currentPage;

      const sendData = {
        fy,
        noofrec: itemsPerPage,
        is_invoice: section === "delivery_challan" ? 0 : 1,
        currentpage,
        ...(selectedSortBy !== "Normal" && {
          sort_by: selectedSortBy,
          sort_order: sortOrder,
        }),

        ...(section === "invoice_approval" && { status: 3 }),
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
      dispatch(invoiceLists(sendData));
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  }, [
    searchTrigger,
  ]);

  useEffect(() => {
    fetchQuotations();
  }, [searchTrigger]);

  const handleRowClicked = (quotation) => {
    Navigate(
      `/dashboard/${showRealatedText(section, "invoice_approval", "invoice_approval_details", "delivery_challan", "delivery-challans-details", "invoice-details"
      )}?id=${quotation.id}`
    );
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
    const areAllRowsSelected = qutList?.data?.invoice?.every((row) =>
      selectedRows.includes(row.id)
    );
    setSelectAll(areAllRowsSelected);
  }, [selectedRows, qutList?.data?.invoice]);

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setSelectedRows(
      selectAll ? [] : qutList?.data?.invoice?.map((row) => row.id)
    );
  };
  //logic for checkBox...



  useEffect(() => {
    setCurrentPage(1);
    setItemsPerPage(10);
  }, [section])

  return (
    <>
      <TopLoadbar />
      <div id="middlesection">
        <div id="Anotherbox">
          <div id="leftareax12">
            <h1 id="firstheading">
              {/* <img src={"/assets/Icons/allcustomers.svg"} alt="" /> */}
              {otherIcons.all_invoices_svg}
              {showRealatedText(
                section,
                "invoice_approval",
                "Invoice Approval Area",
                "delivery_challan",
                "All Delivery Challans",
                "Invoices"
              )}
            </h1>
            <p id="firsttagp">{qutList?.data?.count} Records</p>
            <SearchBox placeholder={`Search In ${showRealatedText(
              section,
              "invoice_approval",
              "Invoice Approval",
              "delivery_challan",
              "Delivery Challan",
              "Invoice"
            )}`}
              onSearch={onSearch}
              section={section}
            />
          </div>

          <div id="buttonsdata">
            {/* {showRealatedText(section, "invoice_approval", "Invoice Number", "delivery_challan", "Delivery Challan Number", "Invoice Number")}
            {section} */}
            <>
              <SortBy
                reset={section}
                setSearchTrigger={setSearchTrigger}
                selectedSortBy={selectedSortBy}
                setSelectedSortBy={setSelectedSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                section={`${showRealatedText(section, "invoice_approval", "Invoice Number", "delivery_challan", "Delivery Challan Number", "Invoice Number")}`}
                sortById={`${showRealatedText(section, "invoice_approval", "invoice_id", "delivery_challan", "invoice_id", "invoice_id")}`}
                type='Customer'
                resetPageIfNeeded={resetPageIfNeeded}

              />
            </>



            <DatePicker
              setDateRange={setDateRange}
              setSpecificDate={setSpecificDate}
              setClearFilter={setClearFilter}
              setSearchTrigger={setSearchTrigger}
              section={section}
              resetPageIfNeeded={resetPageIfNeeded}

            />

            {section !== "invoice_approval" &&
              <FilterBy
                reset={section}
                setStatus={setStatus}
                selectedSortBy={selectedSortBy2}
                setSearchTrigger={setSearchTrigger}
                setSelectedSortBy={setSelectedSortBy2}
                filterOptions={section === "delivery_challan" ? deliveryChallanFilterOptions : invoiceFilterOptions}
                resetPageIfNeeded={resetPageIfNeeded}
              />}

            {section !== "invoice_approval" && (
              <Link
                className="linkx1"
                to={`/dashboard/${showRealatedText(
                  section,
                  "invoice_approval",
                  "",
                  "delivery_challan",
                  "create-delivery-challans",
                  "create-invoice"
                )}`}
              >
                {showRealatedText(
                  section,
                  "invoice_approval",
                  "",
                  "delivery_challan",
                  "New Delivery Challan",
                  "New Invoice"
                )}
                <GoPlus />
              </Link>
            )}
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
                    {showRealatedText(
                      section,
                      "invoice-approval",
                      "Invoice No",
                      "delivery_challan",
                      "Challan No",
                      " Invoice No"
                    )}
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs3">
                    {otherIcons.customer_svg}
                    Customer Name
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs4">
                    {otherIcons.refrence_svg}
                    Refrence No
                  </div>

                  <div className="table-cellx12 quotiosalinvlisxs6_item">
                    <p>
                      {otherIcons.doller_svg}
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

                    {qutList?.data?.invoice?.length >= 1 ? <>
                      {qutList?.data?.invoice?.map((quotation, index) => (
                        <ListComponent
                          section="invoice"
                          key={index}
                          handleRowClicked={handleRowClicked}
                          quotation={quotation}
                          selectedRows={selectedRows}
                          handleCheckboxChange={handleCheckboxChange}
                          approval={section}
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
                      section={section}
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

export default Invoices;
