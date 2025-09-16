import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import axios from "axios";

interface Department {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

const RegisterPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    departmentId: "",
    roleId: "",
    employeeId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_NETWORK || import.meta.env.VITE_API_BASE_URL_LOCAL;

  // Fetch Departments & Roles
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/auth/departments`).then((res) => setDepartments(res.data));
    axios.get(`${API_BASE_URL}/api/auth/roles`).then((res) => setRoles(res.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name!]: value });
    setErrors({ ...errors, [name!]: "" }); // clear error on change
  };

  const validateForm = () => {
    const validationErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) validationErrors.firstName = "First Name is required";
    if (!formData.email.trim()) validationErrors.email = "Email is required";
    if (!formData.phone.trim()) validationErrors.phone = "Phone is required";
    if (!formData.employeeId.trim()) validationErrors.employeeId = "Employee ID is required";
    if (!formData.departmentId) validationErrors.departmentId = "Department is required";
    if (!formData.roleId) validationErrors.roleId = "Role is required";
    if (!formData.password) validationErrors.password = "Password is required";
    if (!formData.confirmPassword) validationErrors.confirmPassword = "Confirm Password is required";
    if (formData.password !== formData.confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match";

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setErrors({});
  try {
    await axios.post(`${API_BASE_URL}/api/auth/register`, {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      departmentId: Number(formData.departmentId),
      roleId: Number(formData.roleId),
      employeeId: formData.employeeId,
    });
    alert("User registered successfully!");
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      departmentId: "",
      roleId: "",
      employeeId: "",
    });
  } catch (error: any) {
  if (error.response?.status === 409) {
    const { field, message } = error.response.data;
    setErrors({ [field]: message });
  } else {
    alert("Something went wrong!");
  }
}

};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg space-y-4" noValidate>
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <TextField
          label="First Name"
          name="firstName"
          fullWidth
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          label="Middle Name"
          name="middleName"
          fullWidth
          value={formData.middleName}
          onChange={handleChange}
        />
        <TextField
          label="Last Name"
          name="lastName"
          fullWidth
          value={formData.lastName}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Phone"
          name="phone"
          fullWidth
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />
        <TextField
          label="Employee ID"
          name="employeeId"
          fullWidth
          value={formData.employeeId}
          onChange={handleChange}
          error={!!errors.employeeId}
          helperText={errors.employeeId}
        />

        <FormControl fullWidth error={!!errors.departmentId}>
          <InputLabel>Department</InputLabel>
          <Select name="departmentId" value={formData.departmentId} onChange={handleChange}>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
            ))}
          </Select>
          {errors.departmentId && <FormHelperText>{errors.departmentId}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth error={!!errors.roleId}>
          <InputLabel>Role</InputLabel>
          <Select name="roleId" value={formData.roleId} onChange={handleChange}>
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
            ))}
          </Select>
          {errors.roleId && <FormHelperText>{errors.roleId}</FormHelperText>}
        </FormControl>

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
