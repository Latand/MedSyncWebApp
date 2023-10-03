import React, {useEffect, useState} from 'react';
import Header from "../components/Header.jsx";
import LargeButton from "../components/LargeButton.jsx";
import {
    BackButton,
    useCloudStorage,
    useHapticFeedback,
    useInitData,
    useShowPopup
} from "@vkruglikov/react-telegram-web-app";
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


const Resume = () => {
    const [userData, setUserData] = useState(null);
    const [doctorData, setDoctorData] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [hoursArray, setHoursArray] = useState([]);
    const storage = useCloudStorage();
    const showPopup = useShowPopup();
    const navigate = useNavigate();
    const webApp = window.Telegram?.WebApp;
    const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback()

    const [InitDataUnsafe, InitData] = useInitData();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let savedUserData = JSON.parse(await storage.getItem('user_data'))
                let savedDoctor = JSON.parse(await storage.getItem('selectedDoctor'))
                let selectedTimeSlot = JSON.parse(await storage.getItem('selectedTimeSlot'))
                // from JSON to Object
                if (!selectedTimeSlot || !savedDoctor || !savedUserData) {
                    notificationOccurred('error')
                    await showPopup({message: 'Sorry, there is missing data! Start again!'});
                    navigate('/see_a_doctor');
                    return;
                }
                try {
                    const locationInfo = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/locations/${savedDoctor.location_id}`);
                    setSelectedLocation(locationInfo.data);
                    const workingHours = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/working_hours/${savedDoctor.location_id}`);
                    // Parse savedUserData and set the state
                    setUserData(savedUserData);
                    setDoctorData(savedDoctor);
                    setHoursArray(workingHours.data);
                    // make date object from string inside selectedTimeSlot
                    selectedTimeSlot = new Date(selectedTimeSlot);
                    setSelectedTimeSlot(selectedTimeSlot);
                    console.log('User data: ', savedUserData)

                } catch (err) {
                    console.error(err);
                }

            } catch (err) {
                console.error(err);
            }

        };

        fetchData();  // Call fetchData inside useEffect
    }, [storage, showPopup, navigate]);  // Add dependencies to useEffect
    const handleSubmit = async (e) => {
        // Your logic goes here
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/doctors/book_slot`, {
                doctor_id: doctorData.doctor_id,
                user_id: InitDataUnsafe.user?.id,
                booking_date_time: selectedTimeSlot,
                location_id: doctorData.location_id,
                user_name: userData.userName,
                user_surname: userData.userSurname,
                user_phone: userData.userPhone,
                user_email: userData.userEmail,
                user_message: userData.userMessage,
                userInitData: InitData,
            });
            console.log(response.data);
            let bookings = JSON.parse(await storage.getItem('bookings') || '[]')
            bookings.push(response.data.booking_id);
            notificationOccurred('success')
            await storage.setItem('bookings', JSON.stringify(bookings))
            await showPopup({message: 'Your appointment has been confirmed!'});
            await webApp.sendData(JSON.stringify({
                'action': 'booking_confirmed', 'booking_id': response.data.booking_id
            }));
            navigate('/successful_booking');
        } catch (err) {
            notificationOccurred('error')
            await showPopup({message: 'Sorry, something went wrong!'})
            console.error(err);
            // }

        }
    };

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

                {selectedTimeSlot && (<>
                    <ResumeBlock title="Your Visit">
                        <div className="resume__block__title">
                            {format(selectedTimeSlot, 'EEEE ')}
                            <span
                                className="resume__block__title--font-regular">
                                {format(selectedTimeSlot, 'MMMM')}, {format(selectedTimeSlot, 'd')}, {format(selectedTimeSlot, 'yyyy')}
                                </span>
                        </div>
                        <div className="resume__block__button">{selectedTimeSlot.getHours()}:00</div>
                        {selectedLocation && <>
                            <div className="box">
                                <BoxWrap title={selectedLocation.name}>
                                    <div className="box__text">{selectedLocation.address}</div>
                                </BoxWrap>
                                <a className="box__button button"
                                   href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedLocation.address)}`}
                                   target="_blank" rel="noopener noreferrer">Get direction</a>
                            </div>
                        </>}
                        <BoxWrap title="Work Hours">
                            <WorkingHours hoursArray={hoursArray}/>
                        </BoxWrap>
                    </ResumeBlock>
                </>)}


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
