// About.js
import React from 'react';
import {useParams} from "react-router-dom";

const About = () => {

    const {doctor_id} = useParams();
    return (
        <div className="about">
            <header className="header">
                <TopBar title="About"/>
                <DoctorInfo
                    name="Dr. Harry Butler"
                    specialty="Hydrogeologist"
                    status="Available"
                    imageSrc="./images/doctors-listing/doctor-1.png"
                />
            </header>
            <main className="about__main">
                <Section title="Experience">
                    {/* Experience content */}
                </Section>
                <Section title="Services">
                    <ServicesList services={/* Services array */}/>
                </Section>
                <Section title="Certificates">
                    {/* Certificates content */}
                </Section>
                <Section title="Working Time">
                    {/* Working Time content */}
                </Section>
            </main>
        </div>
    )
};

export default About;
