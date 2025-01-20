import axios from 'axios';

function logoutFunction(navigate) {
    const backendUrl = 'https://group4-enrollment-system-server.onrender.com';
    axios
        .post(`${backendUrl}/logoutFunction`, {}, { withCredentials: true })
        .then((response) => {
            console.log(response.data.message);
            // Clear local storage and redirect
            localStorage.removeItem('authToken');
            navigate('/LoginPage');
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
}

export default logoutFunction;
