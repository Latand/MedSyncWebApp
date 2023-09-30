import React, {useEffect, useState} from 'react';
import arrowRight from '../assets/images/landing-page/arrow-right.svg';
import Header from "../components/Header.jsx";
import {useCloudStorage, useInitData, useShowPopup, WebAppProvider} from "@vkruglikov/react-telegram-web-app";


const PatientInformation = () => {
    const [formData, setFormData] = useState({
        userName: '',
        userSurname: '',
        userPhone: '',
        userEmail: '',
        userMessage: ''
    });

    const storage = useCloudStorage();
    const showPopup = useShowPopup();
    const [initDataUnsafe, initData] = useInitData();
    const fetchData = async () => {
        const savedUserData = await storage.getItem('user_data');
        const savedEmail = savedUserData ? savedUserData.userEmail : null;
        const savedName = savedUserData ? savedUserData.userName : (initDataUnsafe ? initDataUnsafe.user?.first_name : null);
        const savedSurname = savedUserData ? savedUserData.userSurname : (initDataUnsafe ? initDataUnsafe.user?.last_name : null);
        // Telegram Data may be not available if ran from Inline mode or KeyboardButton

        setFormData(prevFormData => ({
            ...prevFormData,
            userName: savedName || null,
            userSurname: savedSurname || null,
            userEmail: savedEmail || null,
        }));
    };
    const handleChange = (event) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [event.target.id]: event.target.value
        }));
        console.log(event.target.id, event.target.value);
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.userName || !formData.userSurname || !formData.userPhone || !formData.userEmail) {
            console.log('Form data submitted: ', formData)
            await showPopup({message: 'Please fill all the fields'});
            return;
        }

        // console.log('Form data submitted: ', formData);
        // Reset the form
        fetchData();
    };


    return (
        <>
            <WebAppProvider>
                <div className="patient-information">
                    <Header className="patient-information"
                            title="Patient Information"/>


                    <div className="patient-information__form">
                        {initDataUnsafe && (
                            <form
                                onSubmit={handleSubmit}
                                action="#"
                                method="post"
                                className="form"
                            >

                                <label htmlFor="user_name" className="form__label">
                                    Name
                                    <input
                                        className="form__input"
                                        id="userName"
                                        type="text"
                                        name="user_name"
                                        required
                                        autoComplete="off"
                                        defaultValue={formData.userName}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label htmlFor="user_surname" className="form__label">
                                    Surname
                                    <input
                                        className="form__input"
                                        id="userSurname"
                                        type="text"
                                        name="user_surname"
                                        required
                                        autoComplete="off"
                                        defaultValue={formData.userSurname}
                                        onChange={handleChange}
                                    />
                                </label>


                                <label htmlFor="user_phone" className="form__label">
                                    Phone number
                                    <input
                                        className="form__input"
                                        id="userPhone"
                                        type="tel"
                                        name="user_phone"
                                        required
                                        autoComplete="off"
                                        defaultValue={formData.userPhone}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label htmlFor="user_email" className="form__label">
                                    Your E-Mail
                                    <input
                                        className="form__input"
                                        id="userEmail"
                                        type="email"
                                        name="user_email"
                                        required
                                        defaultValue={formData.userEmail}
                                        autoComplete="off"
                                        onChange={handleChange}
                                    />
                                </label>

                                <label htmlFor="textarea" className="form__label">Additional information
                                    <textarea
                                        className="form__textarea"
                                        id="userMessage"
                                        name="user_message"
                                        onChange={handleChange}
                                    ></textarea>
                                </label>


                                <a className="button form__button" onClick={handleSubmit}>Next
                                    <span className="arrow">
              <img src={arrowRight} alt="Arrow Right"/>
            </span>
                                </a>
                            </form>)}
                    </div>
                </div>
            </WebAppProvider>
        </>);
};

export default PatientInformation;
