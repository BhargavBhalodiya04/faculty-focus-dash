import { useState } from "react";
import { TrendingUp, TrendingDown, Calendar, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock data
const attendanceData = [
  { date: "2024-01-01", present: 85, absent: 15, total: 100 },
  { date: "2024-01-02", present: 92, absent: 8, total: 100 },
  { date: "2024-01-03", present: 78, absent: 22, total: 100 },
  { date: "2024-01-04", present: 88, absent: 12, total: 100 },
  { date: "2024-01-05", present: 95, absent: 5, total: 100 },
  { date: "2024-01-06", present: 82, absent: 18, total: 100 },
  { date: "2024-01-07", present: 90, absent: 10, total: 100 },
];

const studentAttendance = [
  { name: "John Doe", percentage: 95, present: 19, total: 20, trend: "up" },
  { name: "Jane Smith", percentage: 85, present: 17, total: 20, trend: "down" },
  { name: "Mike Johnson", percentage: 90, present: 18, total: 20, trend: "up" },
  { name: "Sarah Williams", percentage: 75, present: 15, total: 20, trend: "down" },
];

const subjectData = [
  { name: "Mathematics", value: 90, color: "#3b82f6" },
  { name: "Physics", value: 85, color: "#10b981" },
  { name: "Chemistry", value: 88, color: "#f59e0b" },
  { name: "Computer Science", value: 95, color: "#8b5cf6" },
];

export const AttendanceAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [selectedStudent, setSelectedStudent] = useState("all");

  const overallAttendance = Math.round(
    attendanceData.reduce((acc, day) => acc + (day.present / day.total) * 100, 0) / attendanceData.length
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Attendance Analytics</h2>
          <p className="text-sm text-muted-foreground">Track and analyze student attendance patterns</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">Semester</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{overallAttendance}%</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="mr-1 h-3 w-3" />
              +2.5% from last week
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Daily</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">Students present</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+5.2%</div>
            <p className="text-xs text-muted-foreground">vs last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Attendance Trend */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Daily Attendance Trend</CardTitle>
            <CardDescription>Student presence over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value, name) => [value, name === 'present' ? 'Present' : 'Absent']}
                />
                <Line type="monotone" dataKey="present" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="absent" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject-wise Attendance */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
            <CardDescription>Attendance percentage by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {subjectData.map((subject, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }}></div>
                  <span className="text-xs text-muted-foreground">{subject.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Performance Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Individual Student Performance</CardTitle>
          <CardDescription>Detailed attendance statistics per student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentAttendance.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{student.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.present}/{student.total} classes attended</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={student.percentage >= 85 ? "default" : student.percentage >= 75 ? "secondary" : "destructive"}>
                    {student.percentage}%
                  </Badge>
                  {student.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};