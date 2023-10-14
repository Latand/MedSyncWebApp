import axios from "axios";

export const fetchUserDataAndLocationInfo = async (storage: any) => {
    try {
        let savedUserData = JSON.parse(await storage.getItem("user_data"));
        let selectedTimeSlot = JSON.parse(
            await storage.getItem("selectedTimeSlot")
        );
        const locationInfo = JSON.parse(
            await storage.getItem("selectedLocation")
        );
        try {
            const workingHours = await axios.get(
                //@ts-ignore
                `${import.meta.env.VITE_REACT_APP_API_URL}/api/working_hours/${
                    locationInfo.location_id
                }`
            );
            // make date object from string inside selectedTimeSlot
            selectedTimeSlot = new Date(selectedTimeSlot);

            return {
                error: false,
                selectedTimeSlot: selectedTimeSlot,
                selectedLocation: locationInfo,
                userData: savedUserData,
                hoursArray: workingHours.data
            };
        } catch (err) {
            console.error(err);
            return {
                error: true
            };
        }
    } catch (err) {
        console.error(err);
        return {
            error: true
        };
    }
};
