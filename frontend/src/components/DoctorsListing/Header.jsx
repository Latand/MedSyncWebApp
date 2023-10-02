import React from 'react';
import filter from '../../assets/images/doctors-listing/filter.svg';

const Header = () => (
  <header className="header doctor-selection__header">
    <div className="top-bar">
    <p className="top-bar__text">Select a Doctor</p>
    <div className="top-bar__icon">
      <img className="top-bar__icon__img" src={filter} alt="Button" />
    </div>
    </div>
  </header>
);

export default Header;
