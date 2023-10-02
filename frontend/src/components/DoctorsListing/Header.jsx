
import filter from '../../assets/images/doctors-listing/filter.svg';

const Header = () => (
  <header className="header">
    <p className="header__text">Select a Doctor</p>
    <div className="header__icon">
      <img className="header__icon__img" src={filter} alt="Button" />
    </div>
  </header>
);

export default Header;
