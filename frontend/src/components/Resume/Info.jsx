import {ResumeBlock} from "./ResumeBlock.jsx";

const Info = ({ infoData, infoType }) => {
    if (infoType === 'doctor') {
        return (
            <ResumeBlock title="Your Doctor">
                <div className="resume__doctor">
                    <img className="resume__doctor__image" src={infoData.photo_url} alt="Doctor"/>
                    <div className="resume__doctor__info">
                        <div className="resume__block__title">{infoData.full_name}</div>
                        <div className="resume__block__text--color-dark">{infoData.specialty_name}</div>
                    </div>
                </div>
            </ResumeBlock>
        );
    } else if (infoType === 'diagnostic') {
        // Replace with your actual rendering logic for diagnostic info
        return (
            <ResumeBlock title="Your Diagnostic">
                {/* Your diagnostic info rendering logic */}
            </ResumeBlock>
        );
    } else {
        return null;
    }
};

export default Info;