import React, { useEffect } from 'react'
import FilterIco from "../../../assets/outlineIcons/othericons/FilterIco.svg";
import { OutsideClick } from "../../Helper/ComponentHelper/OutsideClick";
const FilterBy = ({ reset, setStatus, setSearchTrigger, selectedSortBy, setSelectedSortBy, filterOptions, resetPageIfNeeded }) => {
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


          {filterOptions?.map((option) => (
            <div
              className={`dmncstomx1 ${selectedSortBy === option?.labelId ? "activedmc" : ""
                }`}
              onClick={() => handleFilterSelection(option?.labelId)}
            >
              {option?.label}
            </div>
          ))}



        </div>
      )}
    </div>
  )
}

export default FilterBy
