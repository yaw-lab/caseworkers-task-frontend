

import React, { useEffect, useState, useCallback } from 'react';
import {
  getCases,
  createCase,
  deleteCase,
  updateCaseStatus,
} from '../api/caseService';

import './caseList.css';


const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [newCase, setNewCase] = useState({
    title: '',
    caseNumber: '',
    description: '',
    status: 'OPEN',
  });
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [editCase, setEditCase] = useState({
    title: '',
    description: '',
    status: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  // Helper to display messages and clear them after a few seconds
  const showMessage = useCallback((msg, type = 'success') => {
    if (type === 'success') {
      setSuccessMessage(msg);
      setErrorMessage(''); // Clear any previous error
    } else {
      setErrorMessage(msg);
      setSuccessMessage(''); // Clear any previous success
    }
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 5000); // Clear message after 5 seconds
  }, []); // showMessage dependencies are stable state setters, so [] is fine here


  // NEW: Function to extract a concise message from the detailed backend error
  const getConciseErrorMessage = useCallback((fullMessage) => {
    if (!fullMessage) {
      return 'An unexpected error occurred.';
    }

    // Attempt to find specific database error patterns
    const duplicateKeyMatch = fullMessage.match(/ERROR: duplicate key value violates unique constraint "(.*?)"/);
    if (duplicateKeyMatch && duplicateKeyMatch[1]) {
      // Extract the constraint name if available, or just the general message
      const constraintDetailMatch = fullMessage.match(/Detail: Key \(case_number\)=\((.*?)\) already exists./);
      if (constraintDetailMatch && constraintDetailMatch[1]) {
        return `Case number '${constraintDetailMatch[1]}' already exists. Please use a unique one.`;
      }
      return `Duplicate entry detected. Please ensure all values are unique.`;
    }

    // Attempt to find a more general SQL error message
    const sqlErrorMatch = fullMessage.match(/ERROR: (.*?)(?=; SQL)/);
    if (sqlErrorMatch && sqlErrorMatch[1]) {
      return `Database error: ${sqlErrorMatch[1].trim()}`;
    }

    // Fallback if no specific pattern is matched
    return fullMessage.split(' [')[0]; // Take only the part before the first '['
  }, []);


  // Wrap fetchCases in useCallback
  const fetchCases = useCallback(async () => {
    try {
      const res = await getCases();
      setCases(res.data);
      setErrorMessage(''); // Clear error on successful fetch
    } catch (error) {
      console.error('Failed to fetch cases:', error);
      const backendMessage = error.response?.data?.message;
      const userMessage = backendMessage
        ? getConciseErrorMessage(backendMessage) // Use the new function
        : 'Failed to load cases. Please try again later.';
      showMessage(userMessage, 'error');
    }
  }, [showMessage, getConciseErrorMessage]); // Include getConciseErrorMessage here


  useEffect(() => {
    fetchCases();
  }, [fetchCases]);


  const handleDelete = async (id) => {
    try {
      await deleteCase(id);
      fetchCases(); // Refresh the list
      showMessage('Case deleted successfully!');
    } catch (error) {
      console.error('Failed to delete case:', error);
      const backendMessage = error.response?.data?.message;
      const userMessage = backendMessage
        ? getConciseErrorMessage(backendMessage) // Use the new function
        : 'Failed to delete case. It might not exist or an error occurred.';
      showMessage(userMessage, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCase(newCase);
      setNewCase({ title: '', caseNumber: '', description: '', status: 'OPEN' }); // Clear form
      fetchCases(); // Refresh the list
      showMessage('Case created successfully!');
    } catch (error) {
      console.error('Failed to create case:', error);
      const backendMessage = error.response?.data?.message;
      const userMessage = backendMessage
        ? getConciseErrorMessage(backendMessage) // Use the new function
        : 'Failed to create case. Please check your input.';
      showMessage(userMessage, 'error');
    }
  };

  const handleEditClick = (c) => {
    setEditingCaseId(c.id);
    setEditCase({
      title: c.title,
      description: c.description,
      status: c.status,
    });
    setErrorMessage(''); // Clear error when starting edit
    setSuccessMessage(''); // Clear success when starting edit
  };

  const handleUpdate = async (id) => {
    if (!editCase.status) {
      showMessage('Status cannot be empty for update.', 'error');
      return;
    }

    try {
      await updateCaseStatus(id, editCase);
      setEditingCaseId(null); // Exit editing mode
      setEditCase({ title: '', description: '', status: '' }); // Clear edit form
      fetchCases(); // Refresh the list
      showMessage('Case updated successfully!');
    } catch (error) {
      console.error('Failed to update case:', error);
      const backendMessage = error.response?.data?.message;
      const userMessage = backendMessage
        ? getConciseErrorMessage(backendMessage) 
        : 'Failed to update case. Please try again.';
      showMessage(userMessage, 'error');
    }
  };

  return (
    <div>
      <h2>Add New Case</h2>
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

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <h2>Case List</h2>
      <ul className="case-list">
        {cases.map((c) => (
          <li className="case-item" key={c.id}>
            {editingCaseId === c.id ? (
              <div>
                <input
                  type="text"
                  value={editCase.title}
                  onChange={(e) =>
                    setEditCase({ ...editCase, title: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editCase.description}
                  onChange={(e) =>
                    setEditCase({ ...editCase, description: e.target.value })
                  }
                />
                <select
                  value={editCase.status}
                  onChange={(e) =>
                    setEditCase({ ...editCase, status: e.target.value })
                  }
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
                <br />
                <button onClick={() => handleUpdate(c.id)}>Save</button>
                <button onClick={() => setEditingCaseId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h3>{c.title}</h3>
                <p><strong>Case Number:</strong> {c.caseNumber}</p>
                <p><strong>Status:</strong> {c.status}</p>
                <p><strong>Created Date:</strong> {new Date(c.createdDate).toLocaleDateString()} {new Date(c.createdDate).toLocaleTimeString()}</p>
                <p>{c.description}</p>
                <button onClick={() => handleEditClick(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaseList;