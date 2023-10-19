import { useEffect, useState } from "react"
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth
} from "date-fns"
import { Day } from "./Day"
import { MonthIcon } from "./MonthIcon"

interface CalendarProps {
    onDateChange: (day: Date) => void;
    availableDays: string[];
}

export const Calendar: React.FC<CalendarProps> = ({
  onDateChange,
  availableDays
}) => {
  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(now))
  const [selectedDay, setSelectedDay] = useState(now)
  const [days, setDays] = useState<(Date | null)[]>([])

  useEffect(() => {
    const start = startOfMonth(selectedMonth)
    const end = endOfMonth(selectedMonth)
    const dayList = eachDayOfInterval({ start, end })
    let firstDayOfWeekIndex = getDay(start) - 1
    if (firstDayOfWeekIndex === -1) {
      firstDayOfWeekIndex = 6
    }
    const placeholders = Array.from({ length: firstDayOfWeekIndex }).fill(
      null
    ) as null[]
    setDays([...placeholders, ...dayList])
  }, [selectedMonth])

  const handleDayClick = (day: Date | null) => {
    if (day) {
      setSelectedDay(day)
      onDateChange(day) // Call the callback function with the selected day
    }
  }

  const onPrevMonth = () => {
    const prevMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() - 1,
      1
    )
    const firstDayOfPrevMonth = startOfMonth(prevMonth)
    setSelectedMonth(prevMonth)
    handleDayClick(firstDayOfPrevMonth)
  }

  const onNextMonth = () => {
    const nextMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      1
    )
    const firstDayOfNextMonth = startOfMonth(nextMonth)
    handleDayClick(firstDayOfNextMonth)
    setSelectedMonth(nextMonth)
  }

  return (
    <>
      {selectedMonth && selectedDay && (
        <div className="calendar-container">
          <div className="month-selector">
            <button
              className="month-selector__button month-selector__button--prev"
              onClick={onPrevMonth}
            ></button>
            <div className="month-selector__wrap">
              <MonthIcon className="month-selector__icon" />
              <div className="month-selector__text">
                {format(selectedMonth, "MMMM")}
              </div>
            </div>

            <button
              className="month-selector__button month-selector__button--next"
              onClick={onNextMonth}
            ></button>
          </div>
          <ul className="weekdays-selector">
            {weekdays.map((weekday, index) => (
              <li
                key={index}
                className="weekdays-selector__weekday"
              >
                {weekday}
              </li>
            ))}
          </ul>

          <ul className="days-selector">
            {days.map((day, index) => (
              <Day
                key={index}
                day={day}
                selectedDay={selectedDay}
                availableDays={availableDays}
                handleDayClick={handleDayClick}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
