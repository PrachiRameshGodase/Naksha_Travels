import React, { useEffect, useRef, useState } from 'react'
import { Toaster } from 'react-hot-toast';
import { RxCross2 } from 'react-icons/rx';
import NumericInput from '../Helper/NumericInput';
import { useDispatch } from 'react-redux';
import { autoGenerateId } from '../../Redux/Actions/globalActions';


const GenerateIdPopup = ({ formdatas }) => {
    const dispatch = useDispatch();
    const { autoData, setAutoData, setGenerateId, setSearchTrigger } = formdatas;
    const [inputValue, setInputValue] = useState("auto");


    const [formData, setFormData] = useState({
        prefix: autoData?.prefix,
        sequence_number: autoData?.sequence_number,
        delimiter: autoData?.delimiter,
        module: autoData?.module,
        sequence_type: autoData?.sequence_type,
        id: autoData?.id
    });


    const popupRef = useRef(null);

    const handleSubmitCategory = () => {
        if (inputValue === "auto") {
            dispatch(autoGenerateId(formData, setSearchTrigger));
            setAutoData((prev) => ({
                ...prev,
                prefix: formData?.prefix,
                sequence_number: formData?.sequence_number,
                delimiter: formData?.delimiter
            }));
            setGenerateId(false);
        } else {
            setGenerateId(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <Toaster />
            <div className="mainxpopups1" ref={popupRef} tabIndex="0">
                <div className="popup-content">
                    <div id='autoIdpopup_34'>
                        <span className="close-button" onClick={() => setGenerateId(false)}><RxCross2 /></span>
                        <h2 >Configure Estimate Number Preferences
                        </h2>

                        <p className='top_para'>
                            Your sales order numbers are set on auto-generate mode to save your time. Are you sure about changing this setting?
                        </p>

                        <div className="midpopusec12">
                            <div className='midpopusec12_div'>
                                <label className='toggle_input_label'>
                                    <input className='toggle_input' type="radio" checked={inputValue === "auto"} value="auto" onClick={() => setInputValue("auto")} onChange={handleChange} name="salesOrderOption" />
                                    <p >Continue auto-generating sales order numbers</p>
                                </label>
                            </div>
                            {
                                inputValue === "auto" && (
                                    <div className="form_commonblock" style={{ padding: "10px" }}>
                                        <div className='midpopusec12_div'>
                                            <div >
                                                <label style={{ padding: "10px" }}>Prefix</label>
                                                <span>
                                                    <input name="prefix" autoFocus="on" value={formData.prefix} onChange={handleChange} autocomplete="off" />
                                                </span>
                                            </div>
                                            <div >
                                                <label style={{ margin: "2px" }}>Delimiter</label>
                                                <span>
                                                    <input name="delimiter" value={formData.delimiter} onChange={handleChange} autocomplete="off" />
                                                </span>
                                            </div>
                                            <div >
                                                <label style={{ margin: "2px" }}>Next Number</label>
                                                <span>
                                                    <NumericInput name="sequence_number" value={formData.sequence_number} onChange={handleChange} autocomplete="off" />
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                )
                            }

                            <div className='midpopusec12_div'>
                                <label className='toggle_input_label'>
                                    <input
                                        className='toggle_input'
                                        style={{ width: "5%" }}
                                        type="radio"
                                        value="manual"
                                        checked={inputValue === "manual"}
                                        onClick={() => setInputValue("manual")}
                                        onChange={handleChange}
                                        name="salesOrderOption"
                                    />
                                    <p>Enter sales order numbers manually</p>
                                </label>
                            </div>
                            <div style={{
                                display: "flex", padding: "11px 17px",
                                justifyContent: "start", width: "100%", gap: "10px", textAlign: "center"
                            }}>
                                <div tabIndex="0" style={{ width: "75px", padding: "10px", borderRadius: "5px", backgroundColor: "rgb(93,54,159)", cursor: "pointer" }} onClick={handleSubmitCategory}>

                                    <p style={{ color: "white" }}>Save</p>

                                </div>

                                <div tabIndex="0" style={{ width: "75px", padding: "10px", borderRadius: "5px", backgroundColor: "rgb(245,243,249)", cursor: "pointer" }} onClick={() => setGenerateId(false)}>


                                    <p style={{ color: "black", fontWeight: "bolder" }}>Cancel</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}

export default GenerateIdPopup;
