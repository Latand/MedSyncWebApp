import timeIcon from "../../assets/images/time-details/time-icon.svg";

const TimeSlot = ({timesArray, selectedTimeSlot, setSelectedTimeSlot}) => {

    return (<div className="time-container">

            <div className="time-selector">
                <img
                    src={timeIcon}
                    alt="Time Icon"
                    className="time-selector__icon"
                />

                <div className="time-selector__text">Choose the Hour</div>
            </div>
            <div className="time-slot">
                {timesArray.map(time => (
                    <button
                        className={`time-slot__button${time === selectedTimeSlot ? ' time-slot__button--active' : ''}`}
                        key={time}
                        onClick={() => setSelectedTimeSlot(time)}
                    >
                        {time}
                    </button>))}
            </div>
        </div>
    );
};


export default TimeSlot;