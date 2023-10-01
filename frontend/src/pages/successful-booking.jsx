import React from 'react';
import logo from '../assets/images/landing-page/medsync-logo.svg'; // Adjust the import path as necessary

function RegistrationConfirmation() {
    return (
        <div className="registration-confirmation">
            <img
                className="registration-confirmation__logo__img"
                src={logo}
                alt="MedSync logo"
            />
            <p className="registration-confirmation__title">Successful</p>
            <p className="registration-confirmation__text">
                You have successfully booked your appointment with MedSync.
                <br/><br/>
                You can close now or get tested in one of our clinics
            </p>
            <a href="/see-doctor"
               className="button arrow-button"
               onClick={() => {
                   window.Telegram.WebApp.close();
               }}
            >Done!</a>
            <a href="/get_tested" className="button button-second">Get Tested</a>
        </div>
    );
}

export default RegistrationConfirmation;
