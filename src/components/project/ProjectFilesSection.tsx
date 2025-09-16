import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectFileResponse {
  id: number;
  fileName: string;
  fileType: string;
  uploadDate: string;
}

interface ProjectFilesSectionProps {
  projectId: number;
}

const ProjectFilesSection: React.FC<ProjectFilesSectionProps> = ({ projectId }) => {
  const [files, setFiles] = useState<ProjectFileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_NETWORK || import.meta.env.VITE_API_BASE_URL_LOCAL;
  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get<ProjectFileResponse[]>(
        `${API_BASE_URL}/api/files/project/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFiles(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(`${API_BASE_URL}/api/files/upload/${projectId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSelectedFile(null);
      fetchFiles(); // Refresh list
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Upload failed");
    }
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/files/download/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Download failed");
    }
  };

  const handleView = async (fileId: number) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/files/view/${fileId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    // Detect content type from backend
    const fileURL = URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }));
    window.open(fileURL, "_blank");
  } catch (err: any) {
    console.error(err);
    setError(err.response?.data?.message || err.message || "View failed");
  }
};


  const handleDelete = async (fileId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(files.filter((f) => f.id !== fileId));
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  if (loading) return <p className="text-gray-500">Loading project files...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input type="file" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </Button>
      </div>

      {files.length === 0 && <p className="text-gray-500">No files uploaded yet.</p>}

      {files.map((file) => (
        <Card key={file.id}>
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{file.fileName}</p>
              <p className="text-sm text-gray-500">
                Type: {file.fileType} | Uploaded:{" "}
                {new Date(file.uploadDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleDownload(file.id, file.fileName)}>Download</Button>
              <Button onClick={() => handleView(file.id)}>View</Button>
              <Button variant="destructive" onClick={() => handleDelete(file.id)}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectFilesSection;
