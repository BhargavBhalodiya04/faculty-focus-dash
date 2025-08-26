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
  userFriendlyName: string;
  size: string;
  records: number;
  status: string;
  batch: string;       // used as Class in UI
  subject: string;
  section?: string;    // <-- made optional; we fill it if backend doesn't send
  date: string;        // ISO or parsable string
  url: string;
  students: string[];
}

function parseFromFileName(fileName: string) {
  if (!fileName) return {} as {
    className?: string;
    subject?: string;
    section?: string;
    date?: string;
  };

  const base = fileName.replace(/\.xlsx$/i, "");

  // Pattern 1: YYYYMMDD_Class_Section_Subject
  let m = base.match(/^(\d{8})_([^_]+)_([^_]+)_([^_]+)$/);
  if (m) {
    const [, yyyymmdd, className, section, subject] = m;
    const date = `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6)}`; // YYYY-MM-DD
    return { className, subject, section, date };
  }

  // Pattern 2: Class_Subject_Section_DD-MM-YYYY
  m = base.match(/^([^_]+)_([^_]+)_([^_]+)_(\d{2}-\d{2}-\d{4})$/);
  if (m) {
    const [, className, subject, section, ddmmyyyy] = m;
    const [dd, mm, yyyy] = ddmmyyyy.split("-");
    const date = `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD
    return { className, subject, section, date };
  }

  return {} as {
    className?: string;
    subject?: string;
    section?: string;
    date?: string;
  };
}

  export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    // Stats
    const [totalReports, setTotalReports] = useState(0);
    const [totalSize, setTotalSize] = useState("0 KB");
    const [totalRecords, setTotalRecords] = useState(0);
    const [latest, setLatest] = useState("-");

    // 🔍 Filter state
    const [search, setSearch] = useState("");


    useEffect(() => {
      fetch("http://15.206.75.171:5000/api/reports")
        .then((res) => res.json())
        .then((data: Report[]) => {
          // Normalize: if backend didn't send class/subject/section/date, derive from fileName
          const normalized = data.map((r) => {
            const meta = parseFromFileName(r.userFriendlyName || r.fileName || "");
            return {
              ...r,
              batch: meta.className || r.batch || "-",
              subject: meta.subject || r.subject || "-",
              section: meta.section || r.section || "-",
              date: meta.date || r.date || "-",
            } as Report;
          });


          setReports(normalized);

          // Total Reports
          setTotalReports(normalized.length);

          // Total Size
          const sizeInKB = normalized.reduce((acc, r) => {
            const val = parseFloat(String(r.size).replace(/KB/i, "").trim());
            return acc + (isNaN(val) ? 0 : val);
          }, 0);
          setTotalSize(sizeInKB.toFixed(1) + " KB");

          // Total Records
          const recordsCount = normalized.reduce((acc, r) => acc + (Number(r.records) || 0), 0);
          setTotalRecords(recordsCount);

          // Latest Report Date
          if (normalized.length > 0) {
            const latestDate = new Date(
              Math.max(
                ...normalized.map((r) => new Date(r.date || 0).getTime())
              )
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
              {/* 🔍 Filter Input */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Filter by batch, subject, division, or date..."
                  className="w-full md:w-1/3 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
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
                      <TableHead>Batch Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {reports
                      .filter((r) =>
                        [r.batch, r.subject, r.section, r.date]
                          .join(" ")
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      )
                      .map((report) => (
                        <TableRow key={report.id}>
                          {/* Batch Name */}
                          <TableCell className="text-lg">
                            {report.batch || "-"}
                          </TableCell>

                          {/* Subject */}
                          <TableCell className="text-lg">
                            {report.subject || "-"}
                          </TableCell>

                          {/* Division */}
                          <TableCell className="text-lg">
                            {report.section || "-"}
                          </TableCell>

                          {/* Date */}
                          <TableCell className="text-lg">
                            {report.date
                              ? new Date(report.date).toLocaleDateString()
                              : "-"}
                          </TableCell>

                          {/* Actions */}
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
