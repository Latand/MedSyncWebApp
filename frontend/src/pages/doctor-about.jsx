import {useNavigate, useParams} from "react-router-dom"
import TopBar from "../components/DoctorAbout/TopBar.jsx"
import DoctorInfo from "../components/DoctorAbout/DoctorInfo.jsx"
import Section from "../components/DoctorAbout/Section.jsx"
import ServicesList from "../components/DoctorAbout/ServicesList.jsx"
import axios from "axios"
import {BackButton} from "@vkruglikov/react-telegram-web-app"
import WorkingHours from "../components/Resume/WorkingHours.jsx"
import {useEffect, useState} from "react"

const About = () => {
  const {doctor_id} = useParams()
  const [doctor, setDoctor] = useState(null)
  const [workingHours, setWorkingHours] = useState([])
  let navigate = useNavigate()


  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const doctor = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/doctors/${doctor_id}`)
        const workingHours = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/working_hours/${doctor.data.location_id}`)
        setWorkingHours(workingHours.data)
        setDoctor(doctor.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchDoctorInfo()
  }, [doctor_id])

  return (
    <>
      <BackButton onClick={() => navigate(-1)}/>
      {doctor && <div className="about">
        <header className="header">
          <TopBar title="About"/>
          <DoctorInfo
            name={doctor.full_name}
            specialty={doctor.specialty_name}
            status="Available"
            imageSrc={doctor.photo_url}
          />
        </header>
        <main className="about__main">
          <Section title="Experience" tag="experience">
            {doctor.experience}
          </Section>
          <Section title="Services" tag="services">
            <ServicesList services={doctor.services}/>
          </Section>
          <Section title="Certificates" tag="certificates">
            {doctor.certificates}
          </Section>
          <Section title="Working Time" tag="working-time">
            <WorkingHours hoursArray={workingHours}/>
          </Section>
          <Section title="Location" tag="location">
            <div className="location">
              <p className="about__section__title">{doctor.location_name}</p>
              <p className="about__section__text">{doctor.location_address}</p>
            </div>
          </Section>
        </main>
      </div>
      }
    </>
  )
}
export default About
