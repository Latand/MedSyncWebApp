interface NavProps {
    specialties: any[];
    selectedSpecialty: any;
    onSpecialtyClick: (id: any) => void;
}

export const Nav: React.FC<NavProps> = ({
  specialties,
  selectedSpecialty,
  onSpecialtyClick
}) => {
  const handleClick = (specialty_id: any) => {
    if (specialty_id === selectedSpecialty) {
      // reset selected specialty
      specialty_id = null
    }
    onSpecialtyClick(specialty_id)
  }

  return (
    <nav className="nav">
      <ul className="nav__list">
        {specialties.map(specialty => (
          <li
            className="nav__item"
            key={specialty.specialty_id}
          >
            <button
              className={`nav__button button ${
                selectedSpecialty === specialty.specialty_id
                  ? "nav__button--active"
                  : ""
              }`}
              onClick={() => handleClick(specialty.specialty_id)}
            >
              {specialty.specialty_name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
