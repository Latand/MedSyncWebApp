import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import {useHapticFeedback, WebAppProvider} from '@vkruglikov/react-telegram-web-app';
import LandingPage from "./pages/landing-page.jsx";
import GetTested from "./pages/get-tested.jsx";
import DoctorSelection from "./pages/doctor-selection.jsx";
import About from "./pages/doctor-about.jsx";
import PatientInformation from "./pages/patient-info-form.jsx";

const App = () => {
    const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback();
    const [telegram, setTelegram] = useState(null);
    const [mainButton, setMainButton] = useState(false);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            const {initData} = window.Telegram.WebApp;
            setTelegram(initData);
        }
    }, []);

    useEffect(() => {
        // Simulation: Fetch user data and services data from your database
        const fetchUserData = async () => {
            // Your actual fetch request to get user data goes here
            // const response = await axios.get('https://your-database-api-url');
        };

        fetchUserData();
    }, []);

    return (

        <WebAppProvider
            options={{
                smoothButtonsTransition: true,
            }}
        >
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/see_a_doctor" element={<DoctorSelection/>}/>
                    <Route path="/get_tested" element={<GetTested/>}/>
                    <Route path="/doctor/:doctor_id" element={<About/>}/>
                    {/*<Route path="/booking/appointment/:doctor_id" element={<AppointmentBooking/>}/>*/}
                    {/*<Route path="/booking/diagnostic/:diagnostic_id" element={<DiagnosticBooking/>}/>*/}
                    <Route path="/booking/patient-info-form" element={<PatientInformation/>}/>
                </Routes>
            </BrowserRouter>
        </WebAppProvider>
    );
};

export default App;
