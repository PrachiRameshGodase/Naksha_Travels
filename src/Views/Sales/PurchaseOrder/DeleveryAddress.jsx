import React, { useEffect, useState } from 'react'
import { activeOrg_details } from '../../Helper/HelperFunctions';

const DeleveryAddress = ({ onSendData, formdatas }) => {
    const { formData } = formdatas;


    const { name, email, street1, street2, mobile_no } = activeOrg_details
    const [selectedOption, setSelectedOption] = useState("1");

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        onSendData(event.target.value)
    };
    useEffect(() => {

    }, [selectedOption])


    return (
        <div className="f1wrapofcreqx1">
            <div className="cust_dex1s1">
                <p>Delivery address</p>

                <div id="radio-toggle">
                    <label htmlFor="organization">Organization</label>
                    <input
                        type="radio"
                        id="organization"
                        name="delivery-address"
                        value="1"
                        checked={selectedOption === '1'}
                        onChange={handleOptionChange}
                    />

                    <label htmlFor="customer">Customer</label>
                    <input
                        type="radio"
                        id="customer"
                        name="delivery-address"
                        value="2"
                        checked={selectedOption === '2'}
                        onChange={handleOptionChange}
                    />
                </div>

            </div>

        </div>
    )
}

export default DeleveryAddress