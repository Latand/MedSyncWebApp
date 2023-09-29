import React, {useEffect, useState} from 'react';
import axios from 'axios'; // Install Axios via npm if you haven't already
import {useNavigate} from "react-router-dom";
import {BackButton} from "@vkruglikov/react-telegram-web-app";
import DoctorCard from "../components/DoctorCard.jsx";
import Header from "../components/Header.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Nav from "../components/Nav.jsx";


const DoctorSelection = () => {
    let navigate = useNavigate()
    const [specialties, setSpecialties] = useState([]);
    const [search, setSearch] = useState("");
    const [allDoctors, setAllDoctors] = useState([]);
    const [displayedDoctors, setDisplayedDoctors] = useState([]);
    const [specialty, setSpecialty] = useState("");

    const fetchSpecialties = async () => {
        try {
            const response = await axios.get('https://medsync.botfather.dev/api/specialties/');
            setSpecialties(response.data);
        } catch (error) {
            console.error(error.message);
        }
    };
    const fetchAllDoctors = async () => {
        try {
            const response = await axios.get('https://medsync.botfather.dev/api/doctors/');
            setAllDoctors(response.data);
            setDisplayedDoctors(response.data);  // Initially display all doctors
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchAllDoctors();
        fetchSpecialties()
    }, []);

    useEffect(() => {
        if (specialty) {
            const filteredDoctors = allDoctors.filter(doctor => doctor.specialty_id === specialty);
            setDisplayedDoctors(filteredDoctors);
        } else {
            setDisplayedDoctors(allDoctors);  // If no specialty is selected, show all doctors
        }
    }, [specialty, allDoctors]);

    useEffect(() => {
        const filteredDoctors = allDoctors.filter(doctor =>
            doctor.full_name.toLowerCase().includes(search.toLowerCase()) ||
            doctor.specialty_name.toLowerCase().includes(search.toLowerCase())
        );
        setDisplayedDoctors(filteredDoctors);
    }, [search, allDoctors]);

    return (<>
        <BackButton onClick={() => navigate(-1)}/>
        <div className="wrapper">
            <Header/>
            <SearchBar search={search} setSearch={setSearch}/>
            {specialties &&
                <Nav specialties={specialties} onSpecialtyClick={setSpecialty} selectedSpecialty={specialty}/>
            }
            {displayedDoctors && <main className="main">
                {displayedDoctors.map(doctor => (<DoctorCard
                    key={doctor.doctor_id}
                    name={doctor.full_name}
                    title={doctor.specialty_name}
                    address={doctor.address}
                    price={doctor.price}
                    avg_review={doctor.avg_review ? doctor.avg_review : 0}
                    reviews={doctor.reviews ? doctor.reviews : 0}
                    doctorImage={doctor.photo_url}
                />))}
            </main>}
        </div>
    </>);
};

export default DoctorSelection;
