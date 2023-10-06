---
title: Frontend Development Setup with React.js & Vite
---

# Frontend Development Setup with React.js & Vite


## 1. Creating a New Web Application from Scratch
!!! abstract 
      This section provides an overview of the frontend setup process for the similar new web application from scratch. 
      The frontend of MedSync is developed using React.js, Vite, and includes an integration with Telegram for a seamless user
      experience.

---

### 1. Setting up a New React App with Vite

Vite offers a faster and more efficient development experience than traditional React setup methods. If you're
unfamiliar with creating React apps using Vite, consider following
this [comprehensive tutorial](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

#### Installation and Setup

- **Initialize the Project**

    ```bash
    npm create vite@latest
    ```
    !!! note
          Select `React` and `JavaScript` when prompted, also enter the name of the project (e.g. `medsync-webapp`)

- **Navigate to the project directory**:

    ```bash
    cd medsync-webapp
    ```

- **Install Dependencies**:

    ```bash
    npm install
    ```

### 2. Project Structure

Here is how your project structure might look like:

   ```
   medsync-webapp
   ├── node_modules
   ├── public
   │   └── vite.svg
   ├── src
   │   ├── App.css
   │   ├── App.jsx
   │   ├── index.css
   │   ├── main.jsx
   │   └── assets
   ├── .gitignore
   ├── index.html
   ├── package.json
   ├── package-lock.json
   ├── README.md
   ├── .eslintrc.cjs
   └── vite.config.js
   ```

!!! example
      Here's the ==**final**== structure of our MedSync project, with newly added components and directories highlighted for clarity:

      ```hl_lines="4-6 8-10 12-15 17-19 21-23 25-30 32-34" 
      medsync-webapp
      |-- src/
      |   |-- assets/
      |   |   |-- images/
      |   |   |   |-- about/
      |   |   |   |-- ... (other image directories) 
      |   |   |   |
      |   |   |-- results/
      |   |   |   |-- biopsy.pdf
      |   |   |   |-- ... (other test result PDFs)
      |   |
      |   |-- components/
      |   |   |-- Booking/
      |   |   |-- DoctorAbout/
      |   |   |-- .. (other component directories) 
      |   |
      |   |-- hooks/
      |   |   |-- useSlots.js
      |   |   |-- useWorkingHours.js
      |   |
      |   |-- pages/
      |   |   |-- appointment-booking.jsx
      |   |   |-- ... (other page components)
      |   |
      |   |-- scss/
      |   |   |-- blocks/
      |   |   |   |-- _about.scss
      |   |   |   |-- ... (other block SCSS files)
      |   |   |-- utils/
      |   |       |-- main.scss
      |   |
      |   |-- utils/
      |   |   |-- slotUtils.js
      |   |   |-- summaryData.js
      |   |
      |   |-- App.css
      |   |-- App.jsx
      |   |-- main.jsx
      |
      |-- .env
      |-- .env.dist
      |-- .eslintrc.cjs
      |-- index.html
      |-- package.json
      |-- package-lock.json
      |-- vite.config.js
      ```

---

### 3. Adjust HTML Template

Ensure that the JavaScript file for Telegram (`https://telegram.org/js/telegram-web-app.js`) is included in the HTML
template. This script is necessary for the web app to interact with Telegram.

So your `index.html` file should look like this:

```html hl_lines="9" title="index.html"
<!DOCTYPE html>
<html lang="en" class="html">
  <head>
<!--  ... rest of the head section-->
     
<!--  import any additional fonts if needed   -->
     
<!--    import Telegram Web App JS Script-->
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
  </head>
  <!--    ... rest of the HTML template-->
</html>

```

---

### 3. Routing and Page Management

!!! abstract
      This section delves into the added functionalities in the [`App.jsx` component](https://github.com/Latand/MedSyncWebApp/blob/main/frontend/src/App.jsx) of the application, explaining the purpose and usage of the code.

When developing a web application, especially one that serves a variety of user interactions and multiple functionalities, 
it's essential to organize the application structure using a **routing mechanism**. 

!!! info
      Routing in a web app is like a map that decides which page to show based on the website's address; for example, going to `/home` might show the main page, `/about` the about page, and `/contact` the contact page.

For MedSync, we've utilized `React Router`, a powerful routing library for React applications. This library allows for declarative routing, ensuring that the user interface is synchronized with the URL.

```js title="src/App.jsx" hl_lines="12 17 19"
import {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import LandingPage from "./pages/landing-page.jsx";
import DoctorSelection from "./pages/doctor-selection.jsx";
// ... other imports

const App = () => {
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            // Alternatively to what can be set with react-telegram-web-app, you can directly set the following properties:
            window.Telegram.WebApp.expand();
        }
    }, []);

    return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/see_a_doctor" element={<DoctorSelection/>}/>
                //     ... other routes
                </Routes>
            </BrowserRouter>
    );
};

export default App;
```

**Features in `App.jsx:`**

1. **Imports**: 
    - `useEffect` is a React hook that enables side effects in function components.
    - `BrowserRouter`, `Route`, and `Routes` are components from `react-router-dom` that provide the routing mechanism.
    - The imported pages are individual components representing distinct sections or functionalities of the app, like the *landing page*, *doctor selection page*, etc.

2. **Initialization with Telegram WebApp**

    The `useEffect` hook is used to expand the Telegram WebApp when the application loads: `window.Telegram.WebApp.expand();`

3. [ **BrowserRouter** ](https://reactrouter.com/en/main/router-components/browser-router)

      This is a router implementation that uses the HTML5 history API, making the URLs look clean and readable.

4. **Routes**

    These define the different paths in the application and which component or page to render for each path. 
      
    !!! example
              For instance, the root path (`/`) renders the `LandingPage` component, and the `/see_a_doctor` path renders the `DoctorSelection` component. These routes ensure users can navigate through the different sections of the MedSync application.

5. **Parameterized Routing**

    Some routes like `/doctor/:doctor_id` use parameters to dynamically fetch and display data based on the given parameter. In this case, the `:doctor_id` can be any valid doctor's ID, allowing for the dynamic rendering of specific doctor details.

6. **Functional Components and Props**

    Some routes, like those for `SlotSelection`, utilize props to pass data down to the component, making it more dynamic and reusable.

For a more in-depth look into the code and to understand the structure and logic more comprehensively, refer to the [provided code link](https://github.com/Latand/MedSyncWebApp/blob/main/frontend/src/App.jsx).


### 4. Component Management and Advanced Functionalities

!!! abstract
      This section delves into the added functionalities in the [`DoctorSelection` component](https://github.com/Latand/MedSyncWebApp/blob/main/frontend/src/pages/doctor-selection.jsx) of the application, explaining the purpose and usage of the code.

```js title="src/pages/doctor-selection.jsx" hl_lines="20 22-30 64 67"
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {BackButton, MainButton, useCloudStorage, useHapticFeedback} from "@vkruglikov/react-telegram-web-app";
import DoctorCard from "../components/DoctorsListing/DoctorCard.jsx";
// ... other imports


const DoctorSelection = () => {
    const navigate = useNavigate()
    const storage = useCloudStorage();
    const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback();
    const [specialties, setSpecialties] = useState([]);
    const [search, setSearch] = useState("");
    const [allDoctors, setAllDoctors] = useState([]);
    const [displayedDoctors, setDisplayedDoctors] = useState([]);
    const [specialty, setSpecialty] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    window.Telegram.WebApp.enableClosingConfirmation();

    const fetchSpecialties = async () => {
        try {
            // ... fetch specialties from backend
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/specialties/`);
            setSpecialties(response.data);
        } catch (error) {
            console.error(error.message);
        }
    };
    // ...  fetch all doctors from backend

    // ...  fetch location info from backend

    // ...  handle doctor selection

    useEffect(() => {
        notificationOccurred("success");
        fetchAllDoctors();
        fetchSpecialties()
        
        // Using Telegram Cloud Storage to persist data
        storage.getItem("selectedDoctor").then((value) => {
                if (value) {
                    setSelectedDoctor(JSON.parse(value));
                }
            }
        );

    }, []);

    //  ...   filter doctors based on search and specialty


    return (<>
        <BackButton onClick={() => navigate("/")}/>
        // ...  display header, search bar and specialties navbar
        {selectedDoctor && <MainButton
            textColor="#FFF"
            text={`Book with ${selectedDoctor.full_name}`}
            onClick={ async () => {
                
                // Using Telegram Haptic Feedback to enhance user experience
                notificationOccurred("success");
                
                // Using Telegram Cloud Storage to persist data
                await storage.setItem("selectedDoctor", JSON.stringify(selectedDoctor));
                navigate(`/doctor/${selectedDoctor.doctor_id}`);
            }}
        />}
    </>);
};

export default DoctorSelection;
```


**Features in `DoctorSelection:`**

1. **Hooks and State Management**: 
    - The `useState` hook allows us to introduce state to our function components. In simple terms, `useState` lets us save, track, and modify data within our component.
    
    !!! example
          In `DoctorSelection`, we use it to manage data like specialties (`setSpecialties`), search terms (`setSearch`), the list of all doctors (`setAllDoctors`), etc.
      
2. **Fetching Data from Backend**:
    - Axios is utilized to fetch data. It’s an HTTP client that communicates with the backend(1) to retrieve specialties, doctors, and location info.
    { .annotate }

        1.  The backend is a server that handles requests from the frontend and responds with the requested data. 
        In our case, the backend is a FastAPI server that handles requests from the frontend and responds with the requested data.

3. **Telegram-specific Features**:
    - The `BackButton` and `MainButton` are specific components designed for the Telegram WebApp interface, ensuring that users can navigate within the app seamlessly when accessed through Telegram.
    - `useHapticFeedback` provides tactile feedback (vibrations) to enhance user experience on mobile devices.
    - The Telegram back button is controlled by the `BackButton` component, which, when clicked, navigates the user back to the homepage.
    - The Telegram main button, typically present at the bottom of the screen, is controlled by the `MainButton` component. In our context, it's used to proceed with a selected doctor.
    - `useCloudStorage` is a hook that allows us to store data in the Telegram cloud storage. This is useful for persisting data across sessions, ensuring that the user's selected doctor is remembered even if they close the app.

4. **Filtering and Display Logic**:
    - Based on the user’s search terms and selected specialties, the list of doctors displayed is dynamically filtered. This ensures that users see relevant doctor listings tailored to their requirements.

---

### 5. Dynamic Theming with SCSS Variables

Dynamic theming allows a web application to adjust its appearance according to user preferences or system settings, leading to improved user experience and interface consistency. MedSync leverages this by integrating Telegram theme parameters to adjust the interface based on the Telegram user's current theme. 

#### Understanding the Theme Parameters:

From the provided image, the Telegram Mini Apps can fetch the user's theme settings. These settings, formatted in CSS custom properties (`var(--property-name)`), can be directly accessed and applied within our SCSS. 

For instance, `var(--tg-theme-bg-color)` fetches the background color from the Telegram theme settings. This becomes a powerful tool for maintaining consistent user experience across platforms.

#### Utilizing SCSS for Dynamic Styling:

The `_vars.scss` file centralizes all the color and style variables, providing easy access and modification capabilities. Here's a breakdown:

1. **Font Weights**:
    - Set the different weights for text content.
  
2. **Gradients & Shadows**:
    - Define the general gradients and shadows used throughout the application.

3. **Telegram Theme Integration**:
    - Integrate with Telegram theme colors to fetch real-time theme data and apply it dynamically.
    - For instance, `$tg-theme-text: var(--tg-theme-text-color, black);` sets the text color based on the Telegram theme, but defaults to black if not available.

4. **Additional Colors**:
    - Define other static colors which are not based on Telegram's theme but are essential for the app.

#### Practical Application: An Example

The `.search-bar` class showcases how these variables are applied in practice:

- The input field’s border and background colors use the `$tg-theme-secondary-bg` variable, effectively adapting to the Telegram theme.
- The text color for the input and the search icon adapt based on the `$tg-theme-text` variable.
  
```scss
.search-bar {
  &__input {
    border: 1px solid $tg-theme-secondary-bg;
    background: $tg-theme-secondary-bg;
    color: $tg-theme-text;
  }
  &__icon {
    &__img {
      stroke: $tg-theme-text;
    }
  }
}
```

By using such dynamic SCSS variables in combination with Telegram's theme parameters, MedSync ensures a visually cohesive experience for users irrespective of their chosen Telegram theme.



## Additional Notes

Always refer to the documentation of individual libraries or dependencies if encountering issues. Integrating with
Telegram can present unique challenges, so thorough testing is advised.

---

## References

- [Official Vite Documentation](https://vitejs.dev/)
- [React & Vite Setup Tutorial](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)