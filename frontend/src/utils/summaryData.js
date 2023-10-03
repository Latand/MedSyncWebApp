import axios from "axios";

const fetchUserDataAndLocationInfo = async (
    storage, showPopup, navigate,
) => {
    try {
        let savedUserData = JSON.parse(await storage.getItem('user_data'))
        let selectedTimeSlot = JSON.parse(await storage.getItem('selectedTimeSlot'))
        const locationInfo = JSON.parse(await storage.getItem('selectedLocation'))
        // from JSON to Object
        if (!selectedTimeSlot || !savedUserData) {
            await showPopup({message: 'Sorry, there is missing data! Start again!'});
            navigate('/');
            return;
        }
        try {
            console.log('locationInfo', locationInfo)
            const workingHours = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/working_hours/${locationInfo.location_id}`)
            // make date object from string inside selectedTimeSlot
            selectedTimeSlot = new Date(selectedTimeSlot);

            return {
                "selectedTimeSlot": selectedTimeSlot,
                "selectedLocation": locationInfo,
                "userData": savedUserData,
                "hoursArray": workingHours.data
            }
        } catch (err) {
            console.error(err);
        }
    } catch (err) {
        console.error(err);
    }
};

export default fetchUserDataAndLocationInfo;