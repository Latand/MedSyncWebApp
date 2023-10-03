import logo from '../assets/images/landing-page/medsync-logo.svg';

function RegistrationConfirmation() {
    window.Telegram.WebApp.disableClosingConfirmation();
    return (
        <div className="registration-confirmation">
            <img
                className="logo"
                src={logo}
                alt="MedSync logo"
            />
            <p className="registration-confirmation__title">Successful</p>
            <p className="registration-confirmation__text">
                You have successfully booked your appointment with MedSync.
                <br/><br/>
                You can close now or get tested in one of our clinics
            </p>
            <a href="/see-doctor"
               className="button arrow-button"
               onClick={() => {
                   window.Telegram.WebApp.close();
               }}
            >Done!</a>
            <a href="/get_tested" className="button button-second">Get Tested</a>
        </div>
    );
}

export default RegistrationConfirmation;
