// src/components/CaseForm.js
import React, { useState } from 'react';
import './CaseForm.css'; // You'll need to create this CSS file

const CaseForm = ({ onSubmit }) => {
  const [newCase, setNewCase] = useState({
    title: '',
    caseNumber: '',
    description: '',
    status: 'OPEN',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newCase);
    setNewCase({ title: '', caseNumber: '', description: '', status: 'OPEN' }); // Clear form
  };

  return (
    <div className="case-form-container">
      <h3>Add New Case</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={newCase.title}
          onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Case Number"
          value={newCase.caseNumber}
          onChange={(e) => setNewCase({ ...newCase, caseNumber: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newCase.description}
          onChange={(e) =>
            setNewCase({ ...newCase, description: e.target.value })
          }
        />
        <select
          value={newCase.status}
          onChange={(e) => setNewCase({ ...newCase, status: e.target.value })}
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="CLOSED">CLOSED</option>
        </select>
        <button type="submit">Add Case</button>
      </form>
    </div>
  );
};

export default CaseForm;