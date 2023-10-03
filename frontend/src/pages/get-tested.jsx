import React, {useEffect, useState} from 'react';
import {BackButton} from '@vkruglikov/react-telegram-web-app';
import {Link, useNavigate} from 'react-router-dom';
import Header from "../components/Header.jsx";
import SearchBar from "../components/DoctorsListing/SearchBar.jsx";
import SpecializationCard from "../components/GetTested/DiagnosticType.jsx";
import axios from "axios";


const GetTested = () => {
    let navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [diagnosticTypes, setDiagnosticTypes] = useState([]);
    useEffect(() => {
        // Replace with your actual API endpoint
        const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/diagnostics/`;

        axios.get(apiUrl)
            .then(response => {
                setDiagnosticTypes(response.data);
            })
            .catch(error => {
                console.error('Error fetching diagnostic types:', error);
            });
    }, []);  // Empty dependency array means this useEffect runs once, similar to componentDidMount

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
                        >
                            <SpecializationCard
                                className="specialization-card"
                                imgSrc={type.photo_url}
                                title={type.type_name}
                                subtitle={`${type.clinics_count || 0} Clinics`}
                            />
                        </Link>
                    ))}
                </main>
            </div>
        </>
    );
};

export default GetTested;
