import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'


const AllProductsOfDvts = () => {

        const handleClick = () => {
                // Fetch the keys from localStorage
                const accessToken = localStorage.getItem('AccessToken');
                const userData = localStorage.getItem('UserData');

                // Create the URL with the parameters
                const url = `https://manufacturing.megamarket.ltd?AccessToken=${encodeURIComponent(accessToken)}&UserData=${encodeURIComponent(userData)}`;

                // Redirect to the new URL
                window.location.href = url;
        };

        const handleClick1 = () => {
                // Fetch the keys from localStorage
                const accessToken = localStorage.getItem('AccessToken');
                const userData = localStorage.getItem('UserData');

                // Create the URL with the parameters
                const url = `https://accounts.nakshatravels.com?AccessToken=${encodeURIComponent(accessToken)}&UserData=${encodeURIComponent(userData)}`;

                // Redirect to the new URL
                window.location.href = url;
        };

        const clearLocalStoragex1 = () => {
                localStorage.clear();
                window.location.reload();
        };

        return (
                <>
                        <div className="allproductsofdetsclk">
                                <div onClick={clearLocalStoragex1} className="logouticonsfoernsklc">
                                        <div className="sxcs5dfs85df45">
                                                <Link className="buttonx3">  <span className="asdf">Logout</span></Link>
                                                {/* <img src="https://cdn-icons.flaticon.com/svg/5528/5528120.svg?token=exp=1725437849~hmac=d9a751d62b353298fcbe54d7a2ca353b" alt="" /> */}

                                                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 32 32" style={{ enableBackground: "new 0 0 512 512" }} xml:space="preserve" class=""><g transform="matrix(6.123233995736766e-17,-1,1,6.123233995736766e-17,0.002899169921875,32.002899169921875)"><linearGradient id="a" x1=".23" x2="21.77" y1="26.77" y2="5.23" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#339"></stop><stop offset=".1" stop-color="#3c319b"></stop><stop offset=".26" stop-color="#542ba1"></stop><stop offset=".47" stop-color="#7c21ab"></stop><stop offset=".7" stop-color="#b313b9"></stop><stop offset=".97" stop-color="#f902ca"></stop><stop offset=".99" stop-color="#f0c"></stop></linearGradient><path fill="url(#a)" d="M20 23v4.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 2 27.5v-23A2.5 2.5 0 0 1 4.5 2h13A2.5 2.5 0 0 1 20 4.5V9a1 1 0 0 1-2 0V4.5a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5v23a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V23a1 1 0 0 1 2 0zm9.71-7.71-4.95-4.95a1 1 0 0 0-1.42 1.42L26.59 15H9.52a1 1 0 0 0 0 2h17.07l-3.25 3.24a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.95-4.95a1 1 0 0 0 0-1.42z" opacity="1" data-original="url(#a)" class=""></path></g></svg>
                                        </div>
                                </div>

                                <div className="logoofkcs42w5wss">
                                        <img src="/Naksha.png" alt="" style={{ height: "156px" }} />
                                </div>

                                <div class="dot dot--1">
                                        <Tooltip id="my-tooltip" className="extraclassoftooltip" />

                                        <Link onClick={handleClick1} className="alpdevtsx5s1" >
                                                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M35.4045 28.9329C34.3107 22.3515 30.9053 17.4507 27.945 14.5722C27.0835 13.7346 26.6528 13.3157 25.7013 12.9281C24.7498 12.5405 23.932 12.5405 22.2963 12.5405H18.7037C17.068 12.5405 16.2502 12.5405 15.2987 12.9281C14.3472 13.3157 13.9165 13.7346 13.0551 14.5722C10.0947 17.4507 6.68935 22.3515 5.59545 28.9329C4.78155 33.8295 9.29878 37.5405 14.3472 37.5405H26.6528C31.7012 37.5405 36.2185 33.8295 35.4045 28.9329Z" stroke="url(#paint0_linear_580_3240)" stroke-width="2" />
                                                        <path d="M12.5944 8.27873C12.2505 7.77824 11.7521 7.09893 12.7817 6.94403C13.8399 6.78479 14.9387 7.50918 16.0143 7.49429C16.9873 7.48083 17.483 7.04926 18.0148 6.43308C18.5748 5.78423 19.442 4.20728 20.5 4.20728C21.558 4.20728 22.4252 5.78423 22.9852 6.43308C23.517 7.04926 24.0127 7.48083 24.9857 7.49429C26.0613 7.50918 27.1602 6.78479 28.2183 6.94403C29.2478 7.09893 28.7495 7.77824 28.4057 8.27873L26.8508 10.5417C26.1858 11.5097 25.8533 11.9937 25.1573 12.2672C24.4615 12.5406 23.5622 12.5406 21.7637 12.5406H19.2363C17.4378 12.5406 16.5385 12.5406 15.8426 12.2672C15.1467 11.9937 14.8142 11.5097 14.1491 10.5417L12.5944 8.27873Z" stroke="url(#paint1_linear_580_3240)" stroke-width="2" />
                                                        <path d="M23.2095 22.4049C22.8492 21.0747 21.0152 19.8744 18.8137 20.7724C16.6122 21.6702 16.2625 24.5594 19.5925 24.8664C21.0975 25.0051 22.0789 24.7054 22.9772 25.5532C23.8757 26.4009 24.0425 28.7586 21.7459 29.3939C19.4492 30.0292 17.175 29.0366 16.9274 27.6267M20.2345 19.1951V20.4624M20.2345 29.5894V30.8617" stroke="url(#paint2_linear_580_3240)" stroke-width="2" />
                                                        <defs>
                                                                <linearGradient id="paint0_linear_580_3240" x1="20.5" y1="12.5405" x2="20.5" y2="37.5405" gradientUnits="userSpaceOnUse">
                                                                        <stop offset="0.135" stop-color="#DF231D" />
                                                                        <stop offset="0.355" stop-color="#000F9E" />
                                                                </linearGradient>
                                                                <linearGradient id="paint1_linear_580_3240" x1="20.5" y1="4.20728" x2="20.5" y2="12.5406" gradientUnits="userSpaceOnUse">
                                                                        <stop offset="0.135" stop-color="#DF231D" />
                                                                        <stop offset="0.355" stop-color="#000F9E" />
                                                                </linearGradient>
                                                                <linearGradient id="paint2_linear_580_3240" x1="20.2607" y1="19.1951" x2="20.2607" y2="30.8617" gradientUnits="userSpaceOnUse">
                                                                        <stop offset="0.135" stop-color="#DF231D" />
                                                                        <stop offset="0.355" stop-color="#000F9E" />
                                                                </linearGradient>
                                                        </defs>
                                                </svg>
                                                <h3>Accounting</h3>
                                        </Link>

                                        {/* <Link to={"/"} className="alpdevtsx5s1"> */}
                                        <Link className="alpdevtsx5s1 lockedproduct" to="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 100 101" xml:space="preserve" fill-rule="evenodd" class=""><g>

                                                        <linearGradient id="a" x1="0" x2="1" y1="0" y2="0" gradientTransform="matrix(0 98 -444.695 0 50 1.5)" gradientUnits="userSpaceOnUse"> <stop offset="0.135" stop-color="#DF231D" />
                                                                <stop offset="0.355" stop-color="#000F9E" /></linearGradient>
                                                        <path fill="url(#a)" d="M74.184 53.626V5.42a3.92 3.92 0 0 1 3.92-3.92h9.321a3.92 3.92 0 0 1 3.92 3.92v57.838a3.92 3.92 0 0 1-3.92 3.92H79.16c.101.989.153 1.993.153 3.009C79.313 86.365 66.178 99.5 50 99.5S20.687 86.365 20.687 70.187c0-1.016.052-2.02.153-3.009h-8.265a3.92 3.92 0 0 1-3.92-3.92V39.442a3.92 3.92 0 0 1 3.92-3.92h9.321a3.92 3.92 0 0 1 3.92 3.92v14.184a29.53 29.53 0 0 1 4.682-5.316V28.101a3.92 3.92 0 0 1 3.92-3.92h9.321a3.92 3.92 0 0 1 3.92 3.92v12.866a29.245 29.245 0 0 1 4.682 0V16.761a3.92 3.92 0 0 1 3.92-3.92h9.321a3.92 3.92 0 0 1 3.92 3.92V48.31a29.564 29.564 0 0 1 4.682 5.316zM50 44.794c14.015 0 25.393 11.378 25.393 25.393S64.015 95.58 50 95.58 24.607 84.202 24.607 70.187 35.985 44.794 50 44.794zm0 3.95c-11.834 0-21.442 9.609-21.442 21.443S38.166 91.629 50 91.629s21.442-9.608 21.442-21.442S61.834 48.744 50 48.744zm0 3.92c9.671 0 17.522 7.852 17.522 17.523S59.671 87.709 50 87.709s-17.522-7.851-17.522-17.522S40.329 52.664 50 52.664zm-1.96 6.591v-1.7a1.96 1.96 0 0 1 3.92 0v1.7h3.76a1.96 1.96 0 0 1 0 3.92h-3.76v5.231h.503a6.36 6.36 0 0 1 6.36 6.36v.351a6.36 6.36 0 0 1-6.36 6.36h-.503v1.342c0 1.081-.878 1.96-1.96 1.96s-1.96-.879-1.96-1.96v-1.342h-3.76a1.96 1.96 0 0 1 0-3.92h3.76v-5.231h-.503a6.36 6.36 0 0 1-6.36-6.36v-.351a6.36 6.36 0 0 1 6.36-6.36zm3.92 13.071v5.231h.503a2.44 2.44 0 0 0 2.44-2.44v-.351a2.44 2.44 0 0 0-2.44-2.44zm-3.92-9.151h-.503a2.44 2.44 0 0 0-2.44 2.44v.351a2.44 2.44 0 0 0 2.44 2.44h.503zm-26.144-1.34V39.442h-9.321v23.816h8.937c.117-.479.245-.953.384-1.423zm56.592 1.423h8.937V5.42h-9.321v56.415c.139.469.267.944.384 1.423zM43.739 41.546V28.101h-9.321V45.36a29.115 29.115 0 0 1 9.321-3.814zm21.843 3.814V16.761h-9.321v24.785a29.106 29.106 0 0 1 9.321 3.814z" opacity="1" data-original="url(#a)" class=""></path></g></svg>                                                <h3>MICE and DSR</h3>
                                        </Link>


                                        {/* <div className="alpdevtsx5s1 onprocessproduct"   data-tooltip-content="Locked" data-tooltip-id="my-tooltip" data-tooltip-place="top"> */}
                                        <Link className="alpdevtsx5s1 lockedproduct" data-tooltip-content="Locked" data-tooltip-id="my-tooltip" data-tooltip-place="top">
                                                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.8">
                                                                <path d="M24.9625 7.44993C24.0759 7.44993 23.6326 7.44993 23.2288 7.3001C23.1727 7.27928 23.1174 7.25639 23.063 7.23144C22.6715 7.05185 22.3582 6.73841 21.7312 6.11153C20.2883 4.66868 19.567 3.94725 18.6793 3.88073C18.56 3.87179 18.44 3.87179 18.3207 3.88073C17.433 3.94725 16.7115 4.66868 15.2688 6.11151C14.6419 6.73841 14.3285 7.05185 13.937 7.23144C13.8826 7.25639 13.8273 7.27928 13.7712 7.3001C13.3674 7.44993 12.9241 7.44993 12.0376 7.44993H11.874C9.61217 7.44993 8.48124 7.44993 7.77858 8.15261C7.07591 8.85527 7.07591 9.98619 7.07591 12.2481V12.4116C7.07591 13.2981 7.07591 13.7414 6.92607 14.1452C6.90525 14.2013 6.88236 14.2566 6.85742 14.311C6.67782 14.7025 6.36439 15.0159 5.73749 15.6428C4.29466 17.0856 3.57323 17.8071 3.50671 18.6948C3.49776 18.814 3.49776 18.934 3.50671 19.0533C3.57323 19.941 4.29466 20.6623 5.73749 22.1052C6.36439 22.7322 6.67782 23.0455 6.85742 23.437C6.88236 23.4915 6.90525 23.5467 6.92607 23.6028C7.07591 24.0066 7.07591 24.45 7.07591 25.3365V25.5C7.07591 27.7618 7.07591 28.8928 7.77858 29.5954C8.48124 30.2982 9.61217 30.2982 11.874 30.2982H12.0376C12.9241 30.2982 13.3674 30.2982 13.7712 30.4479C13.8273 30.4687 13.8826 30.4917 13.937 30.5166C14.3285 30.6963 14.6419 31.0096 15.2688 31.6365C16.7115 33.0793 17.433 33.8008 18.3207 33.8673C18.44 33.8763 18.56 33.8763 18.6793 33.8673C19.567 33.8008 20.2883 33.0793 21.7312 31.6365C22.3582 31.0096 22.6715 30.6963 23.063 30.5166C23.1174 30.4917 23.1727 30.4687 23.2288 30.4479C23.6326 30.2982 24.0759 30.2982 24.9625 30.2982H25.1259C27.3878 30.2982 28.5188 30.2982 29.2214 29.5954C29.9242 28.8928 29.9242 27.7618 29.9242 25.5V25.3365C29.9242 24.45 29.9242 24.0066 30.0739 23.6028C30.0947 23.5467 30.1176 23.4915 30.1425 23.437C30.3222 23.0455 30.6356 22.7322 31.2625 22.1052C32.7053 20.6623 33.4268 19.941 33.4933 19.0533C33.5023 18.934 33.5023 18.814 33.4933 18.6948C33.4268 17.8071 32.7053 17.0856 31.2625 15.6428C30.6356 15.0159 30.3222 14.7025 30.1425 14.311C30.1176 14.2566 30.0947 14.2013 30.0739 14.1452C29.9242 13.7414 29.9242 13.2981 29.9242 12.4116V12.2481C29.9242 9.98619 29.9242 8.85527 29.2214 8.15261C28.5188 7.44993 27.3878 7.44993 25.1259 7.44993H24.9625Z" stroke="url(#paint0_linear_580_3240)" stroke-width="2" />
                                                                <path d="M13.25 25.624C14.2979 23.8125 16.2566 22.5936 18.5 22.5936C20.7434 22.5936 22.7021 23.8125 23.75 25.624M21.5 15.874C21.5 17.5309 20.1569 18.874 18.5 18.874C16.8432 18.874 15.5 17.5309 15.5 15.874C15.5 14.2172 16.8432 12.874 18.5 12.874C20.1569 12.874 21.5 14.2172 21.5 15.874Z" stroke="url(#paint1_linear_580_3240)" stroke-width="2" />
                                                        </g>

                                                        <defs>
                                                                <linearGradient id="paint0_linear_580_3240" x1="18.5" y1="3.87402" x2="18.5" y2="33.874" gradientUnits="userSpaceOnUse">
                                                                        <stop offset="0.135" stop-color="#DF231D" />
                                                                        <stop offset="0.355" stop-color="#000F9E" />
                                                                </linearGradient>
                                                                <linearGradient id="paint1_linear_580_3240" x1="18.5" y1="12.874" x2="18.5" y2="25.624" gradientUnits="userSpaceOnUse">
                                                                        <stop offset="0.135" stop-color="#DF231D" />
                                                                        <stop offset="0.355" stop-color="#000F9E" />
                                                                </linearGradient>
                                                        </defs>
                                                </svg>
                                                <h3>HRMS</h3>
                                        </Link>

                                        <div className="alpdevtsx5s1 lockedproduct" data-tooltip-content="Locked" data-tooltip-id="my-tooltip" data-tooltip-place="top">
                                                {/* <img src="https://cdn-icons-png.flaticon.com/128/17371/17371668.png" alt="" /> */}
                                                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.8">
                                                                <path d="M5 21.874V15.874C5 10.2172 5 7.38875 6.75735 5.63138C8.51472 3.87402 11.3431 3.87402 17 3.87402H20C25.6568 3.87402 28.4853 3.87402 30.2426 5.63138C32 7.38875 32 10.2172 32 15.874V21.874C32 27.5308 32 30.3594 30.2426 32.1166C28.4853 33.874 25.6568 33.874 20 33.874H17C11.3431 33.874 8.51472 33.874 6.75735 32.1166C5 30.3594 5 27.5308 5 21.874Z" stroke="#2C2C2C" stroke-width="2" />
                                                                <path d="M12.5 27.874H24.5" stroke="#2C2C2C" stroke-width="2" stroke-linecap="round" />
                                                                <path d="M11.0487 11.3389H25.91M18.4968 11.3389V21.8481M18.4968 21.8481H17.6972M18.4968 21.8481H19.2867M12.4979 12.821C11.4097 13.9396 9.6061 15.8685 10.395 17.4754C11.0956 18.9027 12.0921 18.9277 12.4973 18.9277C12.9025 18.9277 13.9567 18.9027 14.6573 17.4754C15.4462 15.8685 13.5862 13.9396 12.4979 12.821ZM24.4482 12.821C23.36 13.9396 21.5564 15.8685 22.3452 17.4754C23.0459 18.9027 24.0423 18.9277 24.4475 18.9277C24.8528 18.9277 25.907 18.9027 26.6076 17.4754C27.3965 15.8685 25.5365 13.9396 24.4482 12.821Z" stroke="url(#paint0_linear_580_3240)" stroke-width="2" />
                                                        </g>
                                                        <defs>
                                                                <linearGradient id="paint0_linear_580_3240" x1="18.4992" y1="11.3389" x2="18.4992" y2="21.8481" gradientUnits="userSpaceOnUse">
                                                                        <stop offset="0.135" stop-color="#DF231D" />
                                                                        <stop offset="0.355" stop-color="#000F9E" />
                                                                </linearGradient>
                                                        </defs>
                                                </svg>

                                                <h3>Legal</h3>
                                        </div>


                                </div>
                                <p className="fixedwrappedjklcw25">
                                        © 2024 Naksha. All rights reserved.
                                </p>

                                <div class="half-sphere"></div>
                        </div>


                </>
        )
}

export default AllProductsOfDvts
