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
        margin: "auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>Upload Student Image</h2>

      <input
        type="text"
        placeholder="Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        required
      />
      <br />

      <input
        type="text"
        placeholder="ER Number"
        value={erNumber}
        onChange={(e) => setErNumber(e.target.value)}
        required
      />
      <br />

      <input
        type="text"
        placeholder="Batch Name"
        value={batchName}
        onChange={(e) => setBatchName(e.target.value)}
        required
      />
      <br />

      <input
        type="text"
        placeholder="Bucket Name"
        value={bucketName}
        onChange={(e) => setBucketName(e.target.value)}
      />
      <br />

      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
        required
      />
      <br />

      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <p style={{ color: "green", marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </form>
  );
}

export default UploadImage;
