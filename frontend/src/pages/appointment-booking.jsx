import React, {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import axios from 'axios';
import {useParams} from "react-router-dom";

const AppointmentBooking = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const { doctor_id } = useParams();

    useEffect(() => {
        axios.get(`https://medsync.botfather.dev/api/slots?doctor=${doctor_id}&date=${moment(startDate).format('YYYY-MM-DD')}`)
            .then(response => {
                setSlots(response.data);
            })
            .catch(error => {
                console.error('Error fetching slots:', error);
            });
    }, [doctor_id, startDate]);

    const handleSlotSelection = (slot) => {
        // Handle slot selection
        // For example, navigate to a booking page or open a booking modal
    };

    return (
        <div className="calendar">
            <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                inline
            />
            {slots.length > 0 && (
                <ul className="slots">
                    {slots.map(slot => (
                        <li key={slot.slot_id} onClick={() => handleSlotSelection(slot)}>
                            {slot.start_time} - {slot.end_time}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AppointmentBooking;
