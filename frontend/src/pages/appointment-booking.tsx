import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BackButton,
  MainButton,
  useCloudStorage,
  useHapticFeedback
} from "@vkruglikov/react-telegram-web-app"
import { useWorkingHours } from "../hooks"
import { useSlots } from "../hooks"
import { TimeSlot } from "../components/Booking/TimeSlot"
import { Calendar } from "../components/Booking/Calendar"
import { Header } from "../components/Header"

interface SlotSelectionProps {
    storageKey: any;
    itemType: any;
}

export const SlotSelection: React.FC<SlotSelectionProps> = ({
  storageKey,
  itemType
}) => {
  const navigate = useNavigate()
  const [selectedItem, setParsedItem] = useState<any | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any | null>(null)
  const [, notificationOccurred, selectionChanged] =
        useHapticFeedback()
  const storage = useCloudStorage()
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null)

  useEffect(() => {
    storage.getItem(storageKey).then(storedItem => {
      setParsedItem(JSON.parse(storedItem))
    })
    storage.getItem("selectedLocation").then(storedLocation => {
      if (storedLocation) {
        setSelectedLocation(JSON.parse(storedLocation))
      }
    })
  }, [storage])

  const workingHours = useWorkingHours(selectedLocation?.location_id)

  const { slots, availableDays } = useSlots(
    itemType === "doctors"
      ? selectedItem?.doctor_id
      : selectedItem?.diagnostic_id,
    selectedLocation?.location_id,
    selectedDate,
    workingHours,
    itemType
  )

  const handleDateChange = (date: Date) => {
    selectionChanged()
    setSelectedDate(date)
  }

  const handleSlotSelection = (slot: any) => {
    setSelectedTimeSlot(slot)
    selectionChanged()
  }

  const handleNext = async () => {
    notificationOccurred("success")
    await storage.setItem(
      "selectedTimeSlot",
      JSON.stringify(selectedTimeSlot)
    )
    navigate(`/booking/patient-info-form/${itemType}`)
  }

  return (
    <>
      <BackButton onClick={() => navigate(-1)} />
      <div className="time-details">
        <Header
          className="time-details"
          title="Time Details"
        />
        <main className="time-details__main">
          <Calendar
            onDateChange={handleDateChange}
            availableDays={availableDays}
          />
          {selectedDate && slots && (
            <TimeSlot
              availableSlots={slots}
              selectedTimeSlot={selectedTimeSlot}
              setSelectedTimeSlot={handleSlotSelection}
              selectedDate={selectedDate}
            />
          )}
          {selectedTimeSlot && (
            <MainButton onClick={handleNext}></MainButton>
          )}
        </main>
      </div>
    </>
  )
}
