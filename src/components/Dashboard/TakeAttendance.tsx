import React, { useState } from "react";

interface AttendanceResponse {
  success: boolean;
  recognized_students?: string[];
  message?: string;
  error?: string;
}

const TakeAttendance: React.FC<{ onAttendanceComplete?: (students: string[]) => void }> = ({ onAttendanceComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [recognizedStudents, setRecognizedStudents] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);
    setRecognizedStudents([]);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://15.206.75.171:5000/take-attendance", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      const data: AttendanceResponse = JSON.parse(text);

      if (!response.ok || !data.success) {
        setError("❌ Attendance failed: " + (data.error || "Unknown error"));
      } else {
        const students = data.recognized_students ?? []; // ✅ always array
        setMessage(data.message || "✅ Attendance taken!");
        setRecognizedStudents(students);

        // send back to parent (Dashboard)
        if (onAttendanceComplete) {
          onAttendanceComplete(students);
        }
      }
    } catch (err: any) {
      setError("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2 style={{ textAlign: "center" }}>Take Attendance</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ✅ Show student names at bottom */}
      {recognizedStudents.length > 0 && (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "6px" }}>
          <h3>Recognized Students:</h3>
          <ul>
            {recognizedStudents.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TakeAttendance;
