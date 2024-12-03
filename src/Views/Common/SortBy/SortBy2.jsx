import React, { useState, useRef, useEffect } from "react";
import sortbyIco from "../../../assets/outlineIcons/othericons/sortbyIco.svg";
import { OutsideClick } from "../../Helper/ComponentHelper/OutsideClick";
import useOutsideClick from "../../Helper/PopupData";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";

function SortBy2({
  setSearchTrigger,
  selectedSortBy,
  setSelectedSortBy,
  sortOrder,
  setSortOrder,
  section,
  sortById,
  resetPageIfNeeded,
}) {
  const sortByDropdown = OutsideClick();
  const sortDropdownRef = useRef(null);

  const handleSortBySelection = (sortBy) => {
    const sortByButton = document?.getElementById("sortByButton");
    if (sortByButton) {
      if (sortBy !== "Normal") {
        sortByButton?.classList.add("filter-applied");
        if (selectedSortBy === sortBy) {
          setSortOrder((prevOrder) => (prevOrder === 1 ? 2 : 1));
        } else {
          setSortOrder(1);
        }
        setSelectedSortBy(sortBy);
      } else {
        sortByButton?.classList.remove("filter-applied");
        setSelectedSortBy("Normal");
      }
    }
    resetPageIfNeeded()
    setSearchTrigger((prev) => prev + 1);
    sortByDropdown.handleToggle();
  };

  useOutsideClick(sortDropdownRef, () => setIsSortByDropdownOpen(false));
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
              className={`dmncstomx1 newdateformationofsortbuy ${selectedSortBy === sortById ? "" : ""
                }`}
              onClick={() => handleSortBySelection(sortById)}
            >
              <div className="s1d65fds56">
                {otherIcons?.customer_svg}
                {section}
                <span
                  className={`arrow up ${selectedSortBy === sortById && sortOrder === 1
                    ? "highlighted"
                    : ""
                    }`}
                >
                  &uarr;
                </span>
                <span
                  className={`arrow down ${selectedSortBy === sortById && sortOrder === 2
                    ? "highlighted"
                    : ""
                    }`}
                >
                  &darr;
                </span>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`dmncstomx1 newdateformationofsortbuy ${selectedSortBy === "company_name" ? "" : ""
                }`}
              onClick={() => handleSortBySelection("company_name")}
            >
              <div className="s1d65fds56">
                {otherIcons.company_name_svg}
                Company Name
                <span
                  className={`arrow up ${selectedSortBy === "company_name" && sortOrder === 1
                    ? "highlighted"
                    : ""
                    }`}
                >
                  &uarr;
                </span>
                <span
                  className={`arrow down ${selectedSortBy === "company_name" && sortOrder === 2
                    ? "highlighted"
                    : ""
                    }`}
                >
                  &darr;
                </span>
              </div>
            </div>
          </div>




        </div>
      )}
    </div>
  );
}

export default SortBy2;
