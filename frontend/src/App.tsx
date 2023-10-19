import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { LandingPage } from "./pages/landing-page"
import { GetTested } from "./pages/get-tested"
import { DoctorSelection } from "./pages/doctor-selection"
import { About } from "./pages/doctor-about"
import { PatientInformation } from "./pages/patient-info-form"

import { SlotSelection } from "./pages/appointment-booking"
import { RegistrationConfirmation } from "./pages/successful-booking"
import { ClinicSelection } from "./pages/clinic-selection"
import { FullSummary } from "./pages/booking-resume"
import {
  useHapticFeedback,
  useShowPopup
} from "@vkruglikov/react-telegram-web-app"

export const App = () => {
  const showPopup = useShowPopup()
  const [, notificationOccurred, ] =
        useHapticFeedback()
  const [isInvalidVersion, setIsInvalidVersion] = useState(false)

  useEffect(() => {
    //@ts-ignore
    if (window.Telegram && window.Telegram.WebApp) {
      //@ts-ignore
      if (!window.Telegram.WebApp.isVersionAtLeast("6.9")) {
        notificationOccurred("error")
        //@ts-ignore
        if (window.Telegram.WebApp.isVersionAtLeast("6.2")) {
          showPopup({
            message:
                            "Please update your Telegram app to the latest version to use this app."
          })
        } else {
          console.log("the version is not supported")
          setIsInvalidVersion(true)
        }
      }
      // Alternatively to what can be set with react-telegram-web-app, you can directly set the following properties:
      try {
        //@ts-ignore
        window.Telegram.WebApp.requestWriteAccess()
      } catch (error) {
        console.log((error as Error).message)
      }
      //@ts-ignore
      window.Telegram.WebApp.expand()
    }
  }, [])

  return (
    <>
      {isInvalidVersion && (
        <div className="invalid-version">
          <div className="invalid-version__content">
            <h1>Sorry but this version is outdated!</h1>
            <h1>
                            Please update your Telegram app to the latest
                            version to use this app.
            </h1>
          </div>
        </div>
      )}
      {!isInvalidVersion && (
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  //@ts-ignore
                  isInvalidVersion={isInvalidVersion} //! ERROR: Invalid props
                />
              }
            />
            <Route
              path="/see_a_doctor"
              element={<DoctorSelection />}
            />
            <Route
              path="/get_tested"
              element={<GetTested />}
            />
            <Route
              path="/doctor/:doctor_id"
              element={<About />}
            />
            <Route
              path="/booking/appointment"
              element={
                <SlotSelection
                  storageKey="selectedDoctor"
                  itemType="doctors"
                />
              }
            />
            <Route
              path="/booking/diagnostics/:diagnostic_id"
              element={<ClinicSelection />}
            />
            <Route
              path="/booking/clinic"
              element={
                <SlotSelection
                  storageKey="selectedDiagnostic"
                  itemType="diagnostics"
                />
              }
            />
            <Route
              path="/booking/patient-info-form/:itemType"
              element={<PatientInformation />}
            />

            <Route
              path="/booking/confirmation/:itemType"
              element={<FullSummary />}
            />

            <Route
              path="/successful_booking"
              element={<RegistrationConfirmation />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}
