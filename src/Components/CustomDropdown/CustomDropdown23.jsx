import React, { forwardRef, useEffect, useRef } from 'react';
import DropDownHelper from '../../Views/Helper/DropDownHelper';
import { RiSearch2Line } from 'react-icons/ri';

const CustomDropdown23 = forwardRef((props, ref) => {
  const { options, value, setShowPopup, onChange, name, type, style, setItemData, defaultOption, index, extracssclassforscjkls, } = props;
  const nextFocusRef = useRef(null);
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
    focusedOptionIndex,
  } = DropDownHelper(options, onChange, name, type, setItemData, nextFocusRef);


  const hasMounted = useRef(false);

  if (index) {
    useEffect(() => {
      if (!hasMounted.current) {
        hasMounted.current = true;
      } else {
        dropdownRef.current.focus();
      }
    }, [index]);
  }

  const combinedRef = (node) => {
    dropdownRef.current = node;
    if (ref) ref.current = node;
  };


  return (
    <div
      tabIndex="0"
      ref={combinedRef}
      className={`customdropdownx12s86 ${extracssclassforscjkls}`}
      onKeyDown={handleKeyDown}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={"dropdown-selected" + (value ? ' filledcolorIn' : '')}
      >
        {value ? value : defaultOption}
        <svg
          width="13"
          height="7"
          viewBox="0 0 13 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.2852 0.751994C11.2852 0.751994 7.60274 5.75195 6.28516 5.75195C4.96749 5.75195 1.28516 0.751953 1.28516 0.751953"
            stroke="#797979"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {
        isOpen && (
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
              {filteredOptions.map((option, index) => (
                <div
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  ref={(el) => (optionRefs.current[index] = el)}
                  className={
                    "dropdown-option" +
                    (option === value ? " selectedoption" : "") +
                    (index === focusedOptionIndex ? " focusedoption" : "")
                  }
                >
                  {option}
                </div>
              ))}

            </div>
            {filteredOptions.length === 0 && (
              <>
                <div className="notdatafound02">
                  <iframe
                    src="https://lottie.host/embed/4a834d37-85a4-4cb7-b357-21123d50c03a/JV0IcupZ9W.json"
                    frameBorder="0"
                  ></iframe>
                </div>
                <div className="dropdown-option centeraligntext">No options found</div>
              </>
            )}
          </div>
        )
      }
    </div >
  );
});

export default CustomDropdown23;
