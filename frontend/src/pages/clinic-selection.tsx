import {useEffect, useMemo, useRef, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"

import axios from "axios"

import {BackButton, MainButton, useCloudStorage, useHapticFeedback} from "@vkruglikov/react-telegram-web-app"
import {Header} from "../components/Header"
import {SearchBar} from "../components/DoctorsListing/SearchBar"
import {useDebounce} from "../hooks"

interface SpecializationBlockProps {
    title: string;
    subtitle: string;
    isActive: boolean;
}

const SpecializationBlock: React.FC<SpecializationBlockProps> = ({
  title,
  subtitle,
  isActive
}) => {
  return (
    <section
      className={`specialization-block ${
        isActive ? "specialization-block--active" : ""
      }`}
    >
      <div className="specialization-block__title">{title}</div>
      <div className="specialization-block__subtitle">{subtitle}</div>
    </section>
  )
}

export const ClinicSelection = () => {
  const [clinics, setClinics] = useState<any[] | null>(null)
  const [selectedClinic, setSelectedClinic] = useState<any | null>(null)

  const searchRef = useRef<HTMLInputElement | null>(null)

  const {diagnostic_id} = useParams()
  const navigate = useNavigate()
  const storage = useCloudStorage()
  const [impactOccurred, notificationOccurred, selectionChanged] =
        useHapticFeedback()

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const {data} = await axios.get(
          `${
            //@ts-ignore
            import.meta.env.VITE_REACT_APP_API_URL
          }/api/diagnostics/${diagnostic_id}/locations`
        )

        setClinics(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchClinics()
  }, [searchRef?.current?.value])

  const debouncedSearch = useDebounce(searchRef?.current?.value)

  const filteredClinics = useMemo(() => {
    const search = debouncedSearch?.toLowerCase()

    if (!clinics) return []

    if (!search) return clinics

    return clinics.filter(
      clinic =>
        clinic.name.toLowerCase().includes(search) ||
                clinic.address.toLowerCase().includes(search)
    )
  }, [debouncedSearch])

  const handleNext = async () => {
    await storage.setItem(
      "selectedLocation",
      JSON.stringify(selectedClinic)
    )
    navigate("/booking/clinic")
  }

  const handleChooseClinic = async (clinic: any) => {
    const isSameClinicSelected =
            clinic.location_id === selectedClinic?.location_id

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
        <Header
          title="Choose Clinic"
          className="specialization"
        />
        <SearchBar ref={searchRef}/>
        <main className="specialization__main">
          {filteredClinics.map((clinic, index) => (
            <div
              onClick={() => handleChooseClinic(clinic)}
              key={index}
            >
              <SpecializationBlock
                title={clinic.name}
                subtitle={clinic.address}
                isActive={
                  selectedClinic?.location_id ===
                                    clinic.location_id
                }
              />
            </div>
          ))}
        </main>
        {selectedClinic && (
          <MainButton
            text="Next"
            onClick={handleNext}
          />
        )}
      </div>
    </>
  )
}
