import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

const DownloadAdmissionForm = () => {
  const { id } = useParams(); // Fetch ID from URL
  const [formData, setFormData] = useState({
    StudentID: "",
    Branch: "",
    ApplyingFor: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/get-form/${id}`);
        setFormData(response.data);
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
  
  
  const handleClick = () => {
    console.log("Button clicked!");
    handlePrint();
  };
  
  return (
    <div>
      <h2>Form Details</h2>
      <div ref={printRef} style={{ border: "1px solid #ccc", padding: "20px" }}>
        <p><strong>Student ID:</strong> {formData.StudentID}</p>
        <p><strong>Branch:</strong> {formData.Branch}</p>
        <p><strong>Applying For:</strong> {formData.ApplyingFor}</p>
      </div>
      <button
        onClick={handleClick}
        style={{ marginTop: "20px", color: "black" }}
      >
        Download / Print
      </button>
    </div>
  );
  
};

export default DownloadAdmissionForm;
