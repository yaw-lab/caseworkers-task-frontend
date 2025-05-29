// src/pages/CaseManagementPage.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  getCases,
  createCase,
  deleteCase,
  updateCaseStatus,
} from '../api/caseService'; // Assuming caseService is in src/api

import CaseForm from '../components/CaseForm';
import CaseItem from '../components/CaseItem';
import MessageDisplay from '../components/MessageDisplay';

import './CaseManagementPage.css'; // Rename your existing caseList.css or create new

const CaseManagementPage = () => {
  const [cases, setCases] = useState([]);
  const [editingCaseId, setEditingCaseId] = useState(null);
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
  }, []);


  // Function to extract a concise message from the detailed backend error
  const getConciseErrorMessage = useCallback((fullMessage) => {
    if (!fullMessage) {
      return 'An unexpected error occurred.';
    }

    // Attempt to find specific database error patterns
    const duplicateKeyMatch = fullMessage.match(/ERROR: duplicate key value violates unique constraint "(.*?)"/);
    if (duplicateKeyMatch && duplicateKeyMatch[1]) {
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


  const fetchCases = useCallback(async () => {
    try {
      const res = await getCases();
      setCases(res.data);
      setErrorMessage(''); // Clear error on successful fetch
    } catch (error) {
      console.error('Failed to fetch cases:', error);
      const backendMessage = error.response?.data?.message;
      const userMessage = backendMessage
        ? getConciseErrorMessage(backendMessage)
        : 'Failed to load cases. Please try again later.';
      showMessage(userMessage, 'error');
    }
  }, [showMessage, getConciseErrorMessage]);


  useEffect(() => {
    fetchCases();
  }, [fetchCases]);


  // Handlers for the main component to pass down
  const handleDelete = async (id) => {
    try {
      await deleteCase(id);
      fetchCases();
      showMessage('Case deleted successfully!');
    } catch (error) {
      console.error('Failed to delete case:', error);
      const backendMessage = error.response?.data?.message;
      const userMessage = backendMessage
        ? getConciseErrorMessage(backendMessage)
        : 'Failed to delete case. It might not exist or an error occurred.';
      showMessage(userMessage, 'error');
    }
  };

  const handleCreateCase = async (newCaseData) => { // Renamed for clarity
    try {
      await createCase(newCaseData);
      fetchCases();
      showMessage('Case created successfully!');
    } catch (error) {
      console.error('Failed to create case:', error);
      const backendMessage = error.response?.data?.message;
      const userMessage = backendMessage
        ? getConciseErrorMessage(backendMessage)
        : 'Failed to create case. Please check your input.';
      showMessage(userMessage, 'error');
    }
  };

  const handleEditClick = useCallback((c) => { // useCallback for stability
    setEditingCaseId(c.id);
    setErrorMessage(''); // Clear error when starting edit
    setSuccessMessage(''); // Clear success when starting edit
  }, []);

  const handleUpdateCase = async (id, updatedDetails) => { // Renamed for clarity
    try {
      await updateCaseStatus(id, updatedDetails);
      setEditingCaseId(null);
      fetchCases();
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

  const handleCancelEdit = useCallback(() => { // useCallback for stability
    setEditingCaseId(null);
  }, []);

  return (
    <div className="case-management-container">
      <h1>Case Management System</h1>

      <MessageDisplay errorMessage={errorMessage} successMessage={successMessage} />

      <CaseForm onSubmit={handleCreateCase} />

      <h2>All Cases</h2>
      <ul className="case-list">
        {cases.map((c) => (
          <CaseItem
            key={c.id}
            c={c}
            onDelete={handleDelete}
            onEditClick={handleEditClick}
            editingCaseId={editingCaseId}
            onUpdate={handleUpdateCase}
            onCancelEdit={handleCancelEdit}
            showMessage={showMessage} // Pass showMessage down to CaseItem (and then CaseEditForm)
          />
        ))}
      </ul>
    </div>
  );
};

export default CaseManagementPage;