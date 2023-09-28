import React from 'react';
import {BackButton, WebAppProvider} from '@vkruglikov/react-telegram-web-app';
import {useNavigate} from 'react-router-dom';

const DoctorSelection = () => {
    let navigate = useNavigate()
    return (
        <>
            <WebAppProvider
                options={{
                    smoothButtonsTransition: true,
                }}
            >
                <BackButton onClick={() => navigate(-1)}/>
                <div className="doctor-selection">
                    <div className="doctor-selection__header">
                        <h1 className="doctor-selection__header__title">See a Doctor</h1>
                        <p className="doctor-selection__header__text">Select a doctor to see their available time
                            slots.</p>
                    </div>
                </div>
            </WebAppProvider>
        </>
    );
};

export default DoctorSelection;
