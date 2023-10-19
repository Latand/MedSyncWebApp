import { useEffect, useState } from "react"
import axios from "axios"
import { generateAllSlotsForMonth, isSlotBooked } from "../utils/slotUtils"

export const useSlots = (
  itemId: any,
  locationId: any,
  selectedDate: any,
  workingHours: any,
  itemType: any
) => {
  const [slots, setSlots] = useState<any[] | null>(null)
  const [availableDays, setAvailableDays] = useState<any[]>([])
  const endpoint = `/api/slots/${itemType}`
  useEffect(() => {
    if (itemId && locationId && selectedDate && workingHours.length > 0) {
      axios
        .get(
          `${
            //@ts-ignore
            import.meta.env.VITE_REACT_APP_API_URL
          }${endpoint}/${itemId}/${locationId}/${selectedDate.getMonth()}`
        )
        .then(response => {
          const bookedSlots = response.data
          const allPossibleSlots = generateAllSlotsForMonth(
            workingHours,
            selectedDate.getMonth(),
            selectedDate.getFullYear()
          )
          const availableSlots = allPossibleSlots.filter(
            slot => !isSlotBooked(slot, bookedSlots)
          )
          const availableDays = Array.from(
            new Set(availableSlots.map(slot => slot.toDateString()))
          )
          setAvailableDays(availableDays)
          setSlots(availableSlots)
        })
        .catch(error => {
          console.error("Error fetching slots:", error)
        })
    }
  }, [itemId, locationId, selectedDate, workingHours, endpoint])

  return { slots, availableDays }
}
