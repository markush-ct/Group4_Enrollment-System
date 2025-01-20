import axios from 'axios';

function logoutFunction(navigate) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    axios
        .post(`https://group4-enrollment-system-server.onrender.com/logoutFunction`, {}, { withCredentials: true })
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
