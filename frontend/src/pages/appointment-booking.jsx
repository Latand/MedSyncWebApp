import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import Header from "../components/Header.jsx";
import Calendar from "../components/Booking/Calendar.jsx";
import TimeSlot from "../components/Booking/TimeSlot.jsx";
import arrowRight from "../assets/images/landing-page/arrow-right.svg";
import moment from "moment";
import {BackButton, useCloudStorage, useHapticFeedback} from "@vkruglikov/react-telegram-web-app";
import LargeButton from "../components/LargeButton.jsx";

const AppointmentBooking = () => {
    let navigate = useNavigate()

    const [startDate, setStartDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const {doctor_id} = useParams();
    const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback();
    const storage = useCloudStorage();

    useEffect(() => {
        axios.get(`https://medsync.botfather.dev/api/slots/${doctor_id}/${moment(startDate).format('YYYY-MM-DD')}`)
            .then(response => {
                setSlots(response.data);
            })
            .catch(error => {
                console.error('Error fetching slots:', error);
            });
    }, [doctor_id, startDate]);
    const handleDateChange = (date) => {
        selectionChanged();
        setStartDate(date);
    };


    const handleSlotSelection = async (slot) => {
        setSelectedTimeSlot(slot);
        selectionChanged();
        console.log(slot)
    };

    const handleNext = async () => {
        await storage.setItem('selectedTimeSlot', selectedTimeSlot);
        navigate("/booking/patient-info-form")
    }

    return (
        <>
            <BackButton onClick={() => navigate(-1)}/>
            <div className="time-details">
                <Header className="time-details" title="Time Details"/>
                <main className="time-details__main">
                    <Calendar onDateChange={handleDateChange}/>
                    <TimeSlot timesArray={slots} selectedTimeSlot={selectedTimeSlot}
                              setSelectedTimeSlot={handleSlotSelection}
                    />
                    <LargeButton
                        handleSubmit={handleNext}
                        title="Next"
                        typeButton="time-details"
                    >Next</LargeButton>
                </main>
            </div>
        </>
    );
};

export default AppointmentBooking;
