import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Header from "../components/Header.jsx";
import Calendar from "../components/Booking/Calendar.jsx";
import TimeSlot from "../components/Booking/TimeSlot.jsx";
import {BackButton, MainButton, useCloudStorage, useHapticFeedback} from "@vkruglikov/react-telegram-web-app";
import {eachDayOfInterval, endOfMonth, getDay, startOfMonth} from 'date-fns';

const generateAllSlotsForMonth = (workingHours, selectedMonth, selectedYear) => {
    const allSlots = [];

    // Initialize a Date object for the first day of the selected month and year
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);

    // Get the first and last day of the month
    const start = startOfMonth(firstDayOfMonth);
    const end = endOfMonth(firstDayOfMonth);

    // Generate an array of all days in the month
    const daysInMonth = eachDayOfInterval({start, end});

    daysInMonth.forEach(day => {
        // Get the weekday index (0 for Sunday, 1 for Monday, etc.)
        const weekdayIndex = getDay(day);

        // Find the working hours for this weekday
        const workingHour = workingHours.find(wh => wh.weekday_index === weekdayIndex);

        if (workingHour) {
            // Generate slots based on the working hours
            const start_hour = workingHour.start_time;  // Assuming this is an integer hour, e.g., 9 for 9 AM
            const end_hour = workingHour.end_time;  // e.g., 17 for 5 PM

            for (let hour = start_hour; hour < end_hour; hour++) {
                const slotStart = new Date(day);
                slotStart.setHours(hour);
                if (slotStart >= new Date()) {
                    allSlots.push(slotStart);
                }
            }
        }
    });

    return allSlots;
};

const isSlotBooked = (slot, bookedSlots) => {
    return bookedSlots.some(bookedSlot => {
        let bookedSlotDateWithHours = new Date(bookedSlot);
        return slot.getTime() === bookedSlotDateWithHours.getTime();
    });
};

const AppointmentBooking = () => {
    let navigate = useNavigate()
    const [workingHours, setWorkingHours] = useState([]);
    const [availableDays, setAvailableDays] = useState([]); // Add this line to store available days
    const [parsedDoctor, setParsedDoctor] = useState(null); // Add this line to store the parsed doctor
    const [selectedDate, setStartDate] = useState(new Date());
    const [slots, setSlots] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback();
    const storage = useCloudStorage();

    useEffect(() => {
        // Fetch doctor information from storage first
        storage.getItem('selectedDoctor').then((storedDoctor) => {
            let parsedDoctor = JSON.parse(storedDoctor);
            setParsedDoctor(parsedDoctor);  // Add this line to set the parsed doctor
            axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/working_hours/${parsedDoctor.location_id}`)
                .then(response => {
                    setWorkingHours(response.data);
                })
                .catch(error => {
                    console.error('Error fetching working hours:', error);
                });
        });

    }, []);

    useEffect(() => {
        if (parsedDoctor && parsedDoctor.doctor_id && parsedDoctor.location_id && workingHours.length > 0) {
            // Fetch slots
            axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/slots/${parsedDoctor.doctor_id}/${parsedDoctor.location_id}/${selectedDate.getMonth()}`)
                .then(response => {
                    let bookedSlots = response.data
                    const allPossibleSlots = generateAllSlotsForMonth(workingHours, selectedDate.getMonth(), selectedDate.getFullYear()); // Note the date object
                    // Extract unique days that are available for booking
                    console.log('All possible slots: ', allPossibleSlots)
                    const availableSlots = allPossibleSlots.filter(slot => !isSlotBooked(slot, bookedSlots));
                    const availableDays = Array.from(new Set(availableSlots.map(slot => slot.toDateString())));
                    console.log(availableDays)
                    setAvailableDays(availableDays);  // Set the available days
                    setSlots(availableSlots);  // Set only the available slots
                })
                .catch(error => {
                    console.error('Error fetching slots:', error);
                });
        }
    }, [selectedDate, workingHours]);  // Removed slots and workingHours to prevent infinite loop


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
        await storage.setItem('selectedTimeSlot', JSON.stringify(selectedTimeSlot));
        navigate("/booking/patient-info-form")
    }

    return (<>
        <BackButton onClick={() => navigate(-1)}/>
        <div className="time-details">
            <Header className="time-details" title="Time Details"/>
            <main className="time-details__main">
                <Calendar onDateChange={handleDateChange}
                          availableDays={availableDays}
                />
                {selectedDate && slots && (<TimeSlot availableSlots={slots}
                                                     selectedTimeSlot={selectedTimeSlot}
                                                     setSelectedTimeSlot={handleSlotSelection}
                                                     selectedDate={selectedDate}
                />)}
                {selectedTimeSlot && (
                    <MainButton onClick={handleNext}
                    ></MainButton>
                )}
            </main>
        </div>
    </>);
};

export default AppointmentBooking;
