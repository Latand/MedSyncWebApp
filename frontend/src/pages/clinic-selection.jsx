import SearchBar from "../components/DoctorsListing/SearchBar.jsx";
import {useEffect, useState} from "react";
import Header from "../components/Header.jsx";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {BackButton, MainButton, useCloudStorage} from "@vkruglikov/react-telegram-web-app";

const SpecializationBlock = ({title, subtitle, isActive}) => {
    return (
        <section className={`specialization-block ${isActive ? 'specialization-block--active' : ''}`}>
            <div className="specialization-block__title">{title}</div>
            <div className="specialization-block__subtitle">{subtitle}</div>
        </section>);
};

const ClinicSelection = () => {
    const [search, setSearch] = useState("");
    const [clinics, setClinics] = useState(null);
    const {diagnostic_id} = useParams();
    const [selectedClinic, setSelectedClinic] = useState(null);
    const navigate = useNavigate();
    const storage = useCloudStorage();


    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const clinics = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/diagnostics/${diagnostic_id}/locations`);
                setClinics(clinics.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchClinics();
    }, []);

    const handleNext = async () => {
        navigate(`/booking/diagnostics/${diagnostic_id}/locations/${selectedClinic}/doctors`)
    }


    return (
        <>
            <BackButton onClick={() => navigate(-1)}/>
            <div className="specialization">
                <Header title="Choose Clinic" className="specialization"/>
                <SearchBar search={search} setSearch={setSearch}/>
                <main className="specialization__main">
                    {clinics && clinics.map((clinic, index) => (
                        <div onClick={() => setSelectedClinic(clinic.location_id)}
                             key={index}
                        >
                            <SpecializationBlock
                                title={clinic.name}
                                subtitle={clinic.address}
                                isActive={selectedClinic === clinic.location_id}
                            />
                        </div>))}
                </main>
                {selectedClinic && <MainButton text="Next"
                                               onClick={handleNext}/>}
            </div>
        </>);
};

export default ClinicSelection;