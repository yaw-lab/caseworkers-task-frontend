// src/components/CaseItem.js
import React from 'react';
import CaseEditForm from './CaseEditForm'; 
import './CaseItem.css'; 

const CaseItem = ({ c, onEditClick, onDelete, editingCaseId, onUpdate, onCancelEdit, showMessage }) => {
  const isEditing = editingCaseId === c.id;

  return (
    <li className="case-item">
      {isEditing ? (
        <CaseEditForm
          caseToEdit={c}
          onUpdate={onUpdate}
          onCancel={onCancelEdit}
          showMessage={showMessage} // Pass showMessage down to edit form
        />
      ) : (
        <div>
          <h3>{c.title}</h3>
          <p><strong>Case Number:</strong> {c.caseNumber}</p>
          <p><strong>Status:</strong> {c.status}</p>
          <p><strong>Created Date:</strong> {new Date(c.createdDate).toLocaleDateString()} {new Date(c.createdDate).toLocaleTimeString()}</p>
          <p>{c.description}</p>
          <button onClick={() => onEditClick(c)}>Edit</button>
          <button onClick={() => onDelete(c.id)}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default CaseItem;