import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const SearchBox = ({ placeholder, onSearch, section }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Local state for search term
  const [searchCall, setSearchCall] = useState(false); // Local state to trigger search calls

  // Function to handle input changes
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const searchInput = document.getElementById("commonmcsearchbar");
    // Trigger the search action after a timeout
    setTimeout(() => {
      setSearchCall(!searchCall);
      onSearch(term); // Notify parent with the search term
    }, 1000);

    // Add or remove the "search-applied" class based on whether the search term is empty

    if (searchInput) {
      if (term) {
        searchInput.classList.add("search-applied");
      } else {
        searchInput.classList.remove("search-applied");
      }
    }
  };

  // Function to handle search when the icon is clicked
  const searchItems = () => {
    setSearchCall(!searchCall);
    onSearch(searchTerm); // Trigger search on icon click
  };


  useEffect(() => {
    setSearchTerm("")
    onSearch("");
  }, [section]);

  return (
    <div id="searchbox">
      <input
        autoComplete="off"
        id="commonmcsearchbar"
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
      />
      <IoSearchOutline
        onClick={searchItems}
        data-tooltip-content="Search"
        data-tooltip-id="my-tooltip"
        data-tooltip-place="bottom"
      />
    </div>
  );
};

export default SearchBox;