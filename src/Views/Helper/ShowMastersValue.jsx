import React from 'react'
import { useSelector } from 'react-redux';

const ShowMastersValue = ({ type, id }) => {
    const masterData = useSelector(state => state?.masterData?.masterData);

    const allMasters = masterData?.filter(type_id => type_id?.type === type);

    const findUnitNameById = () => {
        const lable = allMasters?.find(unit => unit.labelid === id);
        return lable ? lable.label : '';
    };
    return (
        <>{findUnitNameById()}</>
    )
}

export default ShowMastersValue;