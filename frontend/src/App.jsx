import {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import LandingPage from "./pages/landing-page.jsx";
import GetTested from "./pages/get-tested.jsx";
import DoctorSelection from "./pages/doctor-selection.jsx";
import About from "./pages/doctor-about.jsx";
import PatientInformation from "./pages/patient-info-form.jsx";

import SlotSelection from "./pages/appointment-booking.jsx";
import RegistrationConfirmation from "./pages/successful-booking.jsx";
import ClinicSelection from "./pages/clinic-selection.jsx";
import FullSummary from "./pages/booking-resume.jsx";

const App = () => {
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            // Alternatively to what can be set with react-telegram-web-app, you can directly set the following properties:
            window.Telegram.WebApp.expand();
        }
    }, []);

    return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/see_a_doctor" element={<DoctorSelection/>}/>
                    <Route path="/get_tested" element={<GetTested/>}/>
                    <Route path="/doctor/:doctor_id" element={<About/>}/>
                    <Route
                        path="/booking/appointment"
                        element={<SlotSelection
                            storageKey="selectedDoctor"
                            itemType="doctors"
                        />}/>
                    <Route path="/booking/diagnostics/:diagnostic_id" element={<ClinicSelection/>}/>
                    <Route path="/booking/clinic" element={<SlotSelection
                        storageKey="selectedDiagnostic"
                        itemType="diagnostics"
                    />}/>
                    <Route path="/booking/patient-info-form/:itemType" element={<PatientInformation/>}/>

                    <Route path="/booking/confirmation/:itemType" element={<FullSummary/>}/>

                    <Route path="/successful_booking" element={<RegistrationConfirmation/>}/>
                </Routes>
            </BrowserRouter>
    );
};

export default App;
