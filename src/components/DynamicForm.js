import "./DynamicForm.css";
import React, { useState, useEffect } from "react";
import "./DynamicForm.css"; // Add a separate CSS file for styles

const DynamicForm = () => {
  const [formType, setFormType] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const mockApiResponse = {
    "User Information": {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    "Address Information": {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        { name: "state", type: "dropdown", label: "State", options: ["Maharashtra", "Tamil Nadu", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
], required: true },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    "Payment Information": {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
      ],
    },
  };

  useEffect(() => {
    if (formType) {
      const apiData = mockApiResponse[formType];
      setFormFields(apiData.fields);
      setFormData({});
      setProgress(0);
      setMessage("");
    }
  }, [formType]);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    const completedFields = formFields.filter(
      (field) => field.required && formData[field.name]
    ).length;
    const totalRequiredFields = formFields.filter((field) => field.required).length;
    setProgress((completedFields / totalRequiredFields) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = formFields
      .filter((field) => field.required && !formData[field.name])
      .map((field) => `${field.label} is required.`);

    if (errors.length > 0) {
      setMessage(errors.join(" "));
      return;
    }

    setSubmittedData((prevData) => [...prevData, formData]);
    setMessage("Form submitted successfully!");
    setFormData({});
    setProgress(100);
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setSubmittedData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleDelete = (index) => {
    setSubmittedData((prevData) => prevData.filter((_, i) => i !== index));
    setMessage("Entry deleted successfully.");
  };

  return (
    <div className="dynamic-form-container">
      <h1 className="header">Dynamic Form</h1>
      <div className="form-type-selector">
        <label htmlFor="formType">Select Form Type:</label>
        <select
          id="formType"
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="User Information">User Information</option>
          <option value="Address Information">Address Information</option>
          <option value="Payment Information">Payment Information</option>
        </select>
      </div>

      {formType && (
        <form className="dynamic-form" onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div className="form-field" key={field.name}>
              <label htmlFor={field.name}>{field.label}:</label>
              {field.type === "dropdown" ? (
                <select
                  id={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <button className="submit-btn" type="submit">
            Submit
          </button>
        </form>
      )}

      {message && <p className="feedback-message">{message}</p>}

      {submittedData.length > 0 && (
        <table className="submitted-data-table">
          <thead>
            <tr>
              {Object.keys(submittedData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                {Object.values(data).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DynamicForm;
