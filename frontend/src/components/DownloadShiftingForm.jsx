import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

const DownloadShiftingForm = () => {
    const { id } = useParams(); // Fetch ID from URL
    const [formData, setFormData] = useState({});
    const [studentData, setStudentData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const printRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/get-shifteeForm/${id}`);
                setFormData(response.data);
                setLoading(false);

                const response1 = await axios.get(`http://localhost:8080/get-shiftee/${id}`);
                setStudentData(response1.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching form data:", error);
                setError("Error fetching form data.");
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handlePrint = useReactToPrint({
        contentRef: printRef, // Use contentRef instead of content
        documentTitle: "form-details",
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Form Details</h2>
            <div ref={printRef} style={{ border: "1px solid #ccc", padding: "20px" }}>
                <p>I wish to ask permission to shift to {studentData.ProgramID === 1 ? "BS COMPUTER SCIENCE" : studentData.ProgramID === 2 ? "BS INFORMATION TECHNOLOGY" : "Unknown"} program 
                    from {studentData.PrevProgram} during the {studentData.Semester === "First Semester" ? "1st" : studentData.Semester === "Second Semester" ? "2nd" : "Unknown"} of AY {formData.AcadYear} due to the following reasons: </p>
                <p>{formData.Reasons}</p>

                <p>Date: {new Date(formData.Date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <button
                onClick={handlePrint}
                style={{ marginTop: "20px", color: "black" }}
            >
                Download / Print
            </button>
        </div>
    );
};

export default DownloadShiftingForm;
