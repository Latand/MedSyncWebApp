import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {BackButton, MainButton, useCloudStorage, useHapticFeedback} from "@vkruglikov/react-telegram-web-app";
import {useWorkingHours} from "../hooks/useWorkingHours.js";
import {useSlots} from "../hooks/useSlots.js";
import TimeSlot from "../components/Booking/TimeSlot.jsx";
import Calendar from "../components/Booking/Calendar.jsx";
import Header from "../components/Header.jsx";


const SlotSelection = ({storageKey, itemType}) => {
    let navigate = useNavigate();
    const [selectedItem, setParsedItem] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback();
    const storage = useCloudStorage();
    console.log('itemType', itemType)

    useEffect(() => {
        storage.getItem(storageKey).then((storedItem) => {
            setParsedItem(JSON.parse(storedItem));
        });
    }, [storage]);

    const workingHours = useWorkingHours(selectedItem?.location_id);
    const {slots, availableDays} = useSlots(
        itemType === 'doctor' ? selectedItem?.doctor_id : selectedItem?.diagnostic_id,
        selectedItem?.location_id,
        selectedDate,
        workingHours,
        itemType
    );

    const handleDateChange = (date) => {
        selectionChanged();
        setSelectedDate(date);
    };

    const handleSlotSelection = (slot) => {
        setSelectedTimeSlot(slot);
        selectionChanged();
    };

    const handleNext = async () => {
        notificationOccurred("success");
        await storage.setItem("selectedTimeSlot", JSON.stringify(selectedTimeSlot));
        navigate(`/booking/patient-info-form/${itemType}`);
    };

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


export default SlotSelection;