const Nav = ({specialties, selectedSpecialty, onSpecialtyClick}) => {
  const handleClick = (specialty_id) => {
    if (specialty_id === selectedSpecialty) {
      // reset selected specialty
      specialty_id = null
    }
    onSpecialtyClick(specialty_id)
  }


  return (
    <div className="nav">
      <ul className="nav__list">
        {specialties.map((specialty) => (
          <li
            className="nav__item"
            key={specialty.specialty_id}
          >
            <button
              className={`nav__button button ${selectedSpecialty === specialty.specialty_id ? "nav__button--active" : ""}`}
              onClick={() => handleClick(specialty.specialty_id)}
            >
              {specialty.specialty_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}


export default Nav