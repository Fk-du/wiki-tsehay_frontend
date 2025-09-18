// src/components/operation/OperationDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import OperationInfo from "./OperationInfo";

interface OperationResponse {
  id: number;
  name: string;
  description: string;
  vendor: string;
  status: string;
  sla: string;
  criticality: string;
  startDate: string;
  endDate: string;
  departmentName: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_NETWORK || import.meta.env.VITE_API_BASE_URL_LOCAL;


const OperationDetailsPage: React.FC = () => {
  const { departmentId, operationId } = useParams<{
    departmentId: string;
    operationId: string;
  }>();

  const [operation, setOperation] = useState<OperationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOperation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token ) return;


        const response = await axios.get<OperationResponse>(
          `${API_BASE_URL}/api/operations/3/3`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOperation(response.data);
      } catch (error) {
        console.error("Error fetching operation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (departmentId && operationId) {
      fetchOperation();
    }
  }, [departmentId, operationId]);

  if (loading) {
    return <p className="text-gray-600">Loading operation details...</p>;
  }

  if (!operation) {
    return <p className="text-red-600">Operation not found</p>;
  }

  return (
    <div className="p-6">
      <OperationInfo operation={operation} />
    </div>
  );
};

export default OperationDetailsPage;
