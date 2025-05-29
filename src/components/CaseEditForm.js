// src/components/CaseEditForm.js
import React, { useState, useEffect } from 'react';
import './CaseEditForm.css'; // You'll need to create this CSS file

const CaseEditForm = ({ caseToEdit, onUpdate, onCancel, showMessage }) => {
  const [editCase, setEditCase] = useState({
    title: '',
    description: '',
    status: '',
    caseNumber: '', // Add caseNumber to edit form state to display it
  });

  // Populate form when caseToEdit changes
  useEffect(() => {
    if (caseToEdit) {
      setEditCase({
        title: caseToEdit.title,
        description: caseToEdit.description,
        status: caseToEdit.status,
        caseNumber: caseToEdit.caseNumber, // Set case number
      });
    }
  }, [caseToEdit]);

  const handleSave = () => {
    if (!editCase.status) {
      showMessage('Status cannot be empty for update.', 'error');
      return;
    }
    // Pass back the ID of the case being edited and the updated details
    onUpdate(caseToEdit.id, editCase);
  };

  return (
    <div className="case-edit-form-container">
      <h4>Editing Case: {editCase.caseNumber}</h4>
      <input
        type="text"
        value={editCase.title}
        onChange={(e) => setEditCase({ ...editCase, title: e.target.value })}
      />
      <input
        type="text"
        value={editCase.description}
        onChange={(e) => setEditCase({ ...editCase, description: e.target.value })}
      />
      <select
        value={editCase.status}
        onChange={(e) => setEditCase({ ...editCase, status: e.target.value })}
      >
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="CLOSED">CLOSED</option>
      </select>
      <br />
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default CaseEditForm;