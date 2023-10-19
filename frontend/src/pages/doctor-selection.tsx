import {useEffect, useRef, useState} from "react"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import {BackButton, MainButton, useCloudStorage, useHapticFeedback} from "@vkruglikov/react-telegram-web-app"
import {DoctorCard, LoadingDoctorCard} from "../components/DoctorsListing/DoctorCard"
import {SearchBar} from "../components/DoctorsListing/SearchBar"
import {LoadingNav, Nav} from "../components/DoctorsListing/Nav"
import {Header} from "../components/Header"

export const DoctorSelection = () => {
  const navigate = useNavigate()
  const storage = useCloudStorage()
  const [, notificationOccurred, selectionChanged] =
        useHapticFeedback()
  const [specialties, setSpecialties] = useState<any[]>([])
  // const [search, setSearch] = useState("");
  const [allDoctors, setAllDoctors] = useState<any[]>([])
  const [displayedDoctors, setDisplayedDoctors] = useState<any[]>([])
  const [specialty, setSpecialty] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null)

  const searchRef = useRef<HTMLInputElement | null>(null)

  //@ts-ignore
  window.Telegram.WebApp.enableClosingConfirmation()

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get(
        //@ts-ignore
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/specialties/`
      )
      // setTimeout(() => {
      setSpecialties(response.data)
      // }, 2000)
    } catch (error) {
      console.error((error as Error).message)
    }
  }
  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get(
        //@ts-ignore
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/doctors/`
      )
      // setTimeout(() => {
      setAllDoctors(response.data)
      setDisplayedDoctors(response.data) // Initially display all doctors
      // }, 1000)
    } catch (error) {
      console.error((error as Error).message)
    }
  }

  const fetchLocationInfo = async (location_id: string) => {
    try {
      const response = await axios.get(
        `${
          //@ts-ignore
          import.meta.env.VITE_REACT_APP_API_URL
        }/api/locations/${location_id}`
      )
      await storage.setItem(
        "selectedLocation",
        JSON.stringify(response.data)
      )
    } catch (error) {
      console.error((error as Error).message)
    }
  }

  const handleDoctorClick = async (doctor: any) => {
    if (selectedDoctor?.doctor_id === doctor.doctor_id) {
      setSelectedDoctor(null)
      selectionChanged()
      await storage.removeItem("selectedDoctor")
      return
    } else if (selectedDoctor) {
      setSelectedDoctor(doctor)
      selectionChanged()
    } else {
      setSelectedDoctor(doctor)
      notificationOccurred("success")
    }
    await fetchLocationInfo(doctor.location_id)
  }

  useEffect(() => {
    notificationOccurred("success")
    setTimeout(() => {
      fetchAllDoctors()
      fetchSpecialties()
    }, 1000)
    storage.getItem("selectedDoctor").then(value => {
      if (value) {
        setSelectedDoctor(JSON.parse(value))
      }
    })
  }, [])

  useEffect(() => {
    let filteredDoctors = allDoctors
    if (specialty) {
      filteredDoctors = filteredDoctors.filter(
        doctor => doctor.specialty_id === specialty
      )
      selectionChanged()
    }

    const search = searchRef?.current?.value

    if (search) {
      const searchLower = search.toLowerCase()
      filteredDoctors = filteredDoctors.filter(
        doctor =>
          doctor.full_name.toLowerCase().includes(searchLower) ||
                    doctor.specialty_name.toLowerCase().includes(searchLower)
      )
    }

    setDisplayedDoctors(filteredDoctors)
  }, [specialty, searchRef?.current?.value])

  return (
    <>
      <BackButton onClick={() => navigate("/")}/>
      <div className="doctor-selection">
        <Header
          title="Select a Doctor"
          className="header doctor-selection"
        />
        <SearchBar ref={searchRef}/>
        {specialties.length > 0 && (
          <Nav
            specialties={specialties}
            onSpecialtyClick={setSpecialty}
            selectedSpecialty={specialty}
          />
        )}
        {
          specialties.length === 0 && (
            <LoadingNav/>
          )
        }
        {displayedDoctors && (
          <main className="main">
            {displayedDoctors.map(doctor => (
              <DoctorCard
                className={
                  selectedDoctor &&
                                    selectedDoctor.doctor_id ===
                                    doctor.doctor_id
                    ? "card card--active"
                    : "card"
                }
                key={doctor.doctor_id}
                name={doctor.full_name}
                title={doctor.specialty_name}
                address={doctor.address}
                price={doctor.price}
                avg_rating={
                  doctor.avg_rating ? doctor.avg_rating : 0
                }
                reviews={doctor.reviews ? doctor.reviews : 0}
                doctorImage={doctor.photo_url}
                onClick={() => handleDoctorClick(doctor)}
              />
            ))}
          </main>
        )}
        {displayedDoctors.length === 0 && Array.from({length: 10}).map((_, index) => (
          <LoadingDoctorCard key={index}/>
        ))}
      </div>
      {selectedDoctor && (
        <MainButton
          textColor="#FFF"
          text={`Book with ${selectedDoctor.full_name}`}
          onClick={async () => {
            notificationOccurred("success")
            await storage.setItem(
              "selectedDoctor",
              JSON.stringify(selectedDoctor)
            )
            navigate(`/doctor/${selectedDoctor.doctor_id}`)
          }}
        />
      )}
    </>
  )
}
