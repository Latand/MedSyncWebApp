import React from 'react';
import searchIcon from '../assets/images/doctors-listing/search.svg';

const SearchBar = ({search, setSearch}) => (
    <div className="search-bar">
        <input
            className="search-bar__input"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        <div className="search-bar__icon">
            <img className="search-bar__icon__img" src={searchIcon} alt="Search"/>
        </div>
    </div>
);

export default SearchBar;
