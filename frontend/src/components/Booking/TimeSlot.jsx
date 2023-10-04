// import timeIcon from "../../assets/images/time-details/time-icon.svg";
import {isSameDay} from 'date-fns';
import TimeIcon from "./TimeIcon.jsx";
import React from "react"; // Importing 'isToday' and 'format' from 'date-fns'

const TimeSlot = ({availableSlots, selectedDate, selectedTimeSlot, setSelectedTimeSlot}) => {

    // Filter to get only today's slots
    const todaySlots = availableSlots.filter(slot => {
        return isSameDay(slot, selectedDate)
    });

    return (
        <div className="time-container">
            <div className="time-selector">
                <TimeIcon
                name="time-selector__icon"
                />
                <div className="time-selector__text">Choose the Hour</div>
            </div>
            {todaySlots.length !== 0 ? (
                <div className="time-slot">
                    {todaySlots.map(time => (
                        <button
                            className={`time-slot__button${time === selectedTimeSlot ? ' time-slot__button--active' : ''}`}
                            key={time}
                            onClick={() => setSelectedTimeSlot(time)}
                        >
                            {time.getHours()}:00 - {time.getHours() + 1}:00
                        </button>
                    ))}
                </div>
            ) : (
                <h3 className="no-slots-message">
                    No available slots for this date.
                </h3>
            )}
        </div>
    );
};

export default TimeSlot;
