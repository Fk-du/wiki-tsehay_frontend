import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
//   FormHelperText,
} from "@mui/material";
import axios from "axios";

interface User {
  id: number;
  department: number; // department ID
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateOperationPage: React.FC = () => {
  const userData = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const user: User | null = userData ? JSON.parse(userData) : null;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    vendor: "",
    status: "",
    sla: "",
    criticality: "",
    startDate: "",
    endDate: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      setError("User not logged in");
      return;
    }

    try {
      const requestBody = {
        ...formData,
        departmentId: user.department, // enforce user's department
      };

      await axios.post(`${API_BASE_URL}/operations`, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Operation created successfully");
      setError(null);
      setFormData({
        name: "",
        description: "",
        vendor: "",
        status: "",
        sla: "",
        criticality: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to create operation");
      setSuccess(null);
    }
  };

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardContent>
          <Typography variant="h5" className="mb-4 font-bold text-center">
            Create Operation
          </Typography>

          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Vendor"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              fullWidth
            />
           <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
                <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="RUNNING">Running</MenuItem>
                    <MenuItem value="STOPPED">Stopped</MenuItem>
                    <MenuItem value="FAILED">Failed</MenuItem>
                    <MenuItem value="PAUSED">Paused</MenuItem>
                    <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                </Select>
            </FormControl>

            <TextField
              label="SLA"
              name="sla"
              value={formData.sla}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Criticality"
              name="criticality"
              value={formData.criticality}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Department"
              value={user?.department}
              disabled
              fullWidth
            />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Operation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOperationPage;
