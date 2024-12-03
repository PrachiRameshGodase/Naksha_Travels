import React from 'react'

const ShowCustomerInfoButton = ({ cusData, viewAllCusDetails, setViewAllCusDetails }) => {
    return (
        <>
            {cusData &&
                <div className="view_all_cus_deial_btn">
                    <button
                        type="button"
                        onClick={() => setViewAllCusDetails(!viewAllCusDetails)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                setViewAllCusDetails(!viewAllCusDetails);
                            }
                        }}
                    >
                        {viewAllCusDetails ? 'Hide Customer Information' : 'View Customer Information'}
                    </button>
                </div>
            }

        </>
    )
}

export default ShowCustomerInfoButton