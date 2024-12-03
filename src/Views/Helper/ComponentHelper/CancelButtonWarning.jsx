// CancelButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CancelButton = ({ cancelPath, className = "firstbtnc2" }) => {
    const navigate = useNavigate();

    const handleCancelClick = async (e) => {
        e.preventDefault(); // Prevent the default navigation behavior

        // Show the Swal confirmation dialog
        const result = await Swal.fire({
            text: `Do you want to cancel this ${cancelPath}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        });

        // If the user confirms, navigate to the cancel URL
        if (result.isConfirmed) {
            navigate(`/dashboard/${cancelPath}`);
        }
    };

    return (
        <button onClick={handleCancelClick} className={className}>
            Cancel
        </button>
    );
};

export default CancelButton;
