import React, { useState } from "react";
import EditProjectInfo from "./EditProjectInfo"; // your form component
import { Dialog } from "@headlessui/react"; // modal library

interface EditProjectModalProps {
  projectId: number;
  departmentId: number;
  triggerLabel?: string; // optional button label
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  projectId,
  departmentId,
  triggerLabel = "Edit",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button onClick={openModal} className="btn-primary">
        {triggerLabel}
      </button>

      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg w-full max-w-lg p-6">
            <Dialog.Title>Edit Project Info</Dialog.Title>
            <EditProjectInfo projectId={projectId} departmentId={departmentId} onClose={closeModal} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default EditProjectModal;
