import {isSameDay} from "date-fns"
import {TimeIcon} from "./TimeIcon"
import {useHapticFeedback} from "@vkruglikov/react-telegram-web-app"
import classNames from "classnames"
import React from "react"

interface TimeSlotProps {
    availableSlots: Date[];
    selectedDate: Date;
    selectedTimeSlot: Date;
    setSelectedTimeSlot: React.Dispatch<React.SetStateAction<Date>>;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  availableSlots,
  selectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
}) => {
  const [,notificationOccurred ,] = useHapticFeedback()

  // Filter to get only today's slots
  const todaySlots = availableSlots.filter((slot: Date) => {
    return isSameDay(slot, selectedDate)
  })
  if (todaySlots.length === 0) {
    notificationOccurred("warning")
  }

  return (
    <div className="time-container">
      <div className="time-selector">
        <TimeIcon className="time-selector__icon"/>
        <div className="time-selector__text">Choose the Hour</div>
      </div>
      {todaySlots.length !== 0 ? (
        <div className="time-slot">
          {todaySlots.map((time, index) => (
            <button
              className={classNames("time-slot__button", {
                "time-slot__button--active": time === selectedTimeSlot
              })}

              key={index}
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
  )
}
