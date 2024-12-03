import React, { useEffect } from 'react'
import FilterIco from "../../../assets/outlineIcons/othericons/FilterIco.svg";
import { OutsideClick } from "../../Helper/ComponentHelper/OutsideClick";
const FilterByPurchases = ({ reset, setStatus, setSearchTrigger, selectedSortBy, setSelectedSortBy, section, resetPageIfNeeded }) => {

  const filterDropdown = OutsideClick();

  const sortByButton = document?.getElementById("filterButton");
  const handleFilterSelection = (filter) => {
    setSelectedSortBy(filter);
    if (sortByButton) {
      if (filter !== "Normal") {
        sortByButton?.classList.add("filter-applied");
        setStatus(filter);
      } else {
        sortByButton?.classList.remove("filter-applied");
        setStatus("");
      }
    }
    resetPageIfNeeded();
    setSearchTrigger(prev => prev + 1);
    filterDropdown.handleToggle();
  };


  useEffect(() => {
    setStatus("");
    setSelectedSortBy("Normal");
    sortByButton?.classList.remove("filter-applied");
  }, [reset]);
  return (
    <div className="maincontainmiainx1">
      <div
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
        <div className="dropdowncontentofx35" ref={filterDropdown.ref}>
          <div
            className={`dmncstomx1 ${selectedSortBy === "Normal" ? "activedmc" : ""
              }`}
            onClick={() => handleFilterSelection("Normal")}
          >
            Normal
          </div>

          {( section === "Purchase Order" ||  section === "GRN") && <div
            className={`dmncstomx1 ${selectedSortBy === "0" ? "activedmc" : ""
              }`}
            onClick={() => handleFilterSelection("0")}
          >
            Draft
          </div>}
          {(section === "Quotation" || section === "Delivery Challan Number" || section === "Invoice Number" || section === "Credit Notes" || section === "Purchase Order") && <div
            className={`dmncstomx1 ${selectedSortBy === "6" ? "activedmc" : ""
              }`}
            onClick={() => handleFilterSelection("6")}
          >
            Sent
          </div>}
          {(section === "Sale Order" ) && <div
            className={`dmncstomx1 ${selectedSortBy === "6" ? "activedmc" : ""
              }`}
            onClick={() => handleFilterSelection("6")}
          >
            Open
          </div>}
          {section==="Sale Order" && (<div
            className={`dmncstomx1 ${selectedSortBy === "1" ? "activedmc" : ""
              }`}
            onClick={() => handleFilterSelection("1")}
          >
            Approved
          </div>)}
          
          {section === "Purchase Order" && (<div
            className={`dmncstomx1 ${selectedSortBy === "7" ? "activedmc" : ""
              }`}
            onClick={() => handleFilterSelection("7")}
          >
            GRN
          </div>)}
          {( section === "GRN") && (<div
            className={`dmncstomx1 ${selectedSortBy === "1" ? "activedmc" : ""
              }`}
            onClick={() => handleFilterSelection("1")}
          >
            Bill Created
          </div>)}
          {(section === "Quotation" || section === "Sale Order") && (<div
            className={`dmncstomx1 ${selectedSortBy === "8" ? "activedmc" : ""
              }`}
            onClick={() => handleFilterSelection("8")}
          >
            Invoiced
          </div>)}

          <div
            className={`dmncstomx1 ${selectedSortBy === "2" ? "activedmc" : ""
              }`}
            onClick={() => handleFilterSelection("2")}
          >
            Close
          </div>

          {(section === "Quotation" || section === "Sale Order" || section === "Delivery Challan Number" || section === "Invoice Number" || section === "Credit Notes" || section === "Purchase Order") && (<div
            className={`dmncstomx1 ${selectedSortBy === "expiry_date" ? "activedmc" : ""
              }`}
            onClick={() => handleFilterSelection("expiry_date")}
          >
            Expired
          </div>)}
        </div>
      )}
    </div>
  )
}

export default FilterByPurchases
