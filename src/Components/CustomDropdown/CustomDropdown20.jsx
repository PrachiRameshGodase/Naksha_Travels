import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { RiSearch2Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import DropDownHelper from '../../Views/Helper/DropDownHelper';


const CustomDropdown20 = forwardRef((props, ref) => {
  const { options, value, onChange, name, type, defaultOption } = props
  const {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    dropdownRef,
    inputRef,
    optionRefs,
    filteredOptions,
    handleKeyDown,
    handleSelect,
    focusedOptionIndex
  } = DropDownHelper(options, onChange, name, type);

  const combinedRef = (node) => {
    dropdownRef.current = node;
    if (ref) ref.current = node;
  };

  const data = options?.find(account => account?.account_type === value);

  return (
    <div ref={combinedRef} tabIndex="0" className="customdropdownx12s86" onKeyDown={handleKeyDown}>
      <div onClick={() => setIsOpen(!isOpen)} className={"dropdown-selected" + (value ? ' filledcolorIn' : '')}>
        {value ? data?.account_type : defaultOption}

      </div>
      {isOpen && (
        <div className="dropdown-options">
          <RiSearch2Line id="newsvgsearchicox2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dropdown-search"
            autoFocus
            ref={inputRef}
          />
          <div className="dropdownoptoscroll">
            {
              options?.map((accountType, index) => (
                <div
                  key={accountType.id}

                  ref={(el) => (optionRefs.current[index] = el)}
                  onClick={() => handleSelect(accountType)}
                  className={
                    "dropdown-option" +
                    (accountType.id === value ? " selectedoption" : "") +
                    (index === focusedOptionIndex ? " focusedoption" : "")
                  }
                >
                  {accountType?.account_type}
                </div>


              ))}
          </div>
        </div>
      )}

    </div>
  );
});

export default CustomDropdown20;
