import React from "react";

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

interface OperationInfoProps {
  operation: OperationResponse;
}

const OperationInfo: React.FC<OperationInfoProps> = ({ operation }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{operation.name}</h2>
      <p className="text-gray-700 mb-2">{operation.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <p><strong>Vendor:</strong> {operation.vendor}</p>
        <p><strong>Status:</strong> {operation.status}</p>
        <p><strong>SLA:</strong> {operation.sla}</p>
        <p><strong>Criticality:</strong> {operation.criticality}</p>
        <p><strong>Start Date:</strong> {operation.startDate}</p>
        <p><strong>End Date:</strong> {operation.endDate}</p>
        <p><strong>Department:</strong> {operation.departmentName}</p>
      </div>
    </div>
  );
};

export default OperationInfo;
