import React, {useEffect, useState} from 'react';
import Header from "../components/Header.jsx";
import LargeButton from "../components/LargeButton.jsx";
import {BackButton, useCloudStorage, useShowPopup} from "@vkruglikov/react-telegram-web-app";
import {useNavigate} from "react-router-dom";

import boxIcon from '../assets/images/resume/Vector.svg';
import WorkingHours from "../components/Resume/WorkingHours.jsx";

const ResumeBlock = ({title, children}) => (
    <div className="resume__block">
        <div className="resume__block__text">{title}</div>
        {children}
    </div>
);

const BoxWrap = ({title, children}) => (
        <div className="box__wrap">
            <div className="box__title">
                <img className="box__title__icon" src={boxIcon} alt="Map icon"/>
                <div className="box__title__text">{title}</div>
            </div>
            {children}
        </div>
    )
;

const hoursArray = [
    {day: 'Monday', start: '9:00 am', end: '17:00 pm'},
    {day: 'Tuesday', start: '9:00 am', end: '17:00 pm'},
    {day: 'Wednesday', start: '9:00 am', end: '17:00 pm'},
    {day: 'Thursday', start: '9:00 am', end: '17:00 pm'},
    {day: 'Friday', start: '9:00 am', end: '17:00 pm'},
    {day: 'Saturday', start: '9:00 am', end: '17:00 pm'},
    {day: 'Sunday'}
];


const Resume = () => {
    const [userData, setUserData] = useState(null);
    const [doctorData, setDoctorData] = useState(null);
    const storage = useCloudStorage();
    const showPopup = useShowPopup();
    let navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const savedUserData = await storage.getItem('user_data');
            const savedDoctor = await storage.getItem('selectedDoctor');
            // from JSON to Object
            if (!savedUserData) {
                await showPopup({message: 'Sorry, you have not filled the form yet!'});
                navigate(-1);
                return;
            }
            // Parse savedUserData and set the state
            setUserData(JSON.parse(savedUserData));
            setDoctorData(JSON.parse(savedDoctor));
            console.log('User data: ', savedUserData)
        };

        fetchData();  // Call fetchData inside useEffect
    }, [storage, showPopup, navigate]);  // Add dependencies to useEffect
    const handleSubmit = async (e) => {
        // Your logic goes here
        e.preventDefault();

    }

    return (
        <>
            <BackButton onClick={() => navigate(-1)}/>
            <div className="resume">
                <Header className="resume" title="Resume"/>
                {userData && doctorData && (
                    <div className="resume__blocks">
                        <ResumeBlock title="Patient Info">
                            <div className="resume__block__title">{userData.userName} {userData.userSurname}</div>
                            {/*<div className="resume__block__title">{userData.userSurname}</div>*/}
                            <a className="resume__block__link"
                               href={`tel:${userData.userPhone}`}>{userData.userPhone}</a>
                            <a className="resume__block__link"
                               href={`mailto:${userData.userEmail}`}>{userData.userEmail}</a>
                            <div className="resume__block__text--color-dark">
                                {userData.userMessage}
                            </div>
                        </ResumeBlock>

                        <ResumeBlock title="Your Visit">
                            <div className="resume__block__title">Tuesday, <span
                                className="resume__block__title--font-regular">October 8, 2023</span></div>
                            <div className="resume__block__button">9:00 PM</div>

                            <div className="box">
                                <BoxWrap title="Heatherview">
                                    <div className="box__text">80336 Wendy Fort <br/> Sarashire, NE 59803</div>
                                </BoxWrap>
                                <a className="box__button button" href="https://maps.app.goo.gl/VkE3Fkkf6nMcWVp17"
                                   target="_blank" rel="noopener noreferrer">Get direction</a>
                            </div>
                            <BoxWrap title="Work Hours">
                                <WorkingHours hoursArray={hoursArray}/>
                            </BoxWrap>
                        </ResumeBlock>

                        <ResumeBlock title="Your Doctor">
                            <div className="resume__doctor">
                                <img className="resume__doctor__image" src={doctorData.photo_url}
                                     alt="Doctor"/>
                                <div className="resume__doctor__info">
                                    <div className="resume__block__title">{doctorData.full_name}</div>
                                    <div className="resume__block__text--color-dark">{doctorData.specialty_name}</div>
                                </div>
                            </div>
                        </ResumeBlock>
                    </div>
                )}
                <LargeButton
                    handleSubmit={handleSubmit}
                    title="Confirm"
                    typeButton="resume"
                />
            </div>
        </>
    );
};

export default Resume;
