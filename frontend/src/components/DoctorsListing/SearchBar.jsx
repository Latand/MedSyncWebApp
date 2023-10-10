import SearchIcon from "../SearchIcon.jsx"

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
      <SearchIcon/>
    </div>
  </div>
)

export default SearchBar
