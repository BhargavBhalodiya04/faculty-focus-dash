import React, { useState, useRef } from "react";

function UploadImage() {
  const [file, setFile] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [erNumber, setErNumber] = useState("");
  const [batchName, setBatchName] = useState("");
  const [bucketName, setBucketName] = useState("ict-attendance"); // default bucket
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // success or error message
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file first");
      setMessage(null);
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append("images", file); // match backend 'images' key
    formData.append("name", studentName); // match backend 'name' key
    formData.append("er_number", erNumber);
    formData.append("batch_name", batchName);
    formData.append("bucket_name", bucketName);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload-image", {
        method: "POST",
        body: formData,
        credentials: "include", // send cookies/session
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server did not return valid JSON");
      }

      if (res.ok) {
        setMessage("✅ Upload successful!");
        setError(null);
        console.log("Server response:", data);

        // Reset form fields and file input
        setFile(null);
        setStudentName("");
        setErNumber("");
        setBatchName("");
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      } else {
        setError("❌ Upload failed: " + (data.error || "Unknown error"));
        setMessage(null);
      }
    } catch (err) {
      setError("❌ Upload error: " + err.message);
      setMessage(null);
      console.error("Error uploading:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: 10,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#fff",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#333",
          fontWeight: "700",
          fontSize: "1.8rem",
        }}
      >
        Upload Student Image
      </h2>

      {[{
        placeholder: "Student Name",
        value: studentName,
        onChange: (e) => setStudentName(e.target.value),
        required: true,
        type: "text",
        key: "name"
      }, {
        placeholder: "ER Number",
        value: erNumber,
        onChange: (e) => setErNumber(e.target.value),
        required: true,
        type: "text",
        key: "er"
      }, {
        placeholder: "Batch Name",
        value: batchName,
        onChange: (e) => setBatchName(e.target.value),
        required: true,
        type: "text",
        key: "batch"
      }, {
        placeholder: "Bucket Name",
        value: bucketName,
        onChange: (e) => setBucketName(e.target.value),
        required: false,
        type: "text",
        key: "bucket"
      }].map(({ placeholder, value, onChange, required, type, key }) => (
        <input
          key={key}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            width: "100%",
            padding: "0.6rem 0.75rem",
            marginBottom: "1.2rem",
            borderRadius: 6,
            border: "1.5px solid #ccc",
            fontSize: "1rem",
            transition: "border-color 0.3s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#4a90e2")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
      ))}

      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
        required
        style={{
          marginBottom: "1.5rem",
          cursor: "pointer",
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.75rem",
          fontSize: "1.1rem",
          backgroundColor: loading ? "#7ea1d6" : "#4a90e2",
          color: "#fff",
          fontWeight: "600",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 3px 6px rgba(74, 144, 226, 0.6)",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={e => {
          if (!loading) e.currentTarget.style.backgroundColor = "#357ABD";
        }}
        onMouseLeave={e => {
          if (!loading) e.currentTarget.style.backgroundColor = "#4a90e2";
        }}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && (
        <p
          style={{
            color: "green",
            marginTop: "1rem",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}
      {error && (
        <p
          style={{
            color: "red",
            marginTop: "1rem",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}
    </form>
  );
}

export default UploadImage;
