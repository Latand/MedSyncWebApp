import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BackButton,
    useCloudStorage,
    useHapticFeedback
} from "@vkruglikov/react-telegram-web-app";
import axios from "axios";

import { Header } from "../components/Header";
import { SearchBar } from "../components/DoctorsListing/SearchBar";
import { SpecializationCard } from "../components/GetTested/DiagnosticType";

export const GetTested = () => {
    let navigate = useNavigate();
    // const [search, setSearch] = useState("");
    const [diagnosticTypes, setDiagnosticTypes] = useState([]);
    const [impactOccurred, notificationOccurred, selectionChanged] =
        useHapticFeedback();
    const storage = useCloudStorage();

    const searchRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        try {
            (async () => {
                let { data: filteredDiagnosticTypes } = await axios.get<any>(
                    //@ts-ignore
                    `${import.meta.env.VITE_REACT_APP_API_URL}/api/diagnostics/`
                );
                const search = searchRef?.current?.value;

                if (search) {
                    const searchLower = search.toLowerCase();
                    filteredDiagnosticTypes = filteredDiagnosticTypes.filter(
                        (type: any) =>
                            type.type_name.toLowerCase().includes(searchLower)
                    );
                }
                setDiagnosticTypes(filteredDiagnosticTypes);
            })();
        } catch (error) {
            console.error(
                "Error fetching diagnostic types:",
                (error as Error).message
            );
        }
    }, [searchRef?.current?.value]);

    return (
        <>
            <BackButton onClick={() => navigate("/")} />
            <div className="get-tested">
                <Header
                    className={"get-tested__header"}
                    title={"Get Tested"}
                />
                <SearchBar ref={searchRef} />
                <main className="get-tested__main">
                    {diagnosticTypes.map((type: any, index) => (
                        <Link
                            to={`/booking/diagnostics/${type.diagnostic_id}`}
                            key={index}
                            className="get-tested__link"
                            onClick={async () => {
                                await storage.setItem(
                                    "selectedDiagnostic",
                                    JSON.stringify(type)
                                );
                                notificationOccurred("success");
                            }}
                        >
                            <SpecializationCard
                                className="specialization-card"
                                imgSrc={type.photo_url}
                                title={type.type_name}
                                subtitle={`${type.clinics_count || 0} Clinics`}
                                price={type.price}
                            />
                        </Link>
                    ))}
                </main>
            </div>
        </>
    );
};
