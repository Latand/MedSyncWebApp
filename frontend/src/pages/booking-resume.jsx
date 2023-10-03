import {useEffect, useState} from 'react';
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

import WorkingHours from "../components/Resume/WorkingHours.jsx";
import {format} from "date-fns";
import axios from "axios";
import {ResumeBlock} from "../components/Resume/ResumeBlock.jsx";
import {BoxWrap} from "../components/Resume/BoxWrap.jsx";

const fetchData = async (
    storage, showPopup, navigate, locationId
) => {
    try {
        console.log('locationId', locationId)
        let savedUserData = JSON.parse(await storage.getItem('user_data'))
        let selectedTimeSlot = JSON.parse(await storage.getItem('selectedTimeSlot'))
        // from JSON to Object
        if (!selectedTimeSlot || !savedUserData) {
            await showPopup({message: 'Sorry, there is missing data! Start again!'});
            navigate('/see_a_doctor');
            return;
        }
        try {
            const locationInfo = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/locations/${locationId}`);
            const workingHours = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/working_hours/${locationId}`);
            // make date object from string inside selectedTimeSlot
            selectedTimeSlot = new Date(selectedTimeSlot);

            return {
                "selectedTimeSlot": selectedTimeSlot,
                "selectedLocation": locationInfo.data,
                "userData": savedUserData,
                "hoursArray": workingHours.data
            }
        } catch (err) {
            console.error(err);
        }
    } catch (err) {
        console.error(err);
    }
};

const Resume = ({userData, selectedTimeSlot, selectedLocation, hoursArray}) => {

    return (<>
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
    </>);
};

const DoctorResume = () => {
    const webApp = window.Telegram?.WebApp;
    const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback()

    const [InitDataUnsafe, InitData] = useInitData();
    const [doctorData, setDoctorData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [workingHours, setWorkingHours] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const storage = useCloudStorage();
    const showPopup = useShowPopup();
    const navigate = useNavigate();

    const fetchDoctorData = async () => {
        const doctor = JSON.parse(await storage.getItem('selectedDoctor'))
        setDoctorData(doctor);
        return doctor;
    }

    useEffect(() => {
        fetchDoctorData().then(
            doctor => {
                fetchData(
                    storage, showPopup, navigate, doctor.location_id
                ).then(
                    data => {
                        setUserData(data.userData);
                        setSelectedTimeSlot(data.selectedTimeSlot);
                        setDoctorData(doctor);
                        setWorkingHours(data.hoursArray);
                        setSelectedLocation(data.selectedLocation);
                    }
                );

            }
        );

    }, [])

    const handleSubmit = async (e) => {
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
        }
    };


    return (
        <>
            <BackButton onClick={() => navigate(-1)}/>
            <div className="resume">
                {userData && doctorData && (<div className="resume__blocks">
                    <Header className="resume" title="Summary"/>
                    <Resume userData={userData} selectedTimeSlot={selectedTimeSlot}
                            selectedLocation={selectedLocation} hoursArray={workingHours}
                    />

                    {doctorData && <ResumeBlock title="Your Doctor">
                        <div className="resume__doctor">
                            <img className="resume__doctor__image" src={doctorData.photo_url}
                                 alt="Doctor"/>
                            <div className="resume__doctor__info">
                                <div className="resume__block__title">{doctorData.full_name}</div>
                                <div className="resume__block__text--color-dark">{doctorData.specialty_name}</div>
                            </div>
                        </div>
                    </ResumeBlock>
                    }
                </div>)}
                <LargeButton
                    handleSubmit={handleSubmit}
                    title="Confirm"
                    typeButton="resume"
                />
            </div>

        </>
    );
};

export default DoctorResume;