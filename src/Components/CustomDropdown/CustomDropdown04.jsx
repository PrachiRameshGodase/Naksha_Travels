import React, { forwardRef } from 'react';
import DropDownHelper from '../../Views/Helper/DropDownHelper';
import { RiSearch2Line } from 'react-icons/ri';

const CustomDropdown04 = forwardRef((props, ref) => {
  let { options, value, onChange, name, type, defaultOption, extracssclassforscjkls } = props;
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

  // console.log("options", options)

  //these search belog to only serach to type masters related...
  // let filteredOptions = []
  // filteredOptions = searchTerm?.length === 0 ? options : options.filter(option =>
  //   option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  // );

  if (type === "masters") {
    options = searchTerm?.length === 0 ? options : options.filter(option =>
      option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  }


  return (
    <div ref={combinedRef} tabIndex="0" className={`customdropdownx12s86 ${extracssclassforscjkls}`} onKeyDown={handleKeyDown}>
      <div onClick={() => setIsOpen(!isOpen)} className={"dropdown-selected" + (value ? ' filledcolorIn' : '')} >

        {type === "masters_salutation" ?
          <>
            {value ? options?.find(account => account?.label == value)?.label : defaultOption}
          </>
          :
          <>
            {value ? options?.find(account => account?.labelid == value)?.label : defaultOption}

          </>}
        <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.2852 0.751994C11.2852 0.751994 7.60274 5.75195 6.28516 5.75195C4.96749 5.75195 1.28516 0.751953 1.28516 0.751953" stroke="#797979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {isOpen && (
        <div className="dropdown-options">
          <RiSearch2Line id="newsvgsearchicox2" />
          <input
            autoComplete='off'
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dropdown-search"
            ref={inputRef}
          />
          <div className="dropdownoptoscroll">
            {options?.map((option, index) => (
              <div
                key={option.labelid}
                ref={(el) => (optionRefs.current[index] = el)}
                onClick={() => handleSelect(option)}
                className={
                  "dropdown-option" +
                  (option.labelid === value ? " selectedoption" : "") +
                  (index === focusedOptionIndex ? " focusedoption" : "")
                }
              >
                {option.label}
              </div>
            ))}
            {options?.length === 0 &&
              <>
                <div className="notdatafound02">
                  <iframe src="https://lottie.host/embed/4a834d37-85a4-4cb7-b357-21123d50c03a/JV0IcupZ9W.json" frameBorder="0"></iframe>
                </div>
                <div className="dropdown-option centeraligntext">No options found</div>
              </>
            }
          </div>
        </div>
      )}
    </div>
  );
});

export default CustomDropdown04;
