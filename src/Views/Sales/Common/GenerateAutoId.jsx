import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import GenerateIdPopup from '../../Home/GenerateIdPopup';
import { ShowAutoGenerateId } from '../../Helper/HelperFunctions';
import WaveLoader from '../../../Components/Loaders/WaveLoader';

const GenerateAutoId = ({ formHandlers: { setFormData, handleChange, setShowAllSequenceId }, nameVal, value, module, showField }) => {
    const { loading } = useSelector(state => state?.autoIdList);
    const autoId = ShowAutoGenerateId(module, showField);
    const [generateId, setGenerateId] = useState(false);
    const [autoData, setAutoData] = useState({ prefix: null, delimiter: null, sequence_number: null, sequence_type: 1, module: null, id: null });

    const [searchTrigger, setSearchTrigger] = useState(0);

    useEffect(() => {
        const { prefix, delimiter, sequence_number, module, id, sequence_type } = autoId || {};
        if (prefix !== autoData.prefix || delimiter !== autoData.delimiter || sequence_number !== autoData.sequence_number || module !== autoData.module || id !== autoData.id) {
            setAutoData({ prefix, delimiter, sequence_number, module, id, sequence_type });
        }
    }, [autoId]);

    useEffect(() => {
        if (!showField) {//use when we update the module sequence id is not fetched form sequence list..
            setFormData(prev => ({ ...prev, [nameVal]: `${autoData.prefix}${autoData.delimiter}${autoData.sequence_number}` }));
            setShowAllSequenceId({ ...autoData });
        }
    }, [autoData, nameVal, setFormData, setShowAllSequenceId, autoId, showField]);

    return (
        <>
            <span>
                {loading && <WaveLoader />}
                {otherIcons.tag_svg}
                <input
                    type="text"
                    value={loading ? "" : value}
                    onChange={handleChange}
                    name={nameVal}
                    autoComplete='off'
                    disabled={autoData.sequence_type === 1}
                    style={{ cursor: "not-allowed" }}
                />
                {!showField && <span onClick={() => setGenerateId(true)}>{otherIcons.setting_icon}</span>}
            </span>
            {generateId && <GenerateIdPopup formdatas={{ autoData, setAutoData, setGenerateId, setSearchTrigger }} />}
        </>
    );
};

export default GenerateAutoId;
