import React from 'react';

const NumericInput = ({ value, onChange, name, placeholder, ...rest }) => {
    return (
        <input
            autoComplete='off'
            type="text"
            value={value}
            onChange={onChange}
            name={name}
            placeholder={placeholder}
            inputMode="decimal" // Suggests a numeric keypad on mobile devices
            pattern="^\d*\.?\d*$" // Validates the input against this pattern
            onInput={(e) => {
                if (!/^\d*\.?\d*$/.test(e.target.value)) {
                    e.target.value = e.target.value.slice(0, -1);
                }
            }}
            {...rest}
            autocomplete="off"
        />
    );
};

export default NumericInput;
