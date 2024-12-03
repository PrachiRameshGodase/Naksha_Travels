import React, { useEffect } from "react";
import sortbyIco from "../../../assets/outlineIcons/othericons/sortbyIco.svg";
import { OutsideClick } from "../../Helper/ComponentHelper/OutsideClick";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";

function SortBy({
  reset,
  setSearchTrigger,
  selectedSortBy,
  setSelectedSortBy,
  sortOrder,
  setSortOrder,
  sortOptions,
  resetPageIfNeeded,
}) {

  const sortByButton = document?.getElementById("sortByButton");

  const sortByDropdown = OutsideClick();

  const handleSortBySelection = (sortBy) => {
    if (sortByButton) {
      if (sortBy !== "Normal") {
        sortByButton?.classList.add("filter-applied");
        if (selectedSortBy === sortBy?.id) {
          setSortOrder((prevOrder) => (prevOrder === 1 ? 2 : 1));
        } else {
          setSortOrder(1);
        }
        setSelectedSortBy(sortBy?.id);
      } else {
        sortByButton?.classList.remove("filter-applied");
        setSelectedSortBy("Normal");
      }
    }
    resetPageIfNeeded();
    setSearchTrigger((prev) => prev + 1);
    sortByDropdown.handleToggle();
  };

  useEffect(() => {
    sortByButton?.classList.remove("filter-applied");
    setSelectedSortBy("Normal");
    setSortOrder(1);
  }, [reset]);

  return (
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
            {otherIcons?.default_svg}

          </div>
          {sortOptions?.map((option) => (
            <div
              key={option.id}
              className={`dmncstomx1 newdateformationofsortbuy ${selectedSortBy === option.id ? "activedmc_list" : ""
                }`}
              onClick={() => handleSortBySelection(option)}
            >
              <div className="s1d65fds56">
                {option.icon}
                {option.label}
                <span
                  className={`arrow up ${selectedSortBy === option.id && sortOrder === 1
                    ? "highlighted"
                    : ""
                    }`}
                >
                  &uarr;
                </span>
                <span
                  className={`arrow down ${selectedSortBy === option.id && sortOrder === 2
                    ? "highlighted"
                    : ""
                    }`}
                >
                  &darr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
export default SortBy;