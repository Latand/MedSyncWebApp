import SearchIcon from "../SearchIcon.jsx"
import {forwardRef} from "react"

const SearchBar = forwardRef((props, ref) => (
  <div className="search-bar">
    <input ref={ref}
      className="search-bar__input"
      type="text"
      placeholder="Search"
      // value={search}
      // onChange={(e) => setSearch(e.target.value)}
    />
    <div className="search-bar__icon">
      <SearchIcon/>
    </div>
  </div>
))

export default SearchBar
