import React from 'react';

const TextAreaComponentWithTextLimit = ({ formsValues: { handleChange }, placeholder, name, value }) => {
    const charCount = value ? value.trim().length : 0;

    return (
        <>
            <textarea
                placeholder={placeholder}
                value={value == 0 ? "" : value}
                onChange={handleChange}
                name={name}
                maxLength={200}
            />
            <p>{charCount}/200</p>
        </>
    );
};

export default TextAreaComponentWithTextLimit;
