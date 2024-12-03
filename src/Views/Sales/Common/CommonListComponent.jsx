import React, { useState, useEffect, useCallback } from 'react';
import PaginationComponent from '../../Common/Pagination/PaginationComponent';
import TableViewSkeleton from '../../../Components/SkeletonLoder/TableViewSkeleton';
import SearchBox from '../../Common/SearchBox/SearchBox';
import DatePicker from '../../Common/DatePicker/DatePicker';
import SortBy from '../../Common/SortBy/SortBy';
import FilterBy from '../../Common/FilterBy/FilterBy';
import NoDataFound from '../../../Components/NoDataFound/NoDataFound';
import { useNavigate } from 'react-router-dom';

const CommonListComponent = ({ title, fetchList, columns, listData, listTotal, recordLabel, newLink, onRowClick }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [selectedSortBy, setSelectedSortBy] = useState("Normal");
    const [sortOrder, setSortOrder] = useState(1);
    const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
    const [status, setStatus] = useState("");
    const [searchTermFromChild, setSearchTermFromChild] = useState("");

    const resetPageIfNeeded = () => {
        if (currentPage > 1) setCurrentPage(1);
    };

    const onSearch = (term) => {
        resetPageIfNeeded();
        setSearchTrigger((prev) => prev + 1);
        setSearchTermFromChild(term);
    };

    const fetchListData = useCallback(async () => {
        try {
            await fetchList({ currentPage, itemsPerPage, selectedSortBy, sortOrder, dateRange, status, searchTermFromChild });
        } catch (error) {
            console.error(`Error fetching ${title}:`, error);
        }
    }, [searchTrigger, currentPage, itemsPerPage, selectedSortBy, sortOrder, dateRange, status, searchTermFromChild]);

    useEffect(() => {
        fetchListData();
    }, [searchTrigger]);

    return (
        <div id="middlesection">
            <div id="Anotherbox">
                <div id="leftareax12">
                    <h1>{title}</h1>
                    <p>{listTotal} {recordLabel}</p>
                    <SearchBox placeholder={`Search In ${title}`} onSearch={onSearch} />
                </div>
                <div id="buttonsdata">
                    <SortBy
                        setSearchTrigger={setSearchTrigger}
                        selectedSortBy={selectedSortBy}
                        setSelectedSortBy={setSelectedSortBy}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        resetPageIfNeeded={resetPageIfNeeded}
                    />
                    <DatePicker
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        setSearchTrigger={setSearchTrigger}
                        resetPageIfNeeded={resetPageIfNeeded}
                    />
                    <FilterBy
                        setStatus={setStatus}
                        setSearchTrigger={setSearchTrigger}
                        resetPageIfNeeded={resetPageIfNeeded}
                    />
                    <Link className="linkx1" to={newLink}>New {title}</Link>
                </div>
            </div>
            <div id="mainsectioncsls" className="commonmainqusalincetcsecion">
                <div id="leftsidecontentxls">
                    <div id="item-listsforcontainer">
                        <div id="newtableofagtheme">
                            {listData.loading ? (
                                <TableViewSkeleton />
                            ) : (
                                <>
                                    {listData.length > 0 ? (
                                        listData.map((item, index) => (
                                            <div key={index} onClick={() => onRowClick(item)}>
                                                {columns.map((col, colIndex) => (
                                                    <div key={colIndex} className={`table-cellx12 ${col.className}`}>
                                                        {col.icon} {item[col.field]}
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    ) : (
                                        <NoDataFound />
                                    )}
                                    <PaginationComponent
                                        itemList={listTotal}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        itemsPerPage={itemsPerPage}
                                        setItemsPerPage={setItemsPerPage}
                                        setSearchCall={setSearchTrigger}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommonListComponent;
