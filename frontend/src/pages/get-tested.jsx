import React, {useEffect, useState} from "react"
import {BackButton, useCloudStorage, useHapticFeedback} from "@vkruglikov/react-telegram-web-app"
import {Link, useNavigate} from "react-router-dom"
import Header from "../components/Header.jsx"
import SearchBar from "../components/DoctorsListing/SearchBar.jsx"
import SpecializationCard from "../components/GetTested/DiagnosticType.jsx"
import axios from "axios"


const GetTested = () => {
  let navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [diagnosticTypes, setDiagnosticTypes] = useState([])
  const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback()
  const storage = useCloudStorage()

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/diagnostics/`)
      .then(response => {
        let filteredDiagnosticTypes = response.data
        if (search) {
          const searchLower = search.toLowerCase()
          filteredDiagnosticTypes = response.data.filter(type =>
            type.type_name.toLowerCase().includes(searchLower)
          )
        }
        setDiagnosticTypes(filteredDiagnosticTypes)

      })
      .catch(error => {
        console.error("Error fetching diagnostic types:", error)
      })
  }, [search])

  return (
    <>
      <BackButton onClick={() => navigate("/")}/>
      <div className="get-tested">
        <Header className={"get-tested__header"} title={"Get Tested"}/>
        <SearchBar search={search} setSearch={setSearch}/>
        <main className="get-tested__main">
          {diagnosticTypes.map((type, index) => (
            <Link to={`/booking/diagnostics/${type.diagnostic_id}`}
              key={index}
              className="get-tested__link"
              onClick={async () => {
                await storage.setItem("selectedDiagnostic", JSON.stringify(type))
                notificationOccurred("success")
              }}
            >
              <SpecializationCard
                className="specialization-card"
                imgSrc={type.photo_url}
                title={type.type_name}
                subtitle={`${type.clinics_count || 0} Clinics`}
                price={type.price}
              />
            </Link>
          ))}
        </main>
      </div>
    </>
  )
}

export default GetTested
