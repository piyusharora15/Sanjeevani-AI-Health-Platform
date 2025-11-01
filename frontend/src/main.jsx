/* This file's job is to initialize our application by:
1. Connecting to the HTML page.
2. Enabling client-side routing with <BrowserRouter>.
3. Providing global authentication state with <AuthProvider>.
4. Rendering your main <App> component.
*/
import React from "react"; // // Import the core React library, which is necessary for creating and managing components.
import ReactDOM from "react-dom/client"; // // Import ReactDOM, which is the library responsible for actually rendering your React components into the real DOM in the browser.
import App from "./App.jsx"; // // Import the main 'App' component that contains all other pages and components of your application.
import "./index.css"; // // Import the global stylesheet. This file contains your Tailwind CSS directives and any other global styles you want to apply to the entire website.
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter from the 'react-router-dom' library which is the component that enables client-side routing. It's the "engine" that listens to URL changes and tells your <App> component which page to display.
import { AuthProvider } from "./context/AuthContext"; // Import the custom AuthProvider from the AuthContext file. This is the global "state manager" for authentication. By wrapping the entire app in this, we make the user's information available to every single component, from the header to the dashboard.

//  --- Application Entry Point ---

/* This is the line that kicks off our entire application.
 1. `document.getElementById('root')`: This finds the single `<div id="root"></div>`
    in our `index.html` file. This div is the "container" for the whole React app.
 2. `ReactDOM.createRoot(...)`: This creates a new "root" for our React application,
    which is the modern way to render React.
 3. `.render(...)`: This tells React to take everything inside the parentheses and
    render it inside the `<div id="root">`.
*/
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode> is a development tool. It doesn't run in the final
  // production build, but in development, it helps you find potential bugs by
  // intentionally running some functions twice to check for side effects.
  <React.StrictMode>
    {/*
      2. Wrap your entire App component with <BrowserRouter>.
      WHY: This is a critical step. By wrapping your App here, you are giving
      every component inside <App> (like your Header, HomePage, Dashboard, etc.)
      the ability to use routing features like <Link>, <Route>, and <Routes>.
      Without this wrapper, routing would not work.
    */}
    <BrowserRouter>
      {/*
        3. Wrap your App with <AuthProvider>.
        WHY: This is your global state provider. Any component nested inside
        <AuthProvider> (which in this case is your entire <App>) can now "consume"
        or access the authentication state (e.g., `userInfo`, `login()`, `logout()`).
        We place it *inside* BrowserRouter so that our Auth context can also use
        routing features if needed (like redirecting on logout).
      */}
      <AuthProvider>
        {/*
          4. Render the <App /> component.
          This is the main component of your application, which acts as the
          central hub and router for all your pages.
        */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
