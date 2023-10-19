import { forwardRef } from "react"
import { SearchIcon } from "../SearchIcon"

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (props, ref) => (
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
  )
)
