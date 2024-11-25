import axios from 'axios';

function logoutFunction(navigate) {
    axios
        .post('http://localhost:8080/logoutFunction', {}, { withCredentials: true })
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
