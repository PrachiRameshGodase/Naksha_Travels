import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { RiSearch2Line } from 'react-icons/ri';

const CustomDropdown17 = forwardRef((props, ref) => {
  const { options, value, onChange, name, defaultOption, sd154w78s877 } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange({ target: { name, value: option.id } }); // Change here to pass option.id
    setIsOpen(false);
    setSearchTerm('');
  };

  const filteredOptions = searchTerm.length === 0 ? options : options?.filter(option =>
    option?.invoice_id?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const combinedRef = (node) => {
    dropdownRef.current = node;
    if (ref) ref.current = node;
  };

  return (
    <div ref={combinedRef} tabIndex="0" className={`customdropdownx12s86 ${sd154w78s877}`}  >
      <div onClick={() => setIsOpen(!isOpen)} className={"dropdown-selected" + (value ? ' filledcolorIn' : '')}>
        {value ? options?.find(account => account?.id === value)?.invoice_id : defaultOption}
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
          />
          <div className="dropdownoptoscroll">
            {filteredOptions?.map(option => (
              <div key={option.id} onClick={() => handleSelect(option)} className={"dropdown-option" + (option.id === value ? " selectedoption" : "")}>
                {option.invoice_id}
              </div>
            ))}
            {filteredOptions?.length === 0 &&
              <>
                <div className="notdatafound02">
                  <iframe src="https://lottie.host/embed/4a834d37-85a4-4cb7-b357-21123d50c03a/JV0IcupZ9W.json" frameBorder="0"></iframe>
                </div>
                <div className="dropdown-option centeraligntext">No Invoice found for this Customer</div>
              </>
            }
          </div>
        </div>
      )}
    </div>
  );
});

export default CustomDropdown17;
