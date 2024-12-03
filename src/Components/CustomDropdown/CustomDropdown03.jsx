import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { GoPlus } from 'react-icons/go';
import DropDownHelper from '../../Views/Helper/DropDownHelper';
import { RiSearch2Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { TableViewSkeletonDropdown } from '../SkeletonLoder/TableViewSkeleton';
import { categoryList, itemLists } from '../../Redux/Actions/listApisActions';


const CustomDropdown03 = forwardRef((props, ref) => {
  let { options, value, setShowPopup, onChange, name, type, setItemData, defaultOption, index, extracssclassforscjkls, className } = props;
  const dispatch = useDispatch();
  const nextFocusRef = useRef(null);

  const {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    dropdownRef,
    inputRef,
    optionRefs,
    handleKeyDown,
    handleSelect,
    focusedOptionIndex,
  } = DropDownHelper(options, onChange, name, type, setItemData, nextFocusRef);


  const itemList = useSelector(state => state?.itemList);
  const categoryLists = useSelector(state => state?.categoryList);



  //for focus on page load
  // if (index) {
  //   useEffect(() => {
  //     if (!hasMounted.current) {
  //       hasMounted.current = true;
  //     } else {
  //       dropdownRef.current.focus();
  //     }
  //   }, [index]);
  // }

  const combinedRef = (node) => {
    dropdownRef.current = node;
    if (ref) ref.current = node;
  };


  if (type === "sub_categories") {
    options = searchTerm?.length === 0 ? options : options.filter(option =>
      option?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  }

  // Debounce hook for search term to reduce API call frequency
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Adjust delay as needed

  // Trigger API calls based on dropdown open state and search term
  useEffect(() => {
    if (isOpen || debouncedSearchTerm.length > 0) {
      const sendData = {
        fy: "2024",
        noofrec: 15,
        active: 1,
        search: debouncedSearchTerm,
      };


      if (type === "sub_categories") {
        dispatch(categoryList(sendData)); // Adjust to your category API action
      } else {
        dispatch(itemLists(sendData));
      }
    }
  }, [isOpen, debouncedSearchTerm, type, dispatch]);

  return (
    <div
      tabIndex="0"
      ref={combinedRef}
      className={`customdropdownx12s86 ${extracssclassforscjkls} `}
      onKeyDown={handleKeyDown}
      style={{ position: className ? "static" : "relative" }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={"dropdown-selected" + (value ? ' filledcolorIn' : '')}
      >
        {value ? options?.find(option => option.id === value)?.name : defaultOption}
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
      {isOpen && (
        <div className={`dropdown-options`} id={className}>
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

          {(itemList?.loading || categoryLists?.loading) ? <>
            <TableViewSkeletonDropdown />
          </>
            : <>
              <div className="dropdownoptoscroll">

                {options?.map((option, index) => (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    ref={(el) => (optionRefs.current[index] = el)}
                    className={
                      "dropdown-option" +
                      (option.id === value ? " selectedoption" : "") +
                      (index === focusedOptionIndex ? " focusedoption" : "") +
                      (option.active == "0" ? " inactive-category" : "")
                    }
                    {...(option.active === "0"
                      ? {
                        "data-tooltip-content": "To select this option, activate it; it's currently inactive.",
                        "data-tooltip-id": "my-tooltip",
                        "data-tooltip-place": "right"
                      }
                      : {})}
                  >
                    {option?.name}
                    {option?.category?.name ? ` / ${option.category.name}` : ''}
                    {option?.sub_category?.name ? ` / ${option.sub_category.name}` : ''}
                  </div>
                ))}

              </div>
              {options.length === 0 && (
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
            </>}

          {name === "item_id" ?
            <div className="lastbuttonsecofdropdown">
              <p style={{ cursor: "pointer" }} onClick={() => setShowPopup(true)}>
                Add Item
                <GoPlus />
              </p>
            </div>
            : name === "warehouse_id" ?
              <div className="lastbuttonsecofdropdown">
                <p style={{ cursor: "pointer" }} onClick={() => setShowPopup(true)}>
                  Add Warehouse
                  <GoPlus />
                </p>
              </div> :
              name === "zone_id" ?
                <div className="lastbuttonsecofdropdown">
                  <p style={{ cursor: "pointer" }} onClick={() => setShowPopup(true)}>
                    Add Zone
                    <GoPlus />
                  </p>
                </div> :
                name === "rack_id" ?
                  <div className="lastbuttonsecofdropdown">
                    <p style={{ cursor: "pointer" }} onClick={() => setShowPopup(true)}>
                      Add Rack
                      <GoPlus />
                    </p>
                  </div> :

                  <div className="lastbuttonsecofdropdown">
                    <p style={{ cursor: "pointer" }} onClick={() => setShowPopup(true)}>
                      Add Category
                      <GoPlus />
                    </p>
                  </div>
          }
        </div>
      )
      }
    </div >
  );
});

export default CustomDropdown03;
