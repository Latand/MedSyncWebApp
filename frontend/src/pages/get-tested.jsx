import React, {useState, useEffect} from 'react';
import {BackButton} from '@vkruglikov/react-telegram-web-app';
import {useNavigate} from 'react-router-dom';
import Header from "../components/Header.jsx";
import SearchBar from "../components/DoctorsListing/SearchBar.jsx";
import SpecializationCard from "../components/GetTested/DiagnosticType.jsx";


const GetTested = () => {
    let navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [diagnosticTypes, setDiagnosticTypes] = useState([]);
    useEffect(() => {
        // Replace with your actual API endpoint
        const apiUrl = 'https://your-api.com/diagnostic-types';

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
                        <SpecializationCard
                            key={index}
                            className={index % 2 === 0 ? "specialization-card--red" : "specialization-card--blue"}
                            imgSrc={`./images/get-tested/get-tested-${index + 1}.svg`}
                            title={type.title}
                            subtitle={`${type.clinics_count} Clinics`}
                        />
                    ))}
                </main>
            </div>
        </>
    );
};

export default GetTested;
