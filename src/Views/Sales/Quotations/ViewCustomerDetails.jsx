import React from 'react'
import { RxCross2 } from 'react-icons/rx'
import { Link } from 'react-router-dom'
import { formatDate } from '../../Helper/DateFormat'
import ShowMastersValue from '../../Helper/ShowMastersValue'

const ViewCustomerDetails = ({ setSwitchCusDatax1, setViewAllCusDetails, cusData, viewAllCusDetails, switchCusDatax1 }) => {
    const getOrdinalIndicator = (index) => {
        const j = index % 10;
        const k = index % 100;
        if (j === 1 && k !== 11) {
            return "st";
        }
        if (j === 2 && k !== 12) {
            return "nd";
        }
        if (j === 3 && k !== 13) {
            return "rd";
        }
        return "th";
    };

    let billingIndex = 0;
    let shippingIndex = 0;

    return (
        <div className="showCustomerDetails">

            {viewAllCusDetails &&
                <>
                    <div className="cus_moreDetails">
                        <div className="cust_dex1s1">
                            <Link to={`/dashboard/customer-details?id=${cusData?.id}`} target='_blank' className="childcusdexs12">
                                <p>{(cusData?.first_name || "") + " " + (cusData?.last_name || "")}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#0d54b8"} fill={"none"}>
                                    <path d="M11.1193 2.99756C6.55993 3.45035 2.99902 7.29809 2.99902 11.9777C2.99902 16.9619 7.03855 21.0024 12.0216 21.0024C16.7 21.0024 20.5468 17.4407 20.9996 12.8802" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M20.5581 3.49381L11.0488 13.059M20.5581 3.49381C20.064 2.99905 16.7356 3.04517 16.032 3.05518M20.5581 3.49381C21.0521 3.98857 21.0061 7.3215 20.9961 8.02611" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                            </Link>
                            <div className="childcusdexs13" onClick={() => setViewAllCusDetails(false)}>
                                <RxCross2 />
                            </div>

                        </div>
                        <div className="cusparentofnavbarx5s">
                            <p className={` ${switchCusDatax1 === "Details" && 'selectedbtnx3'}`} onClick={() => setSwitchCusDatax1("Details")}>Details</p>
                            <p className={` ${switchCusDatax1 === "Contact_person" && 'selectedbtnx3'}`} onClick={() => setSwitchCusDatax1("Contact_person")}>Contact Person</p>
                            {/* <p className={` ${switchCusDatax1 === "Activity_log" && 'selectedbtnx3'}`} onClick={() => setSwitchCusDatax1("Activity_log")}>Activity log</p> */}
                            <p className={` ${switchCusDatax1 === "address" && 'selectedbtnx3'}`} onClick={() => setSwitchCusDatax1("address")}>Address</p>
                        </div>

                        {switchCusDatax1 === "Details" &&
                            <>

                                {/* <div className="cust_dex1s2">
                                    <div className="cus1xs1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                            <path d="M16 14C16 14.8284 16.6716 15.5 17.5 15.5C18.3284 15.5 19 14.8284 19 14C19 13.1716 18.3284 12.5 17.5 12.5C16.6716 12.5 16 13.1716 16 14Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M4 20C2.89543 20 2 19.1046 2 18C2 16.8954 2.89543 16 4 16C5.10457 16 6 17.3333 6 18C6 18.6667 5.10457 20 4 20Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M8 20C6.89543 20 6 18.5 6 18C6 17.5 6.89543 16 8 16C9.10457 16 10 16.8954 10 18C10 19.1046 9.10457 20 8 20Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M13 20H16C18.8284 20 20.2426 20 21.1213 19.1213C22 18.2426 22 16.8284 22 14V13C22 10.1716 22 8.75736 21.1213 7.87868C20.48 7.23738 19.5534 7.06413 18 7.01732M10 7H16C16.7641 7 17.425 7 18 7.01732M18 7.01732C18 6.06917 18 5.5951 17.8425 5.22208C17.6399 4.7421 17.2579 4.36014 16.7779 4.15749C16.4049 4 15.9308 4 14.9827 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 7.22876 2 11V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <div className='spanfistrc1s5'>
                                            <p>Outstanding receivables</p>
                                            <h2>953</h2>
                                        </div>
                                    </div>

                                </div> */}



                                <div className="cust_dex1s3" style={{display:"flex",gap:"25px"}}>

                                    <div className="cusx1s2" id='primaryContainer'>
                                        <div className="cuschildx1s2">Primary Details</div>
                                        <div className="cuschichildlistd">
                                            <div className='chilscx15s5sx1'> <p className="px1s1">Primary Contact Name</p> <p className="px1s2">:</p> <p className="px1s3">{`${cusData?.salutation || ""} ${cusData?.first_name || ""} ${cusData?.last_name || ""}`}</p></div>
                                            <div className='chilscx15s5sx1'> <p className="px1s1">Display Name</p> <p className="px1s2">:</p> <p className="px1s3">{cusData?.display_name || ""}</p></div>
                                            <div className='chilscx15s5sx1'> <p className="px1s1">Registation Type</p> <p className="px1s2">:</p> <p className="px1s3">{cusData?.registration_type || ""}</p></div>
                                            <div className='chilscx15s5sx1'> <p className="px1s1">Bussiness Leagal Name</p> <p className="px1s2">:</p> <p className="px1s3">{cusData?.business_leagal_name || ""}</p></div>
                                            <div className='chilscx15s5sx1'> <p className="px1s1">Payment Terms</p> <p className="px1s2">:</p> <p className="px1s3"><ShowMastersValue type="13" id={cusData?.payment_terms} /></p></div>
                                            <div className='chilscx15s5sx1'> <p className="px1s1">Remarks</p> <p className="px1s2" >:</p> <p className="px1s3"> {cusData?.remarks || ""}</p></div>

                                        </div>
                                    </div>
                                    <div className="cusx1s2" style={{width:"100%"}}>
                                        <div className="cuschildx1s2">Primary Contact Details</div>
                                        <div className="cuschichildlistd" >
                                            <div className='chilscx15s5sx1'> <p className="px1s1">Mobile Number</p> <p className="px1s2" style={{marginRight:"5px"}}>:</p> <p  style={{marginRight:"160px"}} className="px1s3">{`${cusData?.mobile_no || ""}`}</p></div>
                                            <div className='chilscx15s5sx1'> <p className="px1s1">Work Phone</p> <p className="px1s2" style={{marginRight:"5px"}}>:</p> <p style={{marginRight:"160px"}}  className="px1s3">{cusData?.work_phone || ""}</p></div>
                                            {/* <div className='chilscx15s5sx1' > <p className="px1s1">Website</p> <p className="px1s2" style={{marginRight:"10px"}} >:</p> <p className="px1s3">{cusData?.website || ""}</p>  </div> */}
                                            <div className='chilscx15s5sx1'> <p className="px1s1">Website</p> <div style={{marginLeft:"50px",paddingLeft:"5px"}} > <p className="px1s2" style={{marginRight:"12px"}}>:</p> </div> <div style={{width:"55%",marginLeft:"10px"}}><p style={{marginRight:"65px"}}  className="px1s3">{cusData?.website || ""}</p> </div> </div>

                                        </div>
                                    </div>



                                    {/* NEW LOOKING OF ADDRESS */}
                                    {/* <div className="cusx1s2">
                                        <div className="cuschildx1s2">
                                            Address <p>{cusData?.address?.length}Total</p>
                                        </div>
                                        <div className="cuschichildlistdx2">

                                            {
                                                cusData?.address?.length >= 0 ?
                                                    <>
                                                        {cusData?.address?.map((val, index) => (
                                                            <>
                                                                <div className='chilscx15s5sx1' key={index}>
                                                                    <div className="psxjks40s1"> {val?.is_billing === "1" && "Billing"} {val?.is_billing === "1" && val?.is_shipping === "1" && "and"} {val?.is_shipping === "1" && "Shipping"} Address </div>
                                                                    <div className="psxjks40s2">
                                                                        <div><b> Address: </b><br /> {val?.street_1 || ""}<br /> {val?.street_2 || ""}<br /> {val?.landmark || ""}<br />{val?.locality || ""}<br />{val?.house_no || ""} </div>
                                                                        <div> <b>Contact:</b> <br /> Phone: {val?.phone_no || ""} <br /> Fax Number: {val?.fax_no || ""} Zip Code: {val?.zip_code || ""} </div>
                                                                    </div>
                                                                </div>
                                                                <div className="breakerci"></div>
                                                            </>
                                                        ))}

                                                    </>
                                                    :
                                                    "No address found"
                                            }
                                        </div>
                                    </div> */}
                                    {/* NEW LOOKING OF ADDRESS */}

                                </div>

                            </>
                        }

                        {switchCusDatax1 === "Contact_person" &&
                            <>
                                <div className="contactpersonosc1s4sd54f">
                                    <div className="fistchils45s">
                                        <p className='cifs2x3s6z1'>FULL NAME</p>
                                        <p className='cifs2x3s6z2'>MOBILE NUMBER</p>
                                        <p className='cifs2x3s6z3'>WORK PHONE</p>
                                        <p className='cifs2x3s6z4' style={{ flex: 1.6 }}>EMAIL</p>
                                        <p className='cifs2x3s6z4'>DESIGNATION</p>
                                    </div>
                                    <div className="cs546sx2w52">
                                        {
                                            cusData?.contact_person?.length >= 1 ?
                                                <>
                                                    {cusData?.contact_person?.map((val, index) => (
                                                        <div className="tarowfistchils45s">
                                                            <p className='cifs2x3s6z1'>{(val?.salutation || "") + " " + (val?.first_name || "") + " " + (val?.last_name || "")}</p>
                                                            <p className='cifs2x3s6z2'>{val?.mobile_no || ""}</p>
                                                            <p className='cifs2x3s6z3'>{val?.work_phone || ""}</p>
                                                            <p className='cifs2x3s6z4' style={{ flex: 1.6 }}>{val?.email || ""}</p>
                                                            <p className='cifs2x3s6z4' >{val?.designation || ""}</p>
                                                        </div>
                                                    ))}

                                                </>
                                                :
                                                "No contact available"
                                        }
                                    </div>

                                </div>
                            </>
                        }

                        {switchCusDatax1 === "address" && (
                            <div className="contactpersonosc1s4sd54f">
                                {/* Table Headers */}
                                <div className="fistchils45s">
                                    <p className='cifs2x3s6z1'>ADDRESS TYPE</p>
                                    <p className='cifs2x3s6z3'>COUNTRY</p>
                                    <p className='cifs2x3s6z4'>PROVINCE</p>
                                    <p className='cifs2x3s6z4'>CITY</p>
                                    <p className='cifs2x3s6z4'>ADDRESS</p>
                                </div>

                                <div className="cs546sx2w52">
                                    {cusData?.address?.length >= 1 ? (
                                        cusData?.address?.map((val, index) => {
                                            const isBilling = val?.is_billing === "1";
                                            const isShipping = val?.is_shipping === "1";

                                            // Ensure that all properties used here are strings or valid renderable types
                                            const country = val?.country?.name || "";
                                            const state = val?.state?.name || "";
                                            const city = val?.city?.name || "";
                                            const address = `${val?.street_1 || ""} ${val?.street_2 || ""}`.trim();

                                            return (
                                                <React.Fragment key={index}>
                                                    {/* Show Billing Address if applicable */}
                                                    {isBilling && (
                                                        <div className="tarowfistchils45s">
                                                            <p className='cifs2x3s6z1'>
                                                                {++billingIndex}{getOrdinalIndicator(billingIndex)} Billing Address
                                                            </p>
                                                            <p className='cifs2x3s6z2'>{country}</p>
                                                            <p className='cifs2x3s6z4'>{state}</p>
                                                            <p className='cifs2x3s6z3'>{city}</p>
                                                            <p className='cifs2x3s6z3'>{address}</p>
                                                        </div>
                                                    )}

                                                    {/* Show Shipping Address if applicable */}
                                                    {isShipping && (
                                                        <div className="tarowfistchils45s">
                                                            <p className='cifs2x3s6z1'>
                                                                {++shippingIndex}{getOrdinalIndicator(shippingIndex)} Shipping Address
                                                            </p>
                                                            <p className='cifs2x3s6z2'>{country}</p>
                                                            <p className='cifs2x3s6z4'>{state}</p>
                                                            <p className='cifs2x3s6z3'>{city}</p>
                                                            <p className='cifs2x3s6z3'>{address}</p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })
                                    ) : (
                                        <p>No contact available</p>
                                    )}
                                </div>
                            </div>
                        )}




                        {/* {switchCusDatax1 === "Activity_log" &&
                            <>
                                <div className="activitylogxjks">
                                    <div className="childactivuytsd154">
                                        <div className="datscxs445sde">April 27, 2024</div>
                                        <div className="flexsd5fs6dx6w">
                                            <div className="svgfiwithrolin">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                    <path d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <p className='sdf623ptag'>09.45AM</p>
                                            <div className="descxnopcs45s">
                                                <div className="chislsdf465s"><p>Payment to be collected</p> <b>By Mr.Arman</b></div>
                                                <p className='c99atags56d'>Lorem ipsum dolor sit amet consectetur. Enim dis sem pretium gravida enim nunc.</p>
                                            </div>
                                        </div>
                                        <div className="flexsd5fs6dx6w">
                                            <div className="svgfiwithrolin">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                    <path d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <p className='sdf623ptag'>09.45AM</p>
                                            <div className="descxnopcs45s">
                                                <div className="chislsdf465s"><p>Payment to be collected</p> <b>By Mr.Arman</b></div>
                                                <p className='c99atags56d'>Lorem ipsum dolor sit amet consectetur. Enim dis sem pretium gravida enim nunc.</p>
                                            </div>
                                        </div>
                                        <div className="flexsd5fs6dx6w">
                                            <div className="svgfiwithrolin">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                    <path d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <p className='sdf623ptag'>09.45AM</p>
                                            <div className="descxnopcs45s">
                                                <div className="chislsdf465s"><p>Payment to be collected</p> <b>By Mr.Arman</b></div>
                                                <p className='c99atags56d'>Lorem ipsum dolor sit amet consectetur. Enim dis sem pretium gravida enim nunc.</p>
                                            </div>
                                        </div>
                                        <div className="flexsd5fs6dx6w">
                                            <div className="svgfiwithrolin">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                    <path d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <p className='sdf623ptag'>09.45AM</p>
                                            <div className="descxnopcs45s">
                                                <div className="chislsdf465s"><p>Payment to be collected</p> <b>By Mr.Arman</b></div>
                                                <p className='c99atags56d'>Lorem ipsum dolor sit amet consectetur. Enim dis sem pretium gravida enim nunc.</p>
                                            </div>
                                        </div>
                                        <div className="flexsd5fs6dx6w">
                                            <div className="svgfiwithrolin">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                    <path d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <p className='sdf623ptag'>09.45AM</p>
                                            <div className="descxnopcs45s">
                                                <div className="chislsdf465s"><p>Payment to be collected</p> <b>By Mr.Arman</b></div>
                                                <p className='c99atags56d'>Lorem ipsum dolor sit amet consectetur. Enim dis sem pretium gravida enim nunc.</p>
                                            </div>
                                        </div>
                                        <div className="flexsd5fs6dx6w">
                                            <div className="svgfiwithrolin">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                    <path d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <p className='sdf623ptag'>09.45AM</p>
                                            <div className="descxnopcs45s">
                                                <div className="chislsdf465s"><p>Payment to be collected</p> <b>By Mr.Arman</b></div>
                                                <p className='c99atags56d'>Lorem ipsum dolor sit amet consectetur. Enim dis sem pretium gravida enim nunc.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        } */}
                    </div>
                </>
            }

        </div>)
}

export default ViewCustomerDetails