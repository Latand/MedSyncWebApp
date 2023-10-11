import { forwardRef } from "react";
import SearchIcon from "../SearchIcon";

export const SearchBar = forwardRef((props, ref) => (
    <div className="search-bar">
        <input
            className="search-bar__input"
            type="text"
            placeholder="Search"
            ref={ref}
            {...props}
        />
        <div className="search-bar__icon">
            <SearchIcon />
        </div>
    </div>
));
