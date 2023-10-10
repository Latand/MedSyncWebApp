

const mapIndexToWeekday = (index) => {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return weekdays[index]
}

const WorkingHours = ({hoursArray}) => {
  const parsedHoursArray = hoursArray.map(item => ({
    day: mapIndexToWeekday(item.weekday_index),
    start: `${item.start_time}:00`,
    end: `${item.end_time}:00`,
  }))

  return (
    <div className="working-hours">
      {parsedHoursArray.map((hours, index) => (
        <div className="box__text" key={index}>
          {hours.day}{" "}
          <span className="box__text--color-light">
            {hours.start && hours.end ? `${hours.start} - ${hours.end}` : "Closed"}
          </span>
        </div>
      ))}
    </div>
  )
}

export default WorkingHours
