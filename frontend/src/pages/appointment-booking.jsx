import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Header from "../components/Header.jsx";
import Calendar from "../components/Booking/Calendar.jsx";
import TimeSlot from "../components/Booking/TimeSlot.jsx";
import {BackButton, useCloudStorage, useHapticFeedback} from "@vkruglikov/react-telegram-web-app";
import LargeButton from "../components/LargeButton.jsx";
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
        const workingHour = workingHours.find(wh => wh.weekday_index === weekdayIndex - 1);

        if (workingHour) {
            // Generate slots based on the working hours
            const start_hour = workingHour.start_time;  // Assuming this is an integer hour, e.g., 9 for 9 AM
            const end_hour = workingHour.end_time;  // e.g., 17 for 5 PM

            for (let hour = start_hour; hour < end_hour; hour++) {

                allSlots.push({
                    date: day, start_time: hour, end_time: hour + 1
                });
            }
        }
    });

    return allSlots;
};
const isSlotBooked = (slot, bookedSlots) => {
    return bookedSlots.some(bookedSlot => {
        return bookedSlot.date === slot.date && bookedSlot.start_time === slot.start_time
    });
};


const AppointmentBooking = () => {
    let navigate = useNavigate()
    const [workingHours, setWorkingHours] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]); // Add this line to store booked slots
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
            setParsedDoctor(JSON.parse(storedDoctor));  // Add this line to set the parsed doctor
        });
    }, []);

    useEffect(() => {
        if (parsedDoctor && parsedDoctor.doctor_id && parsedDoctor.location_id) {
            axios.get(`https://medsync.botfather.dev/api/working_hours/${parsedDoctor.location_id}`)
                .then(response => {
                    setWorkingHours(response.data);
                })
                .catch(error => {
                    console.error('Error fetching working hours:', error);
                });

        }
    }, [parsedDoctor]);


    useEffect(() => {
        if (parsedDoctor && parsedDoctor.doctor_id && parsedDoctor.location_id && workingHours.length > 0 && !slots) {
            // Fetch slots
            axios.get(`https://medsync.botfather.dev/api/slots/${parsedDoctor.doctor_id}/${parsedDoctor.location_id}/${selectedDate.getMonth()}`)
                .then(response => {
                    setBookedSlots(response.data); // Add this line to set the booked slots
                })
                .catch(error => {
                    console.error('Error fetching slots:', error);
                });

            const allPossibleSlots = generateAllSlotsForMonth(workingHours, selectedDate.getMonth(), selectedDate.getFullYear()); // Note the date object
            const availableSlots = allPossibleSlots.filter(slot => !isSlotBooked(slot, bookedSlots));
            // Extract unique days that are available for booking
            const availableDays = Array.from(new Set(availableSlots.map(slot => slot.date.toDateString())));
            setAvailableDays(availableDays);  // Set the available days

            setSlots(availableSlots);  // Set only the available slots

        }
    }, [parsedDoctor, selectedDate, workingHours]);  // Removed slots and workingHours to prevent infinite loop


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
                    {selectedDate && slots && (<TimeSlot availableSlots={slots} selectedTimeSlot={selectedTimeSlot}
                                                setSelectedTimeSlot={handleSlotSelection}
                                                selectedDate={selectedDate}
                    />)}

                    {slots && (<LargeButton
                            handleSubmit={handleNext}
                            title="Next"
                            typeButton="time-details"
                        >Next</LargeButton>)}
                </main>
            </div>
        </>);
};

export default AppointmentBooking;
