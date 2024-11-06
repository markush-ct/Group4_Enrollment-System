import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EnrollmentOfficerDashboard(){
    const navigate = useNavigate();
    const [accName, setAccName] = useState('');

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:8080')
            .then(res => {
                if (res.data.valid) {
                    setAccName(res.data.name);
                } else {
                    navigate('/LoginPage');
                }
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <>
            <h1>Hi {accName}</h1>
        </>
    );
}

export default EnrollmentOfficerDashboard;