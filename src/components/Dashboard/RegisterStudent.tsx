import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload } from "lucide-react";

// Configure your Flask backend URL here
const FLASK_BACKEND_URL = "http://127.0.0.1:5000"; // Change this to your Flask server URL

const RegisterStudent = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    student_name: '',
    er_number: '',
    batch_name: '',
    bucket_name: 'ict-attendance' // Your S3 bucket name
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (images only)
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an image file to upload",
        variant: "destructive"
      });
      return;
    }

    if (!formData.student_name || !formData.er_number || !formData.batch_name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData to send to your Flask backend
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);
      uploadData.append('student_name', formData.student_name);
      uploadData.append('er_number', formData.er_number);
      uploadData.append('batch_name', formData.batch_name);
      uploadData.append('bucket_name', formData.bucket_name);

      // Call your Flask backend API
      const response = await fetch(`${FLASK_BACKEND_URL}/action/upload`, {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Student Registered Successfully",
          description: result.message || "Student image uploaded to AWS S3",
        });
        
        // Reset form
        setFormData({
          student_name: '',
          er_number: '',
          batch_name: '',
          bucket_name: 'ict-attendance'
        });
        setSelectedFile(null);
        
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to connect to backend server. Make sure your Flask server is running.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Register New Student
          </CardTitle>
          <CardDescription>
            Upload student image to AWS S3 using your Python Flask backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Name */}
            <div className="space-y-2">
              <Label htmlFor="student_name">Student Name *</Label>
              <Input
                id="student_name"
                type="text"
                value={formData.student_name}
                onChange={(e) => handleInputChange('student_name', e.target.value)}
                placeholder="Enter student full name"
                required
              />
            </div>

            {/* ER Number */}
            <div className="space-y-2">
              <Label htmlFor="er_number">ER Number *</Label>
              <Input
                id="er_number"
                type="text"
                value={formData.er_number}
                onChange={(e) => handleInputChange('er_number', e.target.value)}
                placeholder="Enter student ER number"
                required
              />
            </div>

            {/* Batch Name */}
            <div className="space-y-2">
              <Label htmlFor="batch_name">Batch *</Label>
              <Select value={formData.batch_name} onValueChange={(value) => handleInputChange('batch_name', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2021-25">2021-25</SelectItem>
                  <SelectItem value="2022-26">2022-26</SelectItem>
                  <SelectItem value="2023-27">2023-27</SelectItem>
                  <SelectItem value="2024-28">2024-28</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* S3 Bucket Name */}
            <div className="space-y-2">
              <Label htmlFor="bucket_name">S3 Bucket Name</Label>
              <Input
                id="bucket_name"
                type="text"
                value={formData.bucket_name}
                onChange={(e) => handleInputChange('bucket_name', e.target.value)}
                placeholder="AWS S3 bucket name"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file-input">Student Image *</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                  required
                />
                {selectedFile && (
                  <span className="text-sm text-muted-foreground">
                    {selectedFile.name}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading to AWS S3...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Register Student
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Backend Configuration Info */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Backend Configuration</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>Flask Server URL:</strong> {FLASK_BACKEND_URL}</p>
          <p><strong>API Endpoint:</strong> /action/upload</p>
          <p className="text-muted-foreground">
            Make sure your Flask server is running and CORS is enabled for this frontend.
          </p>
          <p className="text-muted-foreground">
            Update the FLASK_BACKEND_URL constant in this component to match your server.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterStudent;