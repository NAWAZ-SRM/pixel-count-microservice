import React, { useState } from 'react';
import OmeroLoginButton from './OmeroLoginButton'; // Import the Login Button component

const ParentComponent = () => {
  const [csrfToken, setCsrfToken] = useState(null);
  const [cookies, setCookies] = useState(null);

  // Callback function to handle successful login
  const handleLoginSuccess = (csrfToken, cookies) => {
    setCsrfToken(csrfToken);
    setCookies(cookies);

    // You can now use csrfToken and cookies to make API requests
    console.log('Logged in! CSRF Token:', csrfToken, 'Cookies:', cookies);

    // Example API request with csrfToken and cookies
    fetch('https://omero-api-url', {
      method: 'GET', // Or POST
      headers: {
        'X-CSRFToken': csrfToken, // Use CSRF token if needed
        'Cookie': cookies, // Include cookies if necessary
      },
      credentials: 'include' // Send cookies along with the request
    }).then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
      });
  };

  return (
    <div>
      <h1>Omero API Login Example</h1>
      <OmeroLoginButton onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default ParentComponent;
