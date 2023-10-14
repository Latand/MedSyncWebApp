import { format, isSameDay } from "date-fns";

interface DayProps extends React.LiHTMLAttributes<HTMLLIElement> {
    day: Date | null;
    selectedDay: Date;
    availableDays: string[];
    handleDayClick: (day: Date | null) => void;
}

export const Day: React.FC<DayProps> = ({
    day,
    selectedDay,
    availableDays,
    handleDayClick
}) => {
    const dayStr = day ? day.toDateString() : "";
    const isAvailable = availableDays.includes(dayStr);
    const isActive = day ? isSameDay(selectedDay, day) : false;

    const baseClass = "days-selector__day";
    let dayClass = baseClass;

    if (isActive) {
        dayClass = `${baseClass} ${baseClass}--active`;
    } else if (isAvailable) {
        dayClass = `${baseClass} ${baseClass}--available`;
    } else if (day) {
        dayClass = `${baseClass} ${baseClass}--unavailable`;
    } else {
        dayClass = `${baseClass} ${baseClass}--placeholder`;
    }

    return (
        <li
            className={dayClass}
            onClick={() => isAvailable && handleDayClick(day)}
        >
            {day ? format(day, "d") : ""}
        </li>
    );
};
