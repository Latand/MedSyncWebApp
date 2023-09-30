import React from 'react';

const WorkingHours = ({hoursArray}) => {
    return (
        <div className="working-hours">
            {hoursArray.map((hours, index) => (
                <div className="box__text" key={index}>
                    {hours.day}{' '}
                    <span className="box__text--color-light">
                        {hours.start && hours.end ? `${hours.start} - ${hours.end}` : 'Closed'}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default WorkingHours;
