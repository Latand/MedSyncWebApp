---
title: Frontend Development Setup with React & Vite
---

# Creating a New Web Frontend Application from Scratch with React and Vite


!!! abstract "Overview"
    This section offers insights into the frontend setup process of constructing **a new web application similar to MedSync** from the ground up. 
    The MedSync frontend has been developed using React.js and Vite, emphasizing a smooth integration with Telegram for an enhanced user experience.

!!! warning "Prerequisites"
    A foundational understanding of React is essential to proceed with this guide. 
    If React seems unfamiliar, consider delving into [the official docs](https://react.dev/learn), or this [comprehensive tutorial](https://www.youtube.com/watch?v=-DTUdOJv8w8&list=PL0X6fGhFFNTe_vJIlAQQo0IEgPgk9er3g), or exploring other tutorials that suit your learning style.

!!! info "Purpose of the Guide"
    - This guide is specifically for developers who are eager to create **a new web application**, 
    focusing predominantly on integration with Telegram via React. 

    - Note that this isn't an exhaustive step-by-step tutorial for setting up MedSync WebApp. 
    Instead, it serves as a foundational blueprint, drawing from its core principles and syntax. 

    - Upon the completion of your bespoke application, seamlessly integrate it by positioning your files within the 'frontend' directory.


---

## 1. Setting up a New React App with Vite

Vite offers a faster and more efficient development experience than traditional React setup methods. If you're
unfamiliar with creating React apps using Vite, consider reading [the Vite docs](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

### Installation and Setup

- **Install Node.js**

    **Node.js**: It's essential to have Node.js installed as it provides the runtime for executing JavaScript code server-side. You can download it from [Node.js official website](https://nodejs.org/).

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

## 2. Project Structure

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
      Here's the simplified **final** structure of our MedSync project, with newly added components and directories highlighted for clarity:

      ```hl_lines="3 4 7 9-11 13 15-17 19-24 26"
      medsync-webapp
      ├── public/
      |   |-- images/  (images of the doctors and diagnostic tests)
      |   |-- results/ (test result PDFs)
      |-- src/
      |   |-- assets/
      |   |   |-- images/ (icons and images used in the app)
      |   |
      |   |-- components/
      |   |   |-- Booking/
      |   |   |-- .. (other component directories) 
      |   |
      |   |-- hooks/ (custom React hooks)
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
      |   |   |-- main.scss
      |   |
      |   |-- utils/ (helper functions)
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

## 3. Installing Dependencies

To ensure a smooth integration with Telegram, we've utilized the following dependencies:

- `@vkruglikov/react-telegram-web-app`: A custom React library tailored for integrating with the Telegram WebApp features.
- `axios`: A promise-based HTTP client for making requests to APIs in both the browser and Node.js environments.
- `date-fns`: A modern JavaScript utility library for manipulating dates without extending the native `Date` prototype.
- `moment`: A comprehensive JavaScript date library for parsing, validating, manipulating, and formatting dates.
- `react-router-dom`: The DOM bindings for `react-router`, enabling web app routing and navigation functionality in React applications.
- `sass`: A powerful CSS extension language that allows for variables, nested rules, and other features to write more maintainable and extendable CSS.

You can install these dependencies using the following command:

```bash
npm install @vkruglikov/react-telegram-web-app axios date-fns moment react-router-dom sass
```

---
## 4. Adjust HTML Template

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

## 5. Routing and Page Management

!!! abstract  "Understanding App.jsx Component"
      This section delves into the added functionalities in the [`App.jsx` component](https://github.com/Latand/MedSyncWebApp/blob/main/frontend/src/App.jsx) of the application, explaining the purpose and usage of the code.

When developing a web application, especially one that serves a variety of user interactions and multiple functionalities, 
it's essential to organize the application structure using a **routing mechanism**. 

!!! info "Web Routing"
      Routing in a web app is like a map that decides which page to show based on the website's address; for example, going to `/home` might show the main page, `/about` the about page, and `/contact` the contact page.

For MedSync, we've utilized `React Router`, a powerful routing library for React applications. This library allows for declarative routing, ensuring that the user interface is synchronized with the URL.

!!! example 
    See full code in [App.jsx](https://github.com/Latand/MedSyncWebApp/blob/main/frontend/src/App.jsx)

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


## 6. Component Management and Advanced Functionalities

This section delves into the added functionalities in the `DoctorSelection` component of the application, explaining the purpose and usage of the code.

!!! example
    See full code in [doctor-selection.jsx](https://github.com/Latand/MedSyncWebApp/blob/main/frontend/src/pages/doctor-selection.jsx)

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
          In `DoctorSelection`, we use it to manage data like specialties (`setSpecialties`), search terms (`setSearch`), 
          the list of all doctors (`setAllDoctors`), etc. The data is obtained from the backend and stored in the respective variables.
      
2. **Fetching Data from Backend**:
    - Axios is utilized to fetch data. It’s an HTTP client that communicates with the backend(1) to retrieve specialties, doctors, and location info.
    { .annotate }

        1.  The backend is a server that handles requests from the frontend and responds with the requested data. 
        In our case, the backend is a FastAPI server that handles requests from the frontend and responds with the requested data.

3. **Telegram-specific Features**:

    **You can read the whole page about how we integrated Telegram-specific features [here](telegram.md).**

    - The `BackButton` and `MainButton` are specific native components designed for the Telegram WebApp interface. [Read more here](telegram.md#4-navigation-with-telegrams-buttons)
    - `useHapticFeedback` provides tactile feedback (vibrations) to enhance user experience on mobile devices. [Read more here](telegram.md#haptic-feedback-in-medsync)
    - The Telegram back button is controlled by the `BackButton` component, which, when clicked, navigates to previous page.
    - The Telegram main button, typically present at the bottom of the screen, is controlled by the `MainButton` component. In our context, it's used to proceed with a selected doctor.
    - `useCloudStorage` is a hook that allows us to store data in the Telegram cloud storage. This is useful for persisting data across sessions, 
       ensuring that the user's selected doctor is remembered even if they close the app. [Read more here](telegram.md#3-cloudstorage)

4. **Filtering and Display Logic**:
    - Based on the user’s search terms and selected specialties, the list of doctors displayed is dynamically filtered. This ensures that users see relevant doctor listings tailored to their requirements.

---

## Leveraging Dynamic Theming in Your Application

To achieve a consistent visual experience between your web application and Telegram, understanding and implementing 
the [principles from the **Dynamic Theming with SCSS Variables** section](telegram.md#1-dynamic-theming-with-scss-variables) is vital. 

!!! tip "Quick Guide on Utilizing Theme Colors"
    - The `--tg-theme-bg-color` and `--tg-theme-secondary-bg-color` are the **background colors** and contrast with the `--tg-theme-text-color`, which is the **text color**.
    - The `--tg-theme-secondary-bg-color` can be used for **borders** and **dividers**.
    - The `--tg-theme-hint-color` can be used for **hint text** and **icons**.
    - The `--tg-theme-button-color` and `--tg-theme-button-text-color` also contrasting and are used **for buttons**.
    - The `--tg-theme-link-color` can be used for **links**.

    For an expanded explanation and additional variables, explore the [Telegram theme parameters documentation](https://core.telegram.org/bots/webapps#themeparams).

---

## Additional Notes

Always refer to the documentation of individual libraries or dependencies if encountering issues. Integrating with
Telegram can present unique challenges, so thorough testing is advised.

---

## References

- [Official Vite Documentation](https://vitejs.dev/)
- [React & Vite Setup Tutorial](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)