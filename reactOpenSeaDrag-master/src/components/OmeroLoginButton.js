import React from 'react';

const OmeroLoginButton = ({ onLoginSuccess }) => {
  const loginWithOmero = () => {
    const popup = window.open(
      'https://cerviai-omero.duckdns.org/webclient/login/?url=%2Fwebclient%2F', // Replace with your Omero login URL
      'Login with Omero',
      'width=500,height=600'
    );

    // Listen for a message from the popup (once login is successful)
    window.addEventListener('message', (event) => {
      // Ensure the event is from the expected origin
      if (event.origin !== 'https://omero-webclient-url') return; // Replace with actual origin

      const { csrfToken, cookies } = event.data; // Data sent from the Omero popup
      
      // Pass the token and cookies to the parent component or use them directly
      onLoginSuccess(csrfToken, cookies);

      // Close the popup once we have the data
      if (popup) popup.close();
    });
  };

  return <button onClick={loginWithOmero}>Login with Omero</button>;
};

export default OmeroLoginButton;
