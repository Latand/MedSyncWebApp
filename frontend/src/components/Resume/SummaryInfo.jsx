import {format} from "date-fns"
import {ResumeBlock} from "./ResumeBlock.jsx"
import {BoxWrap} from "./BoxWrap.jsx"
import WorkingHours from "./WorkingHours.jsx"


const Resume = ({userData, selectedTimeSlot, selectedLocation, hoursArray}) => {

  return (<>
    <ResumeBlock title="Patient Info">
      <div className="resume__block__title">{userData.userName} {userData.userSurname}</div>
      <a className="resume__block__link"
        href={`tel:${userData.userPhone}`}>{userData.userPhone}</a>
      <a className="resume__block__link"
        href={`mailto:${userData.userEmail}`}>{userData.userEmail}</a>
      <div className="resume__block__text--color-dark">
        {userData.userMessage}
      </div>
    </ResumeBlock>

    {selectedTimeSlot && (<>
      <ResumeBlock title="Your Visit">
        <div className="resume__block__title">
          {format(selectedTimeSlot, "EEEE ")}
          <span
            className="resume__block__title--font-regular">
            {format(selectedTimeSlot, "MMMM")}, {format(selectedTimeSlot, "d")}, {format(selectedTimeSlot, "yyyy")}
          </span>
        </div>
        <div className="resume__block__button">{selectedTimeSlot.getHours()}:00</div>
        {selectedLocation && <>
          <div className="box">
            <BoxWrap title={selectedLocation.name}>
              <div className="box__text">{selectedLocation.address}</div>
            </BoxWrap>
            <a className="box__button button"
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedLocation.address)}`}
              target="_blank" rel="noopener noreferrer">Get direction</a>
          </div>
        </>}
        <BoxWrap title="Work Hours">
          <WorkingHours hoursArray={hoursArray}/>
        </BoxWrap>
      </ResumeBlock>
    </>)}
  </>)
}

export default Resume