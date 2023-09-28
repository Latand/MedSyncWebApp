import React from 'react';
import medSyncIcon from '../assets/images/medsync-icon.svg';
import arrowRight from '../assets/images/arrow-right.svg';
import medSyncLogo from "../assets/images/medsync-logo.svg";
import {Link} from "react-router-dom";

const LandingPage = () => {
    return (
        <>
            <div className="landing-page">
                <div className="landing-page__logo">
                    <img
                        className="landing-page__logo__img"
                        src={medSyncLogo}
                        alt="MedSync Logo"
                    />
                </div>

                <div className="landing-page__icon">
                    <img
                        className="landing-page__icon--img"
                        src={medSyncIcon}
                        alt="Med"
                    />
                </div>

                <p className="landing-page__text">Your well-being is our priority.</p>
                <Link to="/see_a_doctor" className="arrow-button button">See a Doctor
                    <span className="arrow">
                    <img src={arrowRight} alt="Arrow Right"/>
                </span>
                </Link>

                <Link to="/get_tested" className="button-second button">Get Tested</Link>

                <p className="landing-page__bottom">
                    Book doctors and diagnostics instantly via <b>Telegram</b>
                </p>

            </div>
        </>
    );
};

export default LandingPage;
