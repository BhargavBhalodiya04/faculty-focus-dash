import { useState } from "react";
import { BarChart3, TrendingUp, Users, BookOpen, Calendar } from "lucide-react";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";

// Mock data for class performance
const classData = [
  {
    subject: "Mathematics",
    batch: "2021-2024",
    avgAttendance: 92,
    totalClasses: 45,
    studentsEnrolled: 85,
    lastClassAttendance: 88,
    trend: "up",
    weeklyData: [
      { week: "Week 1", attendance: 85 },
      { week: "Week 2", attendance: 88 },
      { week: "Week 3", attendance: 92 },
      { week: "Week 4", attendance: 90 },
    ]
  },
  {
    subject: "Physics", 
    batch: "2021-2024",
    avgAttendance: 87,
    totalClasses: 42,
    studentsEnrolled: 82,
    lastClassAttendance: 85,
    trend: "down",
    weeklyData: [
      { week: "Week 1", attendance: 90 },
      { week: "Week 2", attendance: 88 },
      { week: "Week 3", attendance: 85 },
      { week: "Week 4", attendance: 87 },
    ]
  },
  {
    subject: "Chemistry",
    batch: "2021-2024", 
    avgAttendance: 89,
    totalClasses: 40,
    studentsEnrolled: 80,
    lastClassAttendance: 92,
    trend: "up",
    weeklyData: [
      { week: "Week 1", attendance: 82 },
      { week: "Week 2", attendance: 86 },
      { week: "Week 3", attendance: 89 },
      { week: "Week 4", attendance: 92 },
    ]
  },
  {
    subject: "Computer Science",
    batch: "2022-2025",
    avgAttendance: 95,
    totalClasses: 38,
    studentsEnrolled: 75,
    lastClassAttendance: 98,
    trend: "up",
    weeklyData: [
      { week: "Week 1", attendance: 92 },
      { week: "Week 2", attendance: 94 },
      { week: "Week 3", attendance: 96 },
      { week: "Week 4", attendance: 98 },
    ]
  }
];

const overallStats = [
  { month: "Sep", attendance: 85 },
  { month: "Oct", attendance: 88 },
  { month: "Nov", attendance: 91 },
  { month: "Dec", attendance: 89 },
  { month: "Jan", attendance: 93 },
];

export const ClassOverview = () => {
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const filteredClasses = classData.filter(classItem => {
    const matchesBatch = selectedBatch === "all" || classItem.batch === selectedBatch;
    const matchesSubject = selectedSubject === "all" || classItem.subject === selectedSubject;
    return matchesBatch && matchesSubject;
  });

  const batches = [...new Set(classData.map(item => item.batch))];
  const subjects = [...new Set(classData.map(item => item.subject))];

  const avgAttendanceAcrossAll = Math.round(
    filteredClasses.reduce((acc, item) => acc + item.avgAttendance, 0) / filteredClasses.length || 0
  );

  const totalStudents = filteredClasses.reduce((acc, item) => acc + item.studentsEnrolled, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Class Overview</h2>
          <p className="text-sm text-muted-foreground">Subject-wise attendance analysis and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {batches.map(batch => (
                <SelectItem key={batch} value={batch}>{batch}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{avgAttendanceAcrossAll}%</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="mr-1 h-3 w-3" />
              +3% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredClasses.length}</div>
            <p className="text-xs text-muted-foreground">Currently tracked</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performing</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {filteredClasses.length > 0 ? 
                filteredClasses.reduce((best, current) => 
                  current.avgAttendance > best.avgAttendance ? current : best
                ).subject.split(' ')[0] : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">Highest attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-wise Performance */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
            <CardDescription>Average attendance percentage by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredClasses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="subject" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgAttendance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overall Trend */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Overall Attendance Trend</CardTitle>
            <CardDescription>Monthly attendance across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={overallStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Individual Class Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClasses.map((classItem, index) => (
          <Card key={index} className="dashboard-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{classItem.subject}</CardTitle>
                <Badge variant={classItem.trend === "up" ? "default" : "secondary"}>
                  {classItem.batch}
                </Badge>
              </div>
              <CardDescription>
                {classItem.studentsEnrolled} students • {classItem.totalClasses} classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-primary">{classItem.avgAttendance}%</p>
                  <p className="text-xs text-muted-foreground">Average attendance</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{classItem.lastClassAttendance}%</p>
                  <p className="text-xs text-muted-foreground">Last class</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={classItem.weeklyData}>
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No classes found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};