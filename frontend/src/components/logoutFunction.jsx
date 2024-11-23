import axios from 'axios';

function logoutFunction(navigate) {

    axios
        .post('http://localhost:8080/logoutFunction', {}, { withCredentials: true })
        .then((response) => {
            console.log(response.data.message);
            // Clear cookies
            localStorage.removeItem('authToken');
            // Redirect to the login page
            navigate('/LoginPage');
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
}

export default logoutFunction;
