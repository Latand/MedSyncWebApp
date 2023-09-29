import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import TopBar from "../components/DoctorAbout/TopBar.jsx";
import DoctorInfo from "../components/DoctorAbout/DoctorInfo.jsx";
import Section from "../components/DoctorAbout/Section.jsx";
import ServicesList from "../components/DoctorAbout/ServicesList.jsx";
import axios from "axios";
import {BackButton} from "@vkruglikov/react-telegram-web-app";

const About = () => {
    const {doctor_id} = useParams();
    const [doctor, setDoctor] = useState(null);
    let navigate = useNavigate()

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const response = await axios.get(`https://medsync.botfather.dev/api/doctors/${doctor_id}`);
                console.log(response.data)
                setDoctor(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchDoctorInfo();
    }, [doctor_id]);

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
                    <Section title="Experience">
                        {doctor.experience}
                    </Section>
                    <Section title="Services">
                        <ServicesList services={doctor.services}/>
                    </Section>
                    <Section title="Certificates">
                        {doctor.certificates}
                    </Section>
                    <Section title="Working Time">
                        {doctor.working_time}
                    </Section>
                </main>
            </div>
            }
        </>
    );
};
export default About;
