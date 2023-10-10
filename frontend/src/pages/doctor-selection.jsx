import axios from "axios"
import {useNavigate} from "react-router-dom"
import {BackButton, MainButton, useCloudStorage, useHapticFeedback} from "@vkruglikov/react-telegram-web-app"
import DoctorCard from "../components/DoctorsListing/DoctorCard.jsx"
import SearchBar from "../components/DoctorsListing/SearchBar.jsx"
import Nav from "../components/DoctorsListing/Nav.jsx"
import {useEffect, useState} from "react"
import Header from "../components/Header.jsx"


const DoctorSelection = () => {
  const navigate = useNavigate()
  const storage = useCloudStorage()
  const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback()
  const [specialties, setSpecialties] = useState([])
  const [search, setSearch] = useState("")
  const [allDoctors, setAllDoctors] = useState([])
  const [displayedDoctors, setDisplayedDoctors] = useState([])
  const [specialty, setSpecialty] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  window.Telegram.WebApp.enableClosingConfirmation()

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/specialties/`)
      setSpecialties(response.data)
    } catch (error) {
      console.error(error.message)
    }
  }
  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/doctors/`)
      setAllDoctors(response.data)
      setDisplayedDoctors(response.data)  // Initially display all doctors
    } catch (error) {
      console.error(error.message)
    }
  }

  const fetchLocationInfo = async (location_id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/locations/${location_id}`)
      await storage.setItem("selectedLocation", JSON.stringify(response.data))
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDoctorClick = async (doctor) => {
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
    fetchAllDoctors()
    fetchSpecialties()
    storage.getItem("selectedDoctor").then((value) => {
      if (value) {
        setSelectedDoctor(JSON.parse(value))
      }
    }
    )
  }, [])

  useEffect(() => {
    let filteredDoctors = allDoctors
    if (specialty) {
      filteredDoctors = filteredDoctors.filter(doctor => doctor.specialty_id === specialty)
      selectionChanged()
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredDoctors = filteredDoctors.filter(doctor =>
        doctor.full_name.toLowerCase().includes(searchLower) ||
                doctor.specialty_name.toLowerCase().includes(searchLower)
      )
    }

    setDisplayedDoctors(filteredDoctors)

  }, [specialty, search])


  return (<>
    <BackButton onClick={() => navigate("/")}/>
    <div className="doctor-selection">
      <Header title="Select a Doctor" className="header doctor-selection"/>
      <SearchBar search={search} setSearch={setSearch}/>
      {specialties &&
                <Nav specialties={specialties} onSpecialtyClick={setSpecialty} selectedSpecialty={specialty}/>
      }
      {displayedDoctors && <main className="main">
        {displayedDoctors.map(doctor => (
          <DoctorCard
            className={selectedDoctor && selectedDoctor.doctor_id === doctor.doctor_id ? "card card--active" : "card"}
            key={doctor.doctor_id}
            name={doctor.full_name}
            title={doctor.specialty_name}
            address={doctor.address}
            price={doctor.price}
            avg_rating={doctor.avg_rating ? doctor.avg_rating : 0}
            reviews={doctor.reviews ? doctor.reviews : 0}
            doctorImage={doctor.photo_url}
            onClick={() => handleDoctorClick(doctor)}
          />)
        )}
      </main>}
    </div>
    {selectedDoctor && <MainButton
      textColor="#FFF"
      text={`Book with ${selectedDoctor.full_name}`}
      onClick={async () => {
        notificationOccurred("success")
        await storage.setItem("selectedDoctor", JSON.stringify(selectedDoctor))
        navigate(`/doctor/${selectedDoctor.doctor_id}`)
      }}
    />}
  </>)
}

export default DoctorSelection
