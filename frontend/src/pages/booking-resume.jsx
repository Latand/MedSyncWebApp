import {useEffect, useState} from "react"
import Header from "../components/Header.jsx"
import {
  BackButton,
  MainButton,
  useCloudStorage,
  useHapticFeedback,
  useInitData,
  useShowPopup
} from "@vkruglikov/react-telegram-web-app"
import {useNavigate, useParams} from "react-router-dom"
import axios from "axios"
import {ResumeBlock} from "../components/Resume/ResumeBlock.jsx"
import fetchUserDataAndLocationInfo from "../utils/summaryData.js"
import Resume from "../components/Resume/SummaryInfo.jsx"


const FullSummary = () => {
  const webApp = window.Telegram?.WebApp
  const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback()
  const [InitDataUnsafe, InitData] = useInitData()
  const [doctorData, setDoctorData] = useState(null)
  const [diagnosticData, setDiagnosticData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [workingHours, setWorkingHours] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const storage = useCloudStorage()
  const showPopup = useShowPopup()
  const navigate = useNavigate()
  const {itemType} = useParams()

  const fetchDoctorData = async () => {
    const doctor = JSON.parse(await storage.getItem("selectedDoctor"))
    setDoctorData(doctor)
    return doctor
  }
  const fetchDiagnosticData = async () => {
    const diagnostic = JSON.parse(await storage.getItem("selectedDiagnostic"))
    setDiagnosticData(diagnostic)
    return diagnostic
  }

  useEffect(() => {
    if (itemType === "doctors") {
      fetchDoctorData().then(
        doctor => {
          fetchUserDataAndLocationInfo(
            storage,
          ).then(
            data => {
              if (data.error) {
                showPopup({message: "Sorry, some data is missing!"}).then(() => navigate(-1))
              }
              setUserData(data.userData)
              setSelectedTimeSlot(data.selectedTimeSlot)
              setDoctorData(doctor)
              setWorkingHours(data.hoursArray)
              setSelectedLocation(data.selectedLocation)

              storage.getItem("save_data").then((toSave) => {
                if (!JSON.parse(toSave)) {
                  storage.removeItem("user_data")
                }
              })
            }
          )

        })
    } else {
      fetchDiagnosticData().then(
        diagnostic => {
          fetchUserDataAndLocationInfo(
            storage
          ).then(
            data => {
              if (data.error) {
                showPopup({message: "Sorry, some data is missing!"}).then(() => navigate(-1))
              }

              setUserData(data.userData)
              setSelectedTimeSlot(data.selectedTimeSlot)
              setWorkingHours(data.hoursArray)
              setSelectedLocation(data.selectedLocation)
              setDiagnosticData(diagnostic)

              storage.getItem("save_data").then((toSave) => {
                if (!JSON.parse(toSave)) {
                  storage.removeItem("user_data")
                }
              })
            }
          )
        })
    }

  }, [])


  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/${itemType}/book_slot`, {
        doctor_id: doctorData?.doctor_id,
        diagnostic_id: diagnosticData?.diagnostic_id,
        booking_date_time: selectedTimeSlot,
        location_id: selectedLocation?.location_id,
        user_name: userData.userName,
        user_surname: userData.userSurname,
        user_phone: userData.userPhone,
        user_email: userData.userEmail,
        user_message: userData.userMessage,
        userInitData: InitData,
      })
      notificationOccurred("success")
      await showPopup({message: "Your appointment has been confirmed!"})
      await webApp.sendData(JSON.stringify({
        "action": "booking_confirmed", "booking_id": response.data.booking_id
      }))
      navigate("/successful_booking")
    } catch (err) {
      notificationOccurred("error")
      await showPopup({message: "Sorry, something went wrong!"})
      console.error(err)
    }
  }


  return (
    <>
      <BackButton onClick={() => navigate(-1)}/>
      <div className="resume">
        {userData && (
          <div className="resume__blocks">
            <Header className="resume" title="Summary"/>
            <Resume userData={userData} selectedTimeSlot={selectedTimeSlot}
              selectedLocation={selectedLocation} hoursArray={workingHours}
            />

            {doctorData && <ResumeBlock title="Your Doctor">
              <div className="resume__doctor">
                <img className="resume__doctor__image" src={doctorData.photo_url}
                  alt="Doctor"/>
                <div className="resume__doctor__info">
                  <div className="resume__block__title">{doctorData.full_name}</div>
                  <div className="resume__block__text--color-dark">{doctorData.specialty_name}</div>
                </div>
              </div>
            </ResumeBlock>
            }
            {diagnosticData && <ResumeBlock title="Your Diagnostic">
              <div className="resume__diagnostics">
                <img className="resume__diagnostics__image" src={diagnosticData.photo_url}
                  alt="Diagnostic"/>
                <div className="resume__diagnostics__info">
                  <div className="resume__block__title">{diagnosticData.type_name}</div>
                  <div className="resume__block__text">{diagnosticData.description}</div>
                  <div className="resume__block__text">Price: ${diagnosticData.price.toFixed(0)}</div>

                </div>
              </div>
            </ResumeBlock>
            }
          </div>)}
        {userData &&
                    <MainButton
                      onClick={handleSubmit}
                      text="Confirm"
                    />
        }
      </div>

    </>
  )
}

export default FullSummary

