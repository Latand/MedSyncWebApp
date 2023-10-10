import {useEffect, useState} from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom"

import LandingPage from "./pages/landing-page.jsx"
import GetTested from "./pages/get-tested.jsx"
import DoctorSelection from "./pages/doctor-selection.jsx"
import About from "./pages/doctor-about.jsx"
import PatientInformation from "./pages/patient-info-form.jsx"

import SlotSelection from "./pages/appointment-booking.jsx"
import RegistrationConfirmation from "./pages/successful-booking.jsx"
import ClinicSelection from "./pages/clinic-selection.jsx"
import FullSummary from "./pages/booking-resume.jsx"
import {useHapticFeedback, useShowPopup} from "@vkruglikov/react-telegram-web-app"

const App = () => {
  const showPopup = useShowPopup()
  const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback()
  const [isInvalidVersion, setIsInvalidVersion] = useState(false)

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      if (!window.Telegram.WebApp.isVersionAtLeast("6.9")) {
        notificationOccurred("error")
        if (window.Telegram.WebApp.isVersionAtLeast("6.2")) {
          showPopup({message: "Please update your Telegram app to the latest version to use this app."})
        } else {
          console.log("the version is not supported")
          setIsInvalidVersion(true)
        }
      }
      // Alternatively to what can be set with react-telegram-web-app, you can directly set the following properties:
      try {
        window.Telegram.WebApp.requestWriteAccess()
      } catch (e) {
        console.log(e)
      }
      window.Telegram.WebApp.expand()
    }
  }, [])

  return (
    <>
      {isInvalidVersion &&
                (<div className="invalid-version">
                  <div className="invalid-version__content">
                    <h1>Sorry but this version is outdated!
                    </h1>
                    <h1>Please update your Telegram app to the latest
                                version to
                                use this app.</h1>
                  </div>
                </div>
                )}
      {!isInvalidVersion && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage isInvalidVersion={isInvalidVersion}/>}/>
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
        </BrowserRouter>)}
    </>
  )
}

export default App
