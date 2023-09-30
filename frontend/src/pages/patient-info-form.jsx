import React, {useEffect, useState} from 'react';
import Header from "../components/Header.jsx";
import {BackButton, useCloudStorage, useInitData, useShowPopup} from "@vkruglikov/react-telegram-web-app";
import {useNavigate} from "react-router-dom";
import LargeButton from "../components/LargeButton.jsx";


const PatientInformation = () => {
    const [formData, setFormData] = useState({
        userName: '',
        userSurname: '',
        userPhone: '',
        userEmail: '',
        userMessage: ''
    });

    const storage = useCloudStorage();
    let navigate = useNavigate();
    const showPopup = useShowPopup();
    const [initDataUnsafe, initData] = useInitData();
    const fetchData = async () => {
        const savedUserData = await storage.getItem('user_data');
        // from JSON to Object
        const savedUserDataObject = savedUserData ? JSON.parse(savedUserData) : null;

        const savedEmail = savedUserDataObject ? savedUserDataObject.userEmail : null;
        const savedName = savedUserDataObject ? savedUserDataObject.userName : (initDataUnsafe ? initDataUnsafe.user?.first_name : null);
        const savedSurname = savedUserDataObject ? savedUserDataObject.userSurname : (initDataUnsafe ? initDataUnsafe.user?.last_name : null);
        const savedPhone = savedUserDataObject ? savedUserDataObject.userPhone : null
        // Telegram Data may be not available if ran from Inline mode or KeyboardButton

        setFormData(prevFormData => ({
            ...prevFormData,
            userName: savedName || null,
            userSurname: savedSurname || null,
            userEmail: savedEmail || null,
            userPhone: savedPhone || null
        }));
    };
    const handleChange = (event) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [event.target.id]: event.target.value
        }));
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        if (!formData.userName || !formData.userSurname || !formData.userPhone || !formData.userEmail) {
            console.log('Form data submitted: ', formData)
            await showPopup({message: 'Please fill all the fields'});
            return;
        }

        console.log('Form data submitted: ', formData);
        await storage.setItem('user_data', JSON.stringify(formData));
        e.preventDefault();
        navigate('/booking/confirmation')
    };


    return (
        <>
            <BackButton onClick={() => navigate(-1)}/>
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
                                    value={formData.userName}
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
                                    value={formData.userSurname}
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
                                    value={formData.userPhone}
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
                                    value={formData.userEmail}
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
                            <LargeButton
                                title="Next"
                                handleSubmit={handleSubmit}
                                typeButton="form"
                            />
                        </form>)}
                </div>
            </div>
        </>);
};

export default PatientInformation;
