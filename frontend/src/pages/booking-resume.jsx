import React, {useEffect, useState} from 'react';
import Header from "../components/Header.jsx";
import LargeButton from "../components/LargeButton.jsx";
import {BackButton, useCloudStorage, useShowPopup} from "@vkruglikov/react-telegram-web-app";
import {useNavigate} from "react-router-dom";

import boxIcon from '../assets/images/resume/Vector.svg';
import WorkingHours from "../components/Resume/WorkingHours.jsx";
import {format} from "date-fns";
import axios from "axios";

const ResumeBlock = ({title, children}) => (<div className="resume__block">
    <div className="resume__block__text">{title}</div>
    {children}
</div>);

const BoxWrap = ({title, children}) => (<div className="box__wrap">
    <div className="box__title">
        <img className="box__title__icon" src={boxIcon} alt="Map icon"/>
        <div className="box__title__text">{title}</div>
    </div>
    {children}
</div>);

const hoursArray = [{day: 'Monday', start: '9:00 am', end: '17:00 pm'}, {
    day: 'Tuesday', start: '9:00 am', end: '17:00 pm'
}, {day: 'Wednesday', start: '9:00 am', end: '17:00 pm'}, {
    day: 'Thursday', start: '9:00 am', end: '17:00 pm'
}, {day: 'Friday', start: '9:00 am', end: '17:00 pm'}, {
    day: 'Saturday', start: '9:00 am', end: '17:00 pm'
}, {day: 'Sunday'}];


const Resume = () => {
    const [userData, setUserData] = useState(null);
    const [doctorData, setDoctorData] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const storage = useCloudStorage();
    const showPopup = useShowPopup();
    let navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            let savedUserData = JSON.parse(await storage.getItem('user_data'))
            let savedDoctor = JSON.parse(await storage.getItem('selectedDoctor'))
            let selectedTimeSlot = JSON.parse(await storage.getItem('selectedTimeSlot'))
            // from JSON to Object
            if (!selectedTimeSlot) {
                await showPopup({message: 'Sorry, you have not selected Time slot!'});
                navigate(-2);
                return;
            }
            try {
                const response = await axios.get(`https://medsync.botfather.dev/api/locations/${savedDoctor.location_id}`);
                setSelectedLocation(response.data);
            } catch (err) {
                console.error(err);
            }

            // Parse savedUserData and set the state
            setUserData(savedUserData);
            setDoctorData(savedDoctor);
            // make date object from string inside selectedTimeSlot
            selectedTimeSlot.date = new Date(selectedTimeSlot.date);
            setSelectedTimeSlot(selectedTimeSlot);
            console.log('User data: ', savedUserData)
        };

        fetchData();  // Call fetchData inside useEffect
    }, [storage, showPopup, navigate]);  // Add dependencies to useEffect
    const handleSubmit = async (e) => {
        // Your logic goes here
        e.preventDefault();

    }

    return (<>
        <BackButton onClick={() => navigate(-1)}/>
        <div className="resume">
            <Header className="resume" title="Resume"/>
            {userData && doctorData && (<div className="resume__blocks">
                <ResumeBlock title="Patient Info">
                    <div className="resume__block__title">{userData.userName} {userData.userSurname}</div>
                    <a className="resume__block__link"
                       href={`tel:${userData.userPhone}`}>{userData.userPhone}</a>
                    <a className="resume__block__link"
                       href={`mailto:${userData.userEmail}`}>{userData.userEmail}</a>
                    <div className="resume__block__text--color-dark">
                        {userData.userMessage}
                    </div>
                </ResumeBlock>

                {selectedTimeSlot && (
                    <>
                        <ResumeBlock title="Your Visit">
                            <div className="resume__block__title">
                                {format(selectedTimeSlot.date, 'EEEE ')}
                                <span
                                    className="resume__block__title--font-regular">
                                {format(selectedTimeSlot.date, 'MMMM')}, {format(selectedTimeSlot.date, 'd')}, {format(selectedTimeSlot.date, 'yyyy')}
                                </span>
                            </div>
                            <div className="resume__block__button">{selectedTimeSlot.start_time}:00</div>
                            {selectedLocation && <>
                                <div className="box">
                                    <BoxWrap title={selectedLocation.name}>
                                        <div className="box__text">{selectedLocation.address}</div>
                                    </BoxWrap>
                                    <a className="box__button button" href="https://maps.app.goo.gl/VkE3Fkkf6nMcWVp17"
                                       target="_blank" rel="noopener noreferrer">Get direction</a>
                                </div>
                            </>}
                            <BoxWrap title="Work Hours">
                                <WorkingHours hoursArray={hoursArray}/>
                            </BoxWrap>
                        </ResumeBlock>
                    </>
                )}


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
            </div>)}
            <LargeButton
                handleSubmit={handleSubmit}
                title="Confirm"
                typeButton="resume"
            />
        </div>
    </>);
};

export default Resume;
