import { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export const AttendanceAnalytics = () => {
  const [data, setData] = useState({
    students: [],
    daily_trend_data: [],
    subject_pie_chart: ""
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/dashboard");
        const json = await res.json();

        setData({
          students: json.students || [],
          daily_trend_data: json.daily_trend_data || [],
          subject_pie_chart: json.subject_pie_chart
        });
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = data.students.filter((student) =>
    (student.name?.toString() || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.er_number?.toString() || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-600 animate-pulse">Loading attendance data...</p>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Charts Section */}
        <section className="grid md:grid-cols-2 gap-10">

          {/* Daily Attendance Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
              📊 Daily Attendance Trend
            </h2>
            {data.daily_trend_data.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={data.daily_trend_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: '#4B5563' }} />
                  <YAxis unit=" students" tick={{ fill: '#4B5563' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="attendance" barSize={40} fill="#4F46E5" />
                  <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No trend data available.</p>
            )}
          </div>

          {/* Subject-wise Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 text-center">
              📚 Subject-wise Attendance Distribution
            </h2>
            {data.subject_pie_chart ? (
              <img
                src={`data:image/png;base64,${data.subject_pie_chart}`}
                alt="Subject Attendance Pie Chart"
                className="w-full max-w-md h-auto rounded-lg shadow-md border"
              />
            ) : (
              <p className="text-gray-500 text-center">No chart data available.</p>
            )}
            <p className="mt-4 text-gray-600 text-center text-sm">
              Distribution of attendance percentage per subject
            </p>
          </div>

        </section>

        {/* Combined Student Attendance Section */}
        <section className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
            📋 Student Attendance Overview
          </h2>

          {/* Search Filter Moved Here */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by Student Name or ER Number..."
              className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Attendance Table */}
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-gray-700">
                <thead>
                  <tr className="bg-indigo-100 text-indigo-800">
                    <th className="px-6 py-3 text-left font-semibold">Student Name</th>
                    <th className="px-6 py-3 text-left font-semibold">Classes Attended</th>
                    <th className="px-6 py-3 text-left font-semibold">Total Classes</th>
                    <th className="px-6 py-3 text-left font-semibold">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.er_number} className="odd:bg-gray-50 even:bg-gray-100 hover:bg-indigo-50 transition">
                      <td className="px-6 py-4 font-medium">{student.name}</td>
                      <td className="px-6 py-4">{student.present_count}</td>
                      <td className="px-6 py-4">{student.total_classes}</td>
                      <td className="px-6 py-4 text-indigo-600 font-semibold">
                        {student.attendance_percentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No attendance data found.</p>
          )}
        </section>
      </div>
    </div>
  );
};
