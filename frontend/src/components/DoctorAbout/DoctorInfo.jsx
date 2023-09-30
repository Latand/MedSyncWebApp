import React from 'react';
import ellipseOnline from '../../assets/images/doctors-listing/ellipse-online.svg';
import {Link} from "react-router-dom";

const DoctorInfo = ({ name, specialty, status, imageSrc }) => (
  <div className="about__content">
    <img
      className="about__img"
      src={imageSrc}
      alt="Doctor"
    />
    <p className="about__title">{name}</p>
    <p className="about__subtitle">{specialty}</p>
    <div className="about__status">
      <p className="about__status__text">{status}</p>
      <img
        className="about__status__img"
        src={ellipseOnline}
        alt={status}
      />
    </div>
    <Link className="button about__button" to="/booking/patient-info-form">Book Appointment</Link>
  </div>
);

export default DoctorInfo;
