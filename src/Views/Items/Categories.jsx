import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { categoryList } from '../../Redux/Actions/listApisActions';
import TopLoadbar from '../../Components/Toploadbar/TopLoadbar';
import { GoPlus } from 'react-icons/go';
import TableViewSkeleton from '../../Components/SkeletonLoder/TableViewSkeleton';
import PaginationComponent from '../Common/Pagination/PaginationComponent';
import { Toaster } from 'react-hot-toast';
import './categories.scss';
import { CreateSubCategoryPopup } from './CreateCategoryPopup';
import { OutsideClick } from "../Helper/ComponentHelper/OutsideClick";
import FilterIco from "../../assets/outlineIcons/othericons/FilterIco.svg";
const Categories = () => {
  const catList = useSelector(state => state?.categoryList);
  const [showPopup, setShowPopup] = useState(false);

  const dispatch = useDispatch();
  const [dataChanging, setDataChanging] = useState(false);
  const Navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [clickTrigger, setClickTrigger] = useState(false);
  const [status, setStatus] = useState("");
  //serch
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCall, setSearchCall] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState("Normal");
  const searchItems = () => {
    setSearchCall(!searchCall);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setTimeout(() => {
      setSearchCall(!searchCall);
    }, 1000);
    const searchInput = document.getElementById("commonmcsearchbar");
    if (searchInput) {
      if (e.target.value) {
        searchInput.classList.add('search-applied');
      } else {
        searchInput.classList.remove('search-applied');
      }
    }
  };
  //serch
  const [subCatId, setSubCatId] = useState(null)
  const handleOpenPopup = (e, data) => {
    e.stopPropagation()
    setSubCatId(data);
    setShowPopup(true);
  };

  useEffect(() => {
    const sendData = {
      fy: localStorage.getItem('FinancialYear'),
      noofrec: itemsPerPage,
      currentpage: searchTerm ? 1 : currentPage,
      active: 1
    }

    switch (selectedSortBy) {
      case "Active":
        sendData.active = 1;
        break;
      case "Inactive":
        sendData.active = 0;
        break;
      default:
    }

    if (status) {
      sendData.active = status;
    }

    if (searchTerm) {
      sendData.search = searchTerm;
    }

    dispatch(categoryList(sendData));
    setDataChanging(false);
  }, [dispatch, itemsPerPage, currentPage, searchCall, clickTrigger, selectedSortBy]);


  const handleRowClicked = (category) => {
    const categoryId = category.id;
    const subcategoryNames = category.sub_category.map(sub => sub.name).join('-');
    // sessionStorage.setItem('categoryData', JSON.stringify(category));
    Navigate(`/dashboard/category-details?id=${categoryId}`);
  };

  const filterDropdown = OutsideClick();

  // const filteredCategories = catList?.data?.data?.filter(category =>
  //   category.name?.toLowerCase()?.includes(searchTerm) ||
  //   (category.sub_categories && category.sub_categories.some(sub => sub.name?.toLowerCase().includes(searchTerm)))
  // );

  // console.log("filteredCategories", catList?.data?.data)

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const areAllRowsSelected = catList?.data?.data?.every((row) => selectedRows.includes(row.id));
    setSelectAll(areAllRowsSelected);
  }, [selectedRows, catList?.data?.data]);

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setSelectedRows(selectAll ? [] : catList?.data?.data?.map((row) => row.id));
  };

  const handleDataChange = (newValue) => {
    setDataChanging(newValue);
  };

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleFilterSelection = (filter) => {
    setSelectedSortBy(filter);
    filterDropdown.handleToggle()

    const sortByButton = document?.getElementById("filterButton");
    if (sortByButton) {
      if (filter !== "Normal") {
        sortByButton?.classList.add("filter-applied");
        setStatus(filter);
      } else {
        sortByButton?.classList.remove("filter-applied");
        setStatus("");
      }
    }
  };

  return (
    <>
      <TopLoadbar />
      <div id="middlesection">
        <div id="Anotherbox" className='formsectionx1'>
          <div id="leftareax12">
            <h1 id="firstheading">
              <svg height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg" id="fi_5736652"><g id="_30.Category" data-name="30.Category"><path d="m13.5 504.472a5 5 0 0 1 -3.532-8.539l84.375-84.209a5 5 0 1 1 7.064 7.078l-84.375 84.209a4.985 4.985 0 0 1 -3.532 1.461z" fill="#3aa1d9"></path><ellipse cx="165.245" cy="347.307" fill="#a1daf9" rx="95.625" ry="95.023"></ellipse><path d="m258.882 7.528h1.988a0 0 0 0 1 0 0v200.124a0 0 0 0 1 0 0h-201.241a0 0 0 0 1 0 0v-.871a199.253 199.253 0 0 1 199.253-199.253z" fill="#f8b117"></path><path d="m502.071 6.97h.871a0 0 0 0 1 0 0v201.24a0 0 0 0 1 0 0h-200.124a0 0 0 0 1 0 0v-1.988a199.253 199.253 0 0 1 199.253-199.252z" fill="#fb530a" transform="matrix(0 1 -1 0 510.47 -295.29)"></path><path d="m302.26 252.284h201.24a0 0 0 0 1 0 0v.871a199.253 199.253 0 0 1 -199.253 199.253h-1.987a0 0 0 0 1 0 0v-200.124a0 0 0 0 1 0 0z" fill="#f8830e"></path></g></svg>
              All Category
            </h1>
            <p id="firsttagp">{catList?.data?.total} Records</p>
            <div id="searchbox">
              <input
                id="commonmcsearchbar"
                type="text"
                placeholder="Search In Categories"
                value={searchTerm}
                onChange={handleSearch}
                autoComplete='off'
              />
              <IoSearchOutline onClick={searchItems} />
            </div>
          </div>
          <div id="buttonsdata">
            <div className="">
              {/* <img src="/Icons/filters.svg" alt="" />
              <p>Filter</p> */}
              <div className={`maincontainmiainx1`}>
                <div
                  className="labelfistc51s filtersorticos5w"
                  id="filterButton"
                  onClick={filterDropdown?.handleToggle}
                  ref={filterDropdown?.buttonRef}
                >
                  {/* <img src="/Icons/filters.svg" alt="" /> */}
                  <img
                    src={FilterIco}
                    alt=""
                    data-tooltip-content="Filter"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-place="bottom"
                  />
                  {/* <p>Filter</p> */}
                </div>
                {filterDropdown?.isOpen && (
                  <div className="dropdowncontentofx35" ref={filterDropdown.ref}>
                    <div
                      className={`dmncstomx1 ${selectedSortBy === "Normal" ? "activedmc" : ""
                        }`}
                      onClick={() => handleFilterSelection("Normal")}
                    >
                      Normal
                    </div>
                    <div
                      className={`dmncstomx1 ${selectedSortBy === "1" ? "activedmc" : ""
                        }`}
                      onClick={() => handleFilterSelection("1")}
                    >
                      Active
                    </div>
                    <div
                      className={`dmncstomx1 ${selectedSortBy === "0" ? "activedmc" : ""
                        }`}
                      onClick={() => handleFilterSelection("0")}
                    >
                      Inactive
                    </div>

                  </div>
                )}
              </div>
            </div>
            <Link className="linkx1" to={"/dashboard/create-categories"}>
              New Category <GoPlus />
            </Link>
          </div>
        </div>
        <div id="mainsectioncsls">
          <div id="leftsidecontentxls">
            <div id="item-listsforcontainer">
              <div id="x5ssmalltable">
                <div className="headtablerowindx1" id='h5tablerowindx2'>
                  <div className="table-headerx12">
                    <div className="table-cellx12 checkboxfx2 x2s5554" id="styl_for_check_box">
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} /> <div className="checkmark"></div>
                    </div>
                    <div className="table-cellx12 cf01">CATEGORY</div>
                    <div className="table-cellx12 cf02">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                        <path d="M3 4.5C3 3.67157 3.67157 3 4.5 3H6.5C7.32843 3 8 3.67157 8 4.5V6.5C8 7.32843 7.32843 8 6.5 8H4.5C3.67157 8 3 7.32843 3 6.5V4.5Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 17.5C3 16.6716 3.67157 16 4.5 16H6.5C7.32843 16 8 16.6716 8 17.5V19.5C8 20.3284 7.32843 21 6.5 21H4.5C3.67157 21 3 20.3284 3 19.5V17.5Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M7.99977 18.5H20.9998M15.9998 5.5H7.99977M16.3233 7.67649L7.64844 16.3513" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 4.5C16 3.67157 16.6716 3 17.5 3H19.5C20.3284 3 21 3.67157 21 4.5V6.5C21 7.32843 20.3284 8 19.5 8H17.5C16.6716 8 16 7.32843 16 6.5V4.5Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M18 21L19.3883 20.0537C20.4628 19.3213 21 18.9551 21 18.5C21 18.0449 20.4628 17.6787 19.3883 16.9463L18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      SUBCATEGORY
                    </div>
                  </div>
                  {catList?.loading || dataChanging === true ? (
                    <TableViewSkeleton />
                  ) : (
                    <>
                      {catList?.data?.data?.length === 0 ? (
                        <div className="notdatafound">
                          <iframe src="https://lottie.host/embed/e8ebd6c5-c682-46b7-a258-5fcbef32b33e/PjfoHtpCIG.json" frameBorder="0"></iframe>
                        </div>
                      ) : (
                        catList?.data?.data?.map((category, index) => (
                          <div
                            className={`table-rowx12 ${selectedRows.includes(category?.id) ? "selectedresult" : ""} ${category.active == 0 ? "inactive-row" : ""}`}
                            key={index}
                          >
                            {/* Checkbox */}
                            <div className="table-cellx12 checkboxfx2" id="styl_for_check_box">
                              <input
                                checked={selectedRows.includes(category?.id)}
                                type="checkbox"
                              />
                              <div className="checkmark"></div>
                            </div>

                            {/* Category Name */}
                            <div onClick={() => handleRowClicked(category)} className="table-cellx12 cf01">
                              {category?.name || ""}
                            </div>

                            {/* Subcategory */}
                            <div onClick={() => handleRowClicked(category)} className="table-cellx12 cf02">
                              {category?.sub_category?.length > 0 ? (
                                category?.sub_category
                                  ?.filter(subCategory => subCategory?.active === "1")
                                  ?.slice(0, 5)
                                  ?.map((subCategory, subIndex) => (
                                    <React.Fragment key={subIndex}>
                                      <p className='subcatbloccf02'>
                                        {subCategory.name}
                                      </p>
                                      <p> | </p>
                                    </React.Fragment>
                                  ))
                              ) : (
                                // Render message if no subcategory
                                <div className="nodatainrow"
                                  onClick={(e) => handleOpenPopup(e, category)}
                                >
                                  <Link
                                  >
                                    <GoPlus /> Add
                                  </Link>
                                </div>
                              )}
                              {category?.sub_category.length > 5 && (
                                <div className="nodatainrow" onClick={() => handleRowClicked(category?.id)}>
                                  <Link>View all</Link>
                                </div>
                              )}
                            </div>

                          </div>
                        ))
                      )}

                      {showPopup &&
                        <CreateSubCategoryPopup setClickTrigger={setClickTrigger} setShowPopup={setShowPopup} categoryData={subCatId} subCatId={null} />}
                      <PaginationComponent
                        itemList={catList?.data?.total}
                        setDataChangingProp={handleDataChange}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default Categories;
