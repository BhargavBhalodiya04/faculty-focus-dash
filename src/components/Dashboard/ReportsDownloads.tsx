import { useEffect, useState } from "react";
import { Download, Eye, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Report {
  id: string;
  fileName: string;
  size: string;
  records: number;
  status: string;
  batch: string;
  subject: string;
  date: string;
  url: string;
  students: string[];
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [totalReports, setTotalReports] = useState(0);
  const [totalSize, setTotalSize] = useState("0 KB");
  const [totalRecords, setTotalRecords] = useState(0);
  const [latest, setLatest] = useState("-");

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data: Report[]) => {
        setReports(data);

        // Total Reports
        setTotalReports(data.length);

        // Total Size
        const sizeInKB = data.reduce((acc, r) => {
          const val = parseFloat(r.size.replace("KB", "").trim());
          return acc + (isNaN(val) ? 0 : val);
        }, 0);
        setTotalSize(sizeInKB.toFixed(1) + " KB");

        // Total Records
        const recordsCount = data.reduce((acc, r) => acc + r.records, 0);
        setTotalRecords(recordsCount);

        // Latest Report Date
        if (data.length > 0) {
          const latestDate = new Date(
            Math.max(...data.map((r) => new Date(r.date).getTime()))
          );
          setLatest(latestDate.toLocaleString());
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <button
              onClick={() => window.history.back()}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors mb-2 text-left"
            >
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6" /> Reports & Downloads
            </h1>
          </div>
          <Button>Generate New Report</Button>
        </div>
        <p className="text-gray-500 mb-6">
          Download attendance reports and Excel files
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalReports}</p>
              <p className="text-sm text-gray-500">Available files</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Size</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalSize}</p>
              <p className="text-sm text-gray-500">Combined file size</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalRecords}</p>
              <p className="text-sm text-gray-500">Total attendance records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Latest</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{latest}</p>
              <p className="text-sm text-gray-500">Last generated</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <p className="text-gray-500 text-sm">
              Download or preview attendance reports
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : reports.length === 0 ? (
              <p className="text-gray-400">
                No reports found matching your criteria.
              </p>
            ) : (
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
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.fileName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.batch}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{report.subject}</Badge>
                      </TableCell>

                      <TableCell>
                        {new Date(report.date).toLocaleString()}
                      </TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell>
                        {report.records > 0 ? (
                          report.records
                        ) : (
                          <span className="text-gray-400">No records</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge>{report.status}</Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={report.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-4 h-4 mr-1" /> Preview
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={report.url} download>
                            <Download className="w-4 h-4 mr-1" /> Download
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
