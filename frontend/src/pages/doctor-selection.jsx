import React, {useEffect, useState} from 'react';
import axios from 'axios'; // Install Axios via npm if you haven't already
import {useNavigate} from "react-router-dom";
import {BackButton, MainButton, useCloudStorage, useHapticFeedback} from "@vkruglikov/react-telegram-web-app";
import DoctorCard from "../components/DoctorsListing/DoctorCard.jsx";
import Header from "../components/DoctorsListing/Header.jsx";
import SearchBar from "../components/DoctorsListing/SearchBar.jsx";
import Nav from "../components/DoctorsListing/Nav.jsx";


const DoctorSelection = () => {
    let navigate = useNavigate()
    let storage = useCloudStorage();

    const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback();
    const [specialties, setSpecialties] = useState([]);
    const [search, setSearch] = useState("");
    const [allDoctors, setAllDoctors] = useState([]);
    const [displayedDoctors, setDisplayedDoctors] = useState([]);
    const [specialty, setSpecialty] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);

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
        storage.getItem("selectedDoctor").then((value) => {
                if (value) {
                    setSelectedDoctor(JSON.parse(value));
                }
            }
        );

    }, [storage]);

    useEffect(() => {
        let filteredDoctors = allDoctors;

        if (specialty) {
            filteredDoctors = filteredDoctors.filter(doctor => doctor.specialty_id === specialty);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            filteredDoctors = filteredDoctors.filter(doctor =>
                doctor.full_name.toLowerCase().includes(searchLower) ||
                doctor.specialty_name.toLowerCase().includes(searchLower)
            );
        }

        setDisplayedDoctors(filteredDoctors);
        selectionChanged();

    }, [specialty, search, allDoctors, selectionChanged]);


    return (<>
        <BackButton onClick={() => navigate("/")}/>
        <div className="doctor-selection">
            <Header/>
            <SearchBar search={search} setSearch={setSearch}/>
            {specialties &&
                <Nav specialties={specialties} onSpecialtyClick={setSpecialty} selectedSpecialty={specialty}/>
            }
            {displayedDoctors && <main className="main">
                {displayedDoctors.map(doctor => (<DoctorCard
                    className={selectedDoctor && selectedDoctor.doctor_id === doctor.doctor_id ? 'card card--active' : 'card'}
                    key={doctor.doctor_id}
                    name={doctor.full_name}
                    title={doctor.specialty_name}
                    address={doctor.address}
                    price={doctor.price}
                    avg_rating={doctor.avg_rating ? doctor.avg_rating : 0}
                    reviews={doctor.reviews ? doctor.reviews : 0}
                    doctorImage={doctor.photo_url}
                    onClick={() => {
                        if (selectedDoctor?.doctor_id === doctor.doctor_id) {
                            setSelectedDoctor(null);
                        } else {
                            setSelectedDoctor(doctor);
                        }
                        impactOccurred("light");
                    }}
                />))}
            </main>}
        </div>
        {selectedDoctor && <MainButton
            textColor="#FFF"
            text={`Book with ${selectedDoctor.full_name}`}
            onClick={async () => {
                selectionChanged();
                await storage.setItem("selectedDoctor", JSON.stringify(selectedDoctor));
                navigate(`/doctor/${selectedDoctor.doctor_id}`);
            }}
        />}
    </>);
};

export default DoctorSelection;
