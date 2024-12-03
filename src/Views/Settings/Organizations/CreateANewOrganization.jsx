import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import CircleLoader from '../../../Components/Loaders/CircleLoader';
import SuccessMessage from '../../../Components/Succesmessages/SuccessMessage';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import Topbar from '../../../Components/NavigationBars/Topbar';
import { fetchStatesByCountryId, fetchCitiesByStateId } from '../../../FetchedApis/Apis';
import './organizations.scss'
import Loader02 from '../../../Components/Loaders/Loader02';
import { getCurrencyFormData } from '../../Helper/HelperFunctions';
import CustomDropdown12 from '../../../Components/CustomDropdown/CustomDropdown12';
import NumericInput from '../../Helper/NumericInput';

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const CreateANewOrganization = () => {
  const authToken = localStorage.getItem('AccessToken');
  const userData = JSON.parse(localStorage.getItem('UserData'));
  const userId = userData ? userData.id : null;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formDataStep1, setFormDataStep1] = useState({
    name: '',
    country_id: '',
    state_id: '',
    city_id: '',
    street1: '',
    street2: '',
    zipcode: ''
  });
  const [formDataStep2, setFormDataStep2] = useState({
    email: '',
    mobile_no: '',
    currency: getCurrencyFormData,
    language: '',
    logo: ''
  });

  const HandleClick = () => {
    console.log(formDataStep1, formDataStep2)
  }
  const [countries, setCountries] = useState([]);
  // console.log("countries", countries)
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Complete, setStep1Complete] = useState(false); // Track completion status of Step 1

  useEffect(() => {
    fetchGetCountries();
  }, []);

  const fetchGetCountries = async () => {
    try {
      setLoadingCountries(true);
      const authToken = localStorage.getItem('AccessToken');
      const response = await axios.post(
        `${apiUrl}/get/country`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      if (response.data.success) {
        setCountries(response.data.country);
      } else {
        toast.error('Failed to fetch countries');
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('An error occurred while fetching countries');
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    setFormDataStep1({ ...formDataStep1, country_id: countryId });

    try {
      setLoadingStates(true);
      const states = await fetchStatesByCountryId(countryId);
      if (states) {
        setStates(states);
        const { currency, language } = getCurrencyAndLanguageForCountry(countryId);
        setFormDataStep2({ ...formDataStep2, currency, language });
      } else {
        toast.error('Failed to fetch states');
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      toast.error('An error occurred while fetching states');
    } finally {
      setLoadingStates(false);
    }
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormDataStep1({ ...formDataStep1, state_id: stateId });

    try {
      setLoadingCities(true);
      const cities = await fetchCitiesByStateId(stateId);
      if (cities) {
        setCities(cities);
      } else {
        toast.error('Failed to fetch cities');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('An error occurred while fetching cities');
    } finally {
      setLoadingCities(false);
    }
  };

  const handleChangeStep1 = (e) => {
    const { name, value } = e.target;
    setFormDataStep1({
      ...formDataStep1,
      [name]: value
    });

    // Check if all Step 1 fields are filled
    const isStep1Complete = Object.values(formDataStep1).every(val => val !== '');
    setStep1Complete(isStep1Complete);
  };

  const handleChangeStep2 = (e) => {
    const { name, value } = e.target;
    setFormDataStep2({
      ...formDataStep2,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/organisation/create/update`, {
        ...formDataStep1,
        ...formDataStep2,
        user_id: userId
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          navigate('/settings/organisations');
        }, 3500);
        setFormDataStep1({
          name: '',
          country_id: '',
          state_id: '',
          city_id: '',
          street1: '',
          street2: '',
          zipcode: ''
        });
        setFormDataStep2({
          email: '',
          mobile_no: '',
          currency: getCurrencyFormData,
          language: '',
          logo: '',
          symbol: '',
          company_type: '',
          gst: ''
        });
      } else {
        toast.error('Failed to create/update organization');
      }
    } catch (error) {
      console.error('Error creating/updating organization:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const getCurrencyAndLanguageForCountry = (countryId) => {
    return { currency: 'USD', language: 'English' };
  };

  return (
    <>
      <TopLoadbar />
      <Topbar />

      {successMessage ? (
        <SuccessMessage valueofmessage={"Organization Created Successfully"} />
      ) : (
        <div id="settingcomponent">
          <div id="saearchboxsgak">
            <div id="searchbartopset">
              <h2>Organizations</h2>
              <div id="sljcpsnalinolc">
                <Link className='firstidclsas2s5' to={"/settings"}>Settings</Link>
                <p>/</p>
                <Link className='firstidclsas2s5' to={"/settings"}>Organizations</Link>
                <p>/</p>
                <Link to={""}>Create Organization</Link>
              </div>
            </div>
            <Link id="backtojomeoslskcjkls" to={"/dashboard/home"}><IoIosArrowBack /> Back to Home</Link>
          </div>
          {/* <div id="neworganizationaddbuton">
            <Link to={"/settings/create-organisations"}><MdAdd />New Organization</Link>
          </div> */}
          <div id="formofcreateupdateorg">
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div id="forminside" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", backgroundColor: "rgb(255,255,255)" }}>
                  <div className='form_commonblock'>
                    <label>Name:</label>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        color={"#525252"}
                        fill={"none"}
                      >
                        <path
                          d="M7 15C5.34315 15 4 16.3431 4 18C4 19.6569 5.34315 21 7 21C8.65685 21 10 19.6569 10 18C10 16.3431 8.65685 15 7 15Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 15C15.3431 15 14 16.3431 14 18C14 19.6569 15.3431 21 17 21C18.6569 21 20 19.6569 20 18C20 16.3431 18.6569 15 17 15Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 17H10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M22 13C19.5434 11.7725 15.9734 11 12 11C8.02658 11 4.45659 11.7725 2 13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19 11.5L17.9425 4.71245C17.7268 3.3282 16.2232 2.57812 15.0093 3.24919L14.3943 3.58915C12.9019 4.41412 11.0981 4.41412 9.60574 3.58915L8.99074 3.24919C7.77676 2.57812 6.27318 3.3282 6.05751 4.71246L5 11.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input style={{ border: "1px solid rgb(208,215,222)", width: "100%" }} type="text" placeholder='Name' name="name" value={formDataStep1.name} onChange={handleChangeStep1} required />

                    </span>

                  </div>

                  {/* <div className='forg-group'>
                    <label>Email:</label>
                    <input style={{border:"1px solid rgb(208,215,222)"}}  type="email" placeholder='Email' name="email" value={setFormDataStep2.email} onChange={handleChangeStep2} required />
                  </div> */}
                  <div className="form_commonblock">
                    <label>Email</label>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        color={"#525252"}
                        fill={"none"}
                      >
                        <path
                          d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.01576 13.4756C2.08114 16.5411 2.11382 18.0739 3.24495 19.2093C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.755 19.2093C21.8862 18.0739 21.9189 16.5411 21.9842 13.4756C22.0053 12.4899 22.0053 11.51 21.9842 10.5244C21.9189 7.45883 21.8862 5.92606 20.755 4.79063C19.6239 3.6552 18.0497 3.61565 14.9012 3.53654C12.9607 3.48778 11.0393 3.48778 9.09882 3.53653C5.95033 3.61563 4.37608 3.65518 3.24495 4.79062C2.11382 5.92605 2.08113 7.45882 2.01576 10.5243C1.99474 11.51 1.99474 12.4899 2.01576 13.4756Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        autoComplete='off'
                        type="email"
                        name="email"

                        placeholder={`Enter Email`}
                        value={formDataStep2.name}
                        onChange={handleChangeStep2}
                      />
                    </span>
                  </div>

                  {/* <div className='forg-group'>
                    <label>Mobile No.</label>
                    <input style={{border:"1px solid rgb(208,215,222)"}}  type="number" placeholder='Mobile Number' name="mobile_no" value={setFormDataStep2.mobile_no} onChange={handleChangeStep2} required />
                  </div> */}

                  <div className="form_commonblock">
                    <label>Phone Number</label>
                    <div id="inputx1">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                          <path d="M3.77762 11.9424C2.8296 10.2893 2.37185 8.93948 2.09584 7.57121C1.68762 5.54758 2.62181 3.57081 4.16938 2.30947C4.82345 1.77638 5.57323 1.95852 5.96 2.6524L6.83318 4.21891C7.52529 5.46057 7.87134 6.08139 7.8027 6.73959C7.73407 7.39779 7.26737 7.93386 6.33397 9.00601L3.77762 11.9424ZM3.77762 11.9424C5.69651 15.2883 8.70784 18.3013 12.0576 20.2224M12.0576 20.2224C13.7107 21.1704 15.0605 21.6282 16.4288 21.9042C18.4524 22.3124 20.4292 21.3782 21.6905 19.8306C22.2236 19.1766 22.0415 18.4268 21.3476 18.04L19.7811 17.1668C18.5394 16.4747 17.9186 16.1287 17.2604 16.1973C16.6022 16.2659 16.0661 16.7326 14.994 17.666L12.0576 20.2224Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                        <NumericInput
                          name="mobile_no"
                          placeholder="Enter Phone Number"
                          value={formDataStep2.name}
                          onChange={handleChangeStep2}
                        />
                      </span>
                    </div>
                  </div>

                  <div className='form_commonblock'>
                    <label>GST</label>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        color={"#525252"}
                        fill={"none"}
                      >
                        <path
                          d="M2 8.56907C2 7.37289 2.48238 6.63982 3.48063 6.08428L7.58987 3.79744C9.7431 2.59915 10.8197 2 12 2C13.1803 2 14.2569 2.59915 16.4101 3.79744L20.5194 6.08428C21.5176 6.63982 22 7.3729 22 8.56907C22 8.89343 22 9.05561 21.9646 9.18894C21.7785 9.88945 21.1437 10 20.5307 10H3.46928C2.85627 10 2.22152 9.88944 2.03542 9.18894C2 9.05561 2 8.89343 2 8.56907Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M4 10V18.5M8 10V18.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M11 18.5H5C3.34315 18.5 2 19.8431 2 21.5C2 21.7761 2.22386 22 2.5 22H11"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M21.5 14.5L14.5 21.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="15.25"
                          cy="15.25"
                          r="0.75"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="20.75"
                          cy="20.75"
                          r="0.75"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <input style={{ border: "1px solid rgb(208,215,222)", width: "100%" }} type="text" placeholder='GST' name="gst" value={setFormDataStep2.gst} onChange={handleChangeStep2} required />

                    </span>
                  </div>

                  <div className='form_commonblock'>
                    <label>Company Type</label>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        color={"#525252"}
                        fill={"none"}
                      >
                        <path
                          d="M16 10L18.1494 10.6448C19.5226 11.0568 20.2092 11.2628 20.6046 11.7942C21 12.3256 21 13.0425 21 14.4761V22"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 9L11 9M8 13L11 13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 22V19C12 18.0572 12 17.5858 11.7071 17.2929C11.4142 17 10.9428 17 10 17H9C8.05719 17 7.58579 17 7.29289 17.2929C7 17.5858 7 18.0572 7 19V22"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 22L22 22"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M3 22V6.71724C3 4.20649 3 2.95111 3.79118 2.32824C4.58237 1.70537 5.74742 2.04355 8.07752 2.7199L13.0775 4.17122C14.4836 4.57937 15.1867 4.78344 15.5933 5.33965C16 5.89587 16 6.65344 16 8.16857V22"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <select style={{ border: "1px solid rgb(208,215,222)", width: "100%" }} name="company_type" value={setFormDataStep2.company_type} onChange={handleChangeStep2} >

                        <option value="Individual">Individual</option>
                        <option value="Business">Business</option>
                      </select>
                    </span>

                  </div>

                  {/* <div className='forg-group'>
                    <label>Currency</label>
                    <span  style={{background:"white",border:"1px solid rgb(208,215,222)"}} > <CustomDropdown12/> </span>
                  </div> */}

                  <div className="form_commonblock">
                    <label>Currency</label>
                    <span >
                      {otherIcons.currency_icon}

                      <CustomDropdown12
                        label="Item Name"

                        name="currency"
                        defaultOption="Select Currency"
                        value={setFormDataStep2.currency}
                        onChange={handleChangeStep2}

                      />
                    </span>
                  </div>


                  <div className='form_commonblock'>
                    <label>Symbol</label>
                    <span style={{ background: "white", border: "1px solid rgb(208,215,222)" }} >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        color={"#525252"}
                        fill={"none"}
                      >
                        <path
                          d="M4.5 10.2653V6H19.5V10.2653C19.5 13.4401 19.5 15.0275 18.5237 16.0137C17.5474 17 15.976 17 12.8333 17H11.1667C8.02397 17 6.45262 17 5.47631 16.0137C4.5 15.0275 4.5 13.4401 4.5 10.2653Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.5 6L5.22115 4.46154C5.78045 3.26838 6.06009 2.6718 6.62692 2.3359C7.19375 2 7.92084 2 9.375 2H14.625C16.0792 2 16.8062 2 17.3731 2.3359C17.9399 2.6718 18.2196 3.26838 18.7788 4.46154L19.5 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10.5 9H13.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M4 22H12M20 22H12M12 22V19.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <select name="symbol" value={setFormDataStep2.symbol} onChange={handleChangeStep2}>
                        <option value="$">$</option>
                        <option value="%">%</option>
                        <option value="#">#</option>
                      </select>
                    </span>
                  </div>

                  <div className='form_commonblock'>
                    <label>Language:</label>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                        <path d="M7.35396 18C5.23084 18 4.16928 18 3.41349 17.5468C2.91953 17.2506 2.52158 16.8271 2.26475 16.3242C1.87179 15.5547 1.97742 14.5373 2.18868 12.5025C2.36503 10.8039 2.45321 9.95455 2.88684 9.33081C3.17153 8.92129 3.55659 8.58564 4.00797 8.35353C4.69548 8 5.58164 8 7.35396 8H16.646C18.4184 8 19.3045 8 19.992 8.35353C20.4434 8.58564 20.8285 8.92129 21.1132 9.33081C21.5468 9.95455 21.635 10.8039 21.8113 12.5025C22.0226 14.5373 22.1282 15.5547 21.7352 16.3242C21.4784 16.8271 21.0805 17.2506 20.5865 17.5468C19.8307 18 18.7692 18 16.646 18" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M17 8V6C17 4.11438 17 3.17157 16.4142 2.58579C15.8284 2 14.8856 2 13 2H11C9.11438 2 8.17157 2 7.58579 2.58579C7 3.17157 7 4.11438 7 6V8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M13.9887 16L10.0113 16C9.32602 16 8.98337 16 8.69183 16.1089C8.30311 16.254 7.97026 16.536 7.7462 16.9099C7.57815 17.1904 7.49505 17.5511 7.32884 18.2724C7.06913 19.3995 6.93928 19.963 7.02759 20.4149C7.14535 21.0174 7.51237 21.5274 8.02252 21.7974C8.40513 22 8.94052 22 10.0113 22L13.9887 22C15.0595 22 15.5949 22 15.9775 21.7974C16.4876 21.5274 16.8547 21.0174 16.9724 20.4149C17.0607 19.963 16.9309 19.3995 16.6712 18.2724C16.505 17.5511 16.4218 17.1904 16.2538 16.9099C16.0297 16.536 15.6969 16.254 15.3082 16.1089C15.0166 16 14.674 16 13.9887 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M18 12H18.009" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                      <input style={{ border: "1px solid rgb(208,215,222)", width: "100%" }} type="text" placeholder='Language' name="language" value={formDataStep2.language} onChange={handleChangeStep2} required />

                    </span>
                  </div>

                  <div className='form_commonblock'>

                    <label>Country:</label>
                    {loadingCountries ? (
                      <Loader02 />
                    ) : (
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                          <path d="M4 7L4 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M11.7576 3.90865C8.45236 2.22497 5.85125 3.21144 4.55426 4.2192C4.32048 4.40085 4.20358 4.49167 4.10179 4.69967C4 4.90767 4 5.10138 4 5.4888V14.7319C4.9697 13.6342 7.87879 11.9328 11.7576 13.9086C15.224 15.6744 18.1741 14.9424 19.5697 14.1795C19.7633 14.0737 19.8601 14.0207 19.9301 13.9028C20 13.7849 20 13.6569 20 13.4009V5.87389C20 5.04538 20 4.63113 19.8027 4.48106C19.6053 4.33099 19.1436 4.459 18.2202 4.71504C16.64 5.15319 14.3423 5.22532 11.7576 3.90865Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <select style={{ border: "1px solid rgb(208,215,222)", width: "100%", height: "100%" }} name="country_id" value={formDataStep1.country_id} onChange={handleCountryChange} required>
                          <option value="">Select Country</option>
                          {countries.map(country => (
                            <option key={country.id} value={country.id}>{country.name}</option>
                          ))}
                        </select>
                      </span>

                    )}

                  </div>
                  {formDataStep1.country_id && (
                    <div className='form_commonblock'>
                      <label>State:</label>
                      {loadingStates ? (
                        <Loader02 />
                      ) : (
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                            <path d="M22 12.0889V9.23578C22 7.29177 22 6.31978 21.4142 5.71584C20.8284 5.11192 19.8856 5.11192 18 5.11192H15.9214C15.004 5.11192 14.9964 5.11013 14.1715 4.69638L10.8399 3.0254C9.44884 2.32773 8.75332 1.97889 8.01238 2.00314C7.27143 2.02738 6.59877 2.42098 5.25345 3.20819L4.02558 3.92667C3.03739 4.5049 2.54329 4.79402 2.27164 5.27499C2 5.75596 2 6.34169 2 7.51313V15.7487C2 17.2879 2 18.0575 2.34226 18.4859C2.57001 18.7708 2.88916 18.9625 3.242 19.026C3.77226 19.1214 4.42148 18.7416 5.71987 17.9817C6.60156 17.4659 7.45011 16.9301 8.50487 17.0754C9.38869 17.1971 10.21 17.756 11 18.1522" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 2.00195V17.0359" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M15 5.00879V11.0224" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20.1069 20.1754L21.9521 21.9984M21.1691 17.6381C21.1691 19.6048 19.5752 21.1991 17.609 21.1991C15.6428 21.1991 14.0488 19.6048 14.0488 17.6381C14.0488 15.6714 15.6428 14.0771 17.609 14.0771C19.5752 14.0771 21.1691 15.6714 21.1691 17.6381Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <select style={{ border: "1px solid rgb(208,215,222)", width: "100%", height: "100%" }} name="state_id" value={formDataStep1.state_id} onChange={handleStateChange} required>
                            <option value="">Select State</option>
                            {states.map(state => (
                              <option key={state.id} value={state.id}>{state.name}</option>
                            ))}
                          </select>
                        </span>

                      )}
                    </div>
                  )}
                  {formDataStep1.state_id && (
                    <div className='form_commonblock' >
                      <label>City:</label>
                      {/* {loadingCities ? (
                        <Loader02 />
                      ) : ( */}
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                          <path d="M14 8H10C7.518 8 7 8.518 7 11V22H17V11C17 8.518 16.482 8 14 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                          <path d="M11 12L13 12M11 15H13M11 18H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M21 22V8.18564C21 6.95735 21 6.3432 20.7013 5.84966C20.4026 5.35612 19.8647 5.08147 18.7889 4.53216L14.4472 2.31536C13.2868 1.72284 13 1.93166 13 3.22873V7.7035" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M3 22V13C3 12.1727 3.17267 12 4 12H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M22 22H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <select style={{ border: "1px solid rgb(208,215,222)", width: "100%", height: "100%" }} name="city_id" value={formDataStep1.city_id} onChange={handleChangeStep1} required>
                          <option value="">Select City</option>
                          {cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                          ))}
                        </select>

                      </span>

                      {/* )} */}
                    </div>
                  )}
                  {/* <div className='forg-group'>
                    <label>Street 1:</label>
                    <input style={{border:"1px solid rgb(208,215,222)"}} type="text" placeholder='Street 1' name="street1" value={formDataStep1.street1} onChange={handleChangeStep1} required />
                  </div> */}
                  <div className="form_commonblock">
                    <label>Street 1</label>
                    <div id="inputx1">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                          <path d="M3.25195 3V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M16.252 3V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.75195 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.75195 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.75195 17V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M19.6124 13.4393L20.3067 14.1317C20.8941 14.7175 20.8941 15.6672 20.3067 16.253L16.6692 19.9487C16.3831 20.234 16.0171 20.4264 15.6193 20.5005L13.3649 20.9885C13.009 21.0656 12.692 20.7504 12.7683 20.3952L13.2481 18.1599C13.3224 17.7632 13.5153 17.3982 13.8015 17.1129L17.4852 13.4393C18.0726 12.8536 19.025 12.8536 19.6124 13.4393Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                          autoComplete='off'
                          type="text"
                          name="street_1"
                          placeholder="Street 1"
                          value={setFormDataStep1.street1}
                          onChange={handleChangeStep1}

                        /></span>
                    </div>
                  </div>
                  {/* <div className='forg-group'>
                    <label>Street 2:</label>
                    <input style={{border:"1px solid rgb(208,215,222)"}} type="text" placeholder='Street 2' name="street2" value={formDataStep1.street2} onChange={handleChangeStep1} required />
                  </div> */}

                  <div className="form_commonblock">
                    <label>Street 2</label>
                    <div id="inputx1">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                          <path d="M3.25195 3V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M16.252 3V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.75195 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.75195 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.75195 17V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M19.6124 13.4393L20.3067 14.1317C20.8941 14.7175 20.8941 15.6672 20.3067 16.253L16.6692 19.9487C16.3831 20.234 16.0171 20.4264 15.6193 20.5005L13.3649 20.9885C13.009 21.0656 12.692 20.7504 12.7683 20.3952L13.2481 18.1599C13.3224 17.7632 13.5153 17.3982 13.8015 17.1129L17.4852 13.4393C18.0726 12.8536 19.025 12.8536 19.6124 13.4393Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                          autoComplete='off'
                          type="text"
                          name="street_2"
                          placeholder="Street 2"
                          value={setFormDataStep1.street2}
                          onChange={handleChangeStep1}

                        /></span>
                    </div>
                  </div>
                  {/* <div className='forg-group'>
                    <label>Zipcode:</label>
                    <input style={{border:"1px solid rgb(208,215,222)"}} type="number" placeholder='Zipcode' name="zipcode" value={formDataStep1.zipcode} onChange={handleChangeStep1} required />
                  </div> */}
                  <div className="form_commonblock">
                    <label>Zip Code</label>
                    <div id="inputx1">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                          <path d="M3.5 13V12.1963C3.5 9.22889 3.5 7.7452 3.96894 6.56021C4.72281 4.65518 6.31714 3.15252 8.33836 2.44198C9.59563 2 11.1698 2 14.3182 2C16.1173 2 17.0168 2 17.7352 2.25256C18.8902 2.65858 19.8012 3.51725 20.232 4.60584C20.5 5.28297 20.5 6.13079 20.5 7.82643V12.0142V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M3.5 12C3.5 10.1591 4.99238 8.66667 6.83333 8.66667C7.49912 8.66667 8.28404 8.78333 8.93137 8.60988C9.50652 8.45576 9.95576 8.00652 10.1099 7.43136C10.2833 6.78404 10.1667 5.99912 10.1667 5.33333C10.1667 3.49238 11.6591 2 13.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M3.5 16H6.9C7.14721 16 7.28833 16.2822 7.14 16.48L3.72 21.04C3.42334 21.4355 3.70557 22 4.2 22H7.5M10.5 16H12.25M12.25 16H14M12.25 16V21.6787M10.5 22H14M17 22V16H18.8618C19.5675 16 20.2977 16.3516 20.4492 17.0408C20.5128 17.33 20.5109 17.6038 20.4488 17.8923C20.2936 18.6138 19.5392 19 18.8012 19H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <NumericInput
                          name="zip_code"
                          placeholder="Enter Zip Code"
                          value={setFormDataStep1.zipcode}
                          onChange={handleChangeStep1}

                        /></span>
                    </div>
                  </div>

                </div>
              )}
              {currentStep === 2 && (
                <div id="forminside">
                  <div className='forg-group'>
                    <label>Emai</label>

                    <input type="email" placeholder='Email' name="email" value={formDataStep2.email} onChange={handleChangeStep2} required />


                  </div>
                  <div className='forg-group'>
                    <label>Mobile No:</label>
                    <input type="number" placeholder='Mobile Number' name="mobile_no" value={formDataStep2.mobile_no} onChange={handleChangeStep2} required />
                  </div>
                  <div className='forg-group'>
                    <label>Currency:</label>
                    <input type="text" placeholder='Currency' name="currency" value={formDataStep2.currency} onChange={handleChangeStep2} required />
                  </div>
                  <div className='forg-group'>
                    <label>Language:</label>
                    <input type="text" placeholder='Language' name="language" value={formDataStep2.language} onChange={handleChangeStep2} required />
                  </div>
                  <div className='forg-group'>
                    <label>Logo:</label>
                    <input type="file" accept="image/*" name="logo" value={formDataStep2.logo} onChange={handleChangeStep2} />
                  </div>
                </div>
              )}
              <div className="buttons-container">
                {currentStep !== 1 && (
                  <button type="button" onClick={prevStep}>Back</button>
                )}
                {currentStep !== 2 && step1Complete && ( // Only show the Next button if Step 1 is complete
                  <button type="button" onClick={nextStep}>Next</button>
                )}
                {currentStep === 2 && (
                  <button id='herobtnskls' className={loading ? 'btnsubmission' : ''} type="submit" disabled={loading}>
                    {loading ? <CircleLoader /> : <p>Submit</p>}
                  </button>
                )}
                <button onClick={HandleClick}>Create Organisation</button>
              </div>

            </form>
          </div>
          <div id="randomheight"></div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default CreateANewOrganization;
