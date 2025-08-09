import { useState } from "react";
import { Download, FileSpreadsheet, Calendar, Filter, Eye } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// Mock data for attendance reports
const attendanceReports = [
  {
    id: "1",
    fileName: "Attendance_2024_Jan_2021-2024.xlsx",
    batch: "2021-2024",
    subject: "Mathematics",
    date: "2024-01-15",
    size: "2.5 MB",
    records: 450,
    status: "ready"
  },
  {
    id: "2", 
    fileName: "Attendance_2024_Jan_2022-2025.xlsx",
    batch: "2022-2025", 
    subject: "Physics",
    date: "2024-01-14",
    size: "1.8 MB",
    records: 380,
    status: "ready"
  },
  {
    id: "3",
    fileName: "Attendance_2024_Dec_2021-2024.xlsx",
    batch: "2021-2024",
    subject: "Chemistry", 
    date: "2024-01-10",
    size: "3.1 MB",
    records: 520,
    status: "ready"
  },
  {
    id: "4",
    fileName: "Attendance_2024_Jan_2020-2023.xlsx",
    batch: "2020-2023",
    subject: "Computer Science",
    date: "2024-01-08",
    size: "2.8 MB", 
    records: 480,
    status: "generating"
  }
];

export const ReportsDownloads = () => {
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = attendanceReports.filter(report => {
    const matchesBatch = selectedBatch === "all" || report.batch === selectedBatch;
    const matchesSubject = selectedSubject === "all" || report.subject === selectedSubject;
    const matchesSearch = report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBatch && matchesSubject && matchesSearch;
  });

  const batches = [...new Set(attendanceReports.map(report => report.batch))];
  const subjects = [...new Set(attendanceReports.map(report => report.subject))];

  const handleDownload = (fileName: string) => {
    // Mock download functionality
    console.log(`Downloading ${fileName}`);
    // In real implementation, this would trigger the actual download
  };

  const handlePreview = (fileName: string) => {
    // Mock preview functionality
    console.log(`Previewing ${fileName}`);
  };

  const handleGenerateReport = () => {
    // Mock report generation
    console.log("Generating new report...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Downloads</h2>
          <p className="text-sm text-muted-foreground">Download attendance reports and Excel files</p>
        </div>
        <Button onClick={handleGenerateReport} className="gradient-primary">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceReports.length}</div>
            <p className="text-xs text-muted-foreground">Available files</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10.2 MB</div>
            <p className="text-xs text-muted-foreground">Combined file size</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,830</div>
            <p className="text-xs text-muted-foreground">Total attendance records</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">Last generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {batches.map(batch => (
              <SelectItem key={batch} value={batch}>{batch}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reports Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Download or preview attendance reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.fileName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{report.batch}</Badge>
                  </TableCell>
                  <TableCell>{report.subject}</TableCell>
                  <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                  <TableCell>{report.size}</TableCell>
                  <TableCell>{report.records.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === "ready" ? "default" : "secondary"}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(report.fileName)}
                        disabled={report.status !== "ready"}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(report.fileName)}
                        disabled={report.status !== "ready"}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No reports found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};