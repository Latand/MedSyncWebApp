import React from 'react';

import boxIcon from '../../assets/images/resume/Vector.svg';

const ResumeBlock = ({title, children}) => (<div className="resume__block">
    <div className="resume__block__text">{title}</div>
    {children}
</div>);

const BoxWrap = ({title, children}) => (<div className="box__wrap">
    <div className="box__title">
        <img className="box__title__icon" src={boxIcon} alt="Map icon"/>
        <div className="box__title__text">{title}</div>
    </div>
    {children}
</div>);


const ResumeInfo = ({
                        userData,
                        selectedTimeSlot,
                        selectedLocation,
                        hoursArray,
                        InfoComponent,  // This prop will be either <DoctorInfo /> or <DiagnosticInfo />
                    }) => (
    <div className="resume__blocks">
        <ResumeBlock title="Patient Info">
            {/* ... rest of the code ... */}
        </ResumeBlock>

        {selectedTimeSlot && (
            <>
                <ResumeBlock title="Your Visit">
                    {/* ... rest of the code ... */}
                </ResumeBlock>
            </>
        )}

        {InfoComponent}
    </div>
);

export default ResumeInfo;