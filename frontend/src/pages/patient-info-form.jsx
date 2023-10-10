import {useEffect, useState} from "react"
import Header from "../components/Header.jsx"
import {
  BackButton,
  MainButton,
  useCloudStorage,
  useHapticFeedback,
  useInitData,
  useShowPopup,
} from "@vkruglikov/react-telegram-web-app"
import {useNavigate, useParams} from "react-router-dom"


const PatientInformation = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userSurname: "",
    userPhone: "",
    userEmail: "",
    userMessage: ""
  })

  const storage = useCloudStorage()
  const navigate = useNavigate()
  const {itemType} = useParams()
  const [initDataUnsafe, initData] = useInitData()
  const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback()
  const [isFormValid, setIsFormValid] = useState(false)
  const showPopup = useShowPopup()

  const checkIfFormValid = () => {
    setIsFormValid(
      !!(formData.userName && formData.userSurname && formData.userPhone && formData.userEmail)
    )
  }

  const handleChange = (event) => {
    const {id, value} = event.target
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value
    }))
  }

  useEffect(() => {
    storage.getItem("user_data").then((data) => {
      const savedUserDataObject = data ? JSON.parse(data) : null
      const savedEmail = savedUserDataObject ? savedUserDataObject.userEmail : null
      const savedName = savedUserDataObject ? savedUserDataObject.userName : (initDataUnsafe ? initDataUnsafe.user?.first_name : null)
      const savedSurname = savedUserDataObject ? savedUserDataObject.userSurname : (initDataUnsafe ? initDataUnsafe.user?.last_name : null)
      const savedPhone = savedUserDataObject ? savedUserDataObject.userPhone : null
      // Telegram Data may be not available if ran from Inline mode or KeyboardButton

      setFormData(prevFormData => ({
        ...prevFormData,
        userName: savedName || "",
        userSurname: savedSurname || "",
        userEmail: savedEmail || "",
        userPhone: savedPhone || ""
      }))
      setIsFormValid(
        !!(savedName && savedSurname && savedPhone && savedEmail)
      )
    })
  }, [])

  useEffect(() => {
    checkIfFormValid()
  }, [formData])

  const handleSubmit = async () => {
    storage.getItem("save_data_forever").then((toSave) => {

      if (!toSave || !JSON.parse(toSave)) {
        showPopup({
          message: "Do you want to save your data for later?",
          buttons: [
            {
              text: "Yes",
              id: "yes",
              type: "ok"
            },
            {
              text: "No",
              id: "no",
              type: "destructive"
            },
            {
              text: "Save and don't ask again",
              id: "save",
              type: "default"
            }
          ]
        }).then((buttonId) => {
          if (buttonId === "yes") {
            storage.setItem("save_data", JSON.stringify(true))
          } else if (buttonId === "save") {
            storage.setItem("save_data_forever", JSON.stringify(true))
            storage.setItem("save_data", JSON.stringify(true))
          } else {
            storage.setItem("save_data", JSON.stringify(false))
          }
        })
      }
      storage.setItem("user_data", JSON.stringify(formData))
      navigate(`/booking/confirmation/${itemType}`)
      notificationOccurred("success")

    })
  }


  return (
    <>
      <BackButton onClick={() => navigate(-1)}/>
      <div className="patient-information">
        <Header className="patient-information"
          title="Patient Information"/>
        <div className="patient-information__form">
          {initDataUnsafe && (
            <form
              onSubmit={handleSubmit}
              action="#"
              method="post"
              className="form"
            >

              <label htmlFor="user_name" className="form__label">
                                Name
                <input
                  className="form__input"
                  id="userName"
                  type="text"
                  name="user_name"
                  required
                  autoComplete="off"
                  value={formData.userName}
                  onChange={handleChange}
                  maxLength={64}
                />
              </label>

              <label htmlFor="user_surname" className="form__label">
                                Surname
                <input
                  className="form__input"
                  id="userSurname"
                  type="text"
                  name="user_surname"
                  required
                  autoComplete="off"
                  value={formData.userSurname}
                  onChange={handleChange}
                  maxLength={64}
                />
              </label>


              <label htmlFor="user_phone" className="form__label">
                                Phone number
                <input
                  className="form__input"
                  id="userPhone"
                  type="tel"
                  name="user_phone"
                  required
                  autoComplete="off"
                  value={formData.userPhone}
                  onChange={handleChange}
                  maxLength={16}
                />
              </label>

              <label htmlFor="user_email" className="form__label">
                                Your E-Mail
                <input
                  className="form__input"
                  id="userEmail"
                  type="email"
                  name="user_email"
                  required
                  value={formData.userEmail}
                  autoComplete="off"
                  maxLength={64}
                  onChange={handleChange}
                />
              </label>

              <label htmlFor="textarea" className="form__label">Additional information
                <textarea
                  className="form__textarea"
                  id="userMessage"
                  name="user_message"
                  onChange={handleChange}
                  maxLength={1024}
                ></textarea>
              </label>
              {isFormValid &&
                                <MainButton
                                  title="Next"
                                  onClick={handleSubmit}
                                />
              }
            </form>)}
        </div>
      </div>
    </>)
}

export default PatientInformation
