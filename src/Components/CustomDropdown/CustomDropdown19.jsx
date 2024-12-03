import React, { forwardRef ,useEffect} from 'react';
import DropDownHelper from '../../Views/Helper/DropDownHelper';

const CustomDropdown19 = forwardRef((props, ref) => {
  const {
    label,
    options,
    value,
    onChange,
    name,
    defaultOption,
    type,
    setBasicDetailsDisplayName,
  } = props;

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
    setFocusedOptionIndex, // Add this to manage focus index
  } = DropDownHelper(options, onChange, name, type, "", "", setBasicDetailsDisplayName);

  const combinedRef = (node) => {
    dropdownRef.current = node;
    if (ref) ref.current = node;
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (options?.length > 0) {
      setFocusedOptionIndex(0); // Automatically focus the first option
    }
  };
  useEffect(() => {
    if (ref?.current) {
      ref.current.focus();
    }
  }, [ref]);

  return (
    <div>
      <input
      
        ref={ref}
        onKeyDown={handleKeyDown}
        style={{ width: '100%' }}
        type="text"
        name={name}
        value={value}
        onClick={handleInputFocus}
        placeholder={defaultOption}
        autoComplete="off"
        onChange={onChange}
      />
      <div className="customdropdownx12s86" ref={dropdownRef} >
        {options?.length >= 1 && isOpen ? (
          <div className="dropdown-options">
            <div className="dropdownoptoscroll">
              {options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={
                    'dropdown-option' +
                    (option === value ? ' selectedoption' : '') +
                    (index === focusedOptionIndex ? ' focusedoption' : '')
                  }
                  ref={(el) => (optionRefs.current[index] = el)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ) : ""}
      </div>
    </div>
  );
});

export default CustomDropdown19;
