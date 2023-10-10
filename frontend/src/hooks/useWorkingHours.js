import {useEffect, useState} from "react"
import axios from "axios"

export const useWorkingHours = (locationId) => {
  const [workingHours, setWorkingHours] = useState([])
  useEffect(() => {
    if (locationId) {
      axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/working_hours/${locationId}`)
        .then(response => {
          setWorkingHours(response.data)
        })
        .catch(error => {
          console.error("Error fetching working hours:", error)
        })
    }
  }, [locationId])
  return workingHours
}