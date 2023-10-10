import SearchBar from "../components/DoctorsListing/SearchBar.jsx"
import {useEffect, useMemo, useRef, useState} from "react"
import Header from "../components/Header.jsx"
import axios from "axios"
import {useNavigate, useParams} from "react-router-dom"
import {BackButton, MainButton, useCloudStorage, useHapticFeedback} from "@vkruglikov/react-telegram-web-app"

const SpecializationBlock = ({title, subtitle, isActive}) => {
  return (
    <section className={`specialization-block ${isActive ? "specialization-block--active" : ""}`}>
      <div className="specialization-block__title">{title}</div>
      <div className="specialization-block__subtitle">{subtitle}</div>
    </section>)
}

const ClinicSelection = () => {
  const [search, setSearch] = useState("")
  const [clinics, setClinics] = useState(null)
  const {diagnostic_id} = useParams()
  const [selectedClinic, setSelectedClinic] = useState(null)
  const navigate = useNavigate()
  const storage = useCloudStorage()
  const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback()
  const inputRef = useRef(null)
  // TODO delay hook use debounce custom hook
  // const debouncedSearch = useDebounce(() => {})
  const filteredClinics = useMemo(() => clinics?.filter(clinic => clinic.name.toLowerCase().includes(search.toLowerCase())), [clinics, search])


  useEffect(() => {
    // TODO: select all clinics for the diagnostic_id and then filter them by the search
    // TODO: React Query library for optimization and caching
    const fetchClinics = async () => {
      try {
        const clinics = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/diagnostics/${diagnostic_id}/locations`)
        let filteredClinics = clinics.data
        const search = inputRef?.current?.value
        if (search) {
          const searchLower = search.toLowerCase()
          filteredClinics = clinics.data.filter(clinic =>
            clinic.name.toLowerCase().includes(searchLower) ||
                        clinic.address.toLowerCase().includes(searchLower)
          )
        }
        setClinics(filteredClinics)

      } catch (err) {
        console.error(err)
      }
    }
    fetchClinics()
  }, [search])

  const handleNext = async () => {
    await storage.setItem("selectedLocation", JSON.stringify(selectedClinic))
    navigate("/booking/clinic")
  }

  const handleChooseClinic = async (clinic) => {
    const isSameClinicSelected = clinic.location_id === selectedClinic?.location_id

    if (isSameClinicSelected) {
      setSelectedClinic(null)
      selectionChanged()
    } else {
      if (selectedClinic) {
        selectionChanged()
      } else {
        notificationOccurred("success")
      }
      setSelectedClinic(clinic)
    }
  }


  return (
    <>
      <BackButton onClick={() => navigate(-1)}/>
      <div className="specialization">
        <Header title="Choose Clinic" className="specialization"/>
        <SearchBar ref={inputRef}/>
        <main className="specialization__main">
          {clinics?.map((clinic, index) => (
            <div onClick={() => handleChooseClinic(clinic)}
              key={clinic.location_id}
            >
              <SpecializationBlock
                title={clinic.name}
                subtitle={clinic.address}
                isActive={selectedClinic?.location_id === clinic.location_id}
              />
            </div>))}
        </main>
        {selectedClinic && <MainButton text="Next"
          onClick={handleNext}/>}
      </div>
    </>)
}

export default ClinicSelection