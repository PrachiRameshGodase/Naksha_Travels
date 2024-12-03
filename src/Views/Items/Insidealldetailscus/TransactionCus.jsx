import React, { useEffect, useRef, useState } from "react";
import ShowTransactionsData from "./ShowTransactionsData";

const TransactionCus = ({ type }) => {
  const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

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
  const handleSortByDropdownToggle = () => {
    setIsSortByDropdownOpen(!isSortByDropdownOpen);
  };

  const handleFilterDropdownToggle = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };
  const [activeSection, setActiveSection] = useState(() => {
    return type === "customer" ? "q" : "po";
  });

  const renderCustomerSections = () => (
    <>
      <p
        className={`datasecptac4s ${activeSection === "q" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("q")}
      >
        Quotations
      </p>
      <p
        className={`datasecptac4s ${activeSection === "s" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("s")}
      >
        Sale Orders
      </p>
      <p
        className={`datasecptac4s ${activeSection === "i" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("i")}
      >
        Invoices
      </p>
      <p
        className={`datasecptac4s ${activeSection === "c" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("c")}
      >
        Credit Notes
      </p>
      <p
        className={`datasecptac4s ${activeSection === "p" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("p")}
      >
        Customer Payments
      </p>


    </>
  );

  const renderVendorSections = () => (
    <>
      <p
        className={`datasecptac4s ${activeSection === "po" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("po")}
      >
        Purchase Order
      </p>
      <p
        className={`datasecptac4s ${activeSection === "grn" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("grn")}
      >
        GRN
      </p>
      {/* <p
        className={`datasecptac4s ${activeSection === "grna" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("grna")}
      >
        GRN Approval
      </p>
      <p
        className={`datasecptac4s ${activeSection === "grr" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("grr")}
      >
        GRN Receiving Area
      </p> */}
      <p
        className={`datasecptac4s ${activeSection === "bills" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("bills")}
      >
        Bills
      </p>
      <p
        className={`datasecptac4s ${activeSection === "pm" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("pm")}
      >
        Payment Made
      </p>
      <p
        className={`datasecptac4s ${activeSection === "exp" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("exp")}
      >
        Expenses
      </p>
      <p
        className={`datasecptac4s ${activeSection === "dn" ? "activetranscus" : ""
          }`}
        onClick={() => setActiveSection("dn")}
      >
        Debit Notes
      </p>
    </>
  );

  return (
    <>
      <div className="inidbx2" style={{ width: "80%" }}>
        <div id="middlesection">
          <div className="customlinksinsx12">
            {/* Sort by dropdown */}
            <div className="mainx1" onClick={handleSortByDropdownToggle}>
              <img src="/Icons/sort-size-down.svg" alt="" />
              <p>Sort by</p>
            </div>
            {isSortByDropdownOpen && (
              <div className="dropdowncontentofx35" ref={sortDropdownRef}>
                <div className="dmncstomx1 activedmc">All Items</div>
                <div className="dmncstomx1">Active</div>
                <div className="dmncstomx1">Inactive</div>
                <div className="dmncstomx1">Services</div>
                <div className="dmncstomx1">Goods</div>
              </div>
            )}

            {/* Filter dropdown */}
            <div className="mainx1" onClick={handleFilterDropdownToggle}>
              <img src="/Icons/filters.svg" alt="" />
              <p>Filter</p>
            </div>
            {/* {isFilterDropdownOpen && (
              <div className="dropdowncontentofx35" ref={filterDropdownRef}>
            <div className='dmncstomx1 activedmc'>All Items</div>
            <div className='dmncstomx1'>Active</div>
            <div className='dmncstomx1'>Goods</div>
          </div>
            )} */}
          </div>

          <div className="secondrowx56s">
            {type === "customer"
              ? renderCustomerSections()
              : renderVendorSections()}
            {/* <p className={`datasecptac4s ${activeSection === 'q' ? 'activetranscus' : ''}`} onClick={() => setActiveSection('q')}>Quotations</p>
            <p className={`datasecptac4s ${activeSection === 'i' ? 'activetranscus' : ''}`} onClick={() => setActiveSection('i')}>Invoice</p>
            <p className={`datasecptac4s ${activeSection === 'p' ? 'activetranscus' : ''}`} onClick={() => setActiveSection('p')}>Customer Payments</p>
            <p className={`datasecptac4s ${activeSection === 's' ? 'activetranscus' : ''}`} onClick={() => setActiveSection('s')}>Sale Order</p>
            <p className={`datasecptac4s ${activeSection === 'c' ? 'activetranscus' : ''}`} onClick={() => setActiveSection('c')}>Credit Note</p> */}
          </div>

          {
            (type === "vendor" && (
              <ShowTransactionsData activeSection={activeSection} type="vendor" />
            ))
          }

          {
            (type === "customer" && (
              <ShowTransactionsData activeSection={activeSection} type="customer" />
            ))
          }
        </div>
      </div>
    </>
  );
};

export default TransactionCus;
