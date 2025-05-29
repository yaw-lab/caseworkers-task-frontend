// src/components/__tests__/CaseForm.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // For simulating user typing
import '@testing-library/jest-dom';

import CaseForm from '../components/CaseForm';

describe('CaseForm', () => {
  test('renders all required input fields and a submit button', () => {
    render(<CaseForm onSubmit={() => {}} />);

    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/case number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Status select
    expect(screen.getByRole('button', { name: /add case/i })).toBeInTheDocument();
  });

  test('allows users to type into the input fields and select status', async () => {
    render(<CaseForm onSubmit={() => {}} />);
    const user = userEvent.setup(); // Initialize user-event

    const titleInput = screen.getByPlaceholderText(/title/i);
    const caseNumberInput = screen.getByPlaceholderText(/case number/i);
    const descriptionInput = screen.getByPlaceholderText(/description/i);
    const statusSelect = screen.getByRole('combobox');

    await user.type(titleInput, 'New Test Case Title');
    await user.type(caseNumberInput, 'T-001');
    await user.type(descriptionInput, 'This is a test description.');
    await user.selectOptions(statusSelect, 'IN_PROGRESS'); // Select 'IN_PROGRESS'

    expect(titleInput).toHaveValue('New Test Case Title');
    expect(caseNumberInput).toHaveValue('T-001');
    expect(descriptionInput).toHaveValue('This is a test description.');
    expect(statusSelect).toHaveValue('IN_PROGRESS');
  });

  test('calls onSubmit with the correct data and clears the form upon submission', async () => {
    const mockOnSubmit = jest.fn(); // Create a mock function
    render(<CaseForm onSubmit={mockOnSubmit} />);
    const user = userEvent.setup();

    const titleInput = screen.getByPlaceholderText(/title/i);
    const caseNumberInput = screen.getByPlaceholderText(/case number/i);
    const descriptionInput = screen.getByPlaceholderText(/description/i);
    const statusSelect = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /add case/i });

    // Fill the form
    await user.type(titleInput, 'Submitted Case');
    await user.type(caseNumberInput, 'SUB-007');
    await user.type(descriptionInput, 'Description for submission.');
    await user.selectOptions(statusSelect, 'CLOSED');

    // Submit the form
    await user.click(submitButton);

    // Assert that onSubmit was called exactly once
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    // Assert that onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Submitted Case',
      caseNumber: 'SUB-007',
      description: 'Description for submission.',
      status: 'CLOSED',
    });

    // Assert that the form fields are cleared after submission
    await waitFor(() => { // Use waitFor because state updates are async
      expect(titleInput).toHaveValue('');
      expect(caseNumberInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
      expect(statusSelect).toHaveValue('OPEN'); // Status resets to default 'OPEN'
    });
  });

  test('does not call onSubmit if required fields are empty (basic browser validation)', async () => {
    const mockOnSubmit = jest.fn();
    render(<CaseForm onSubmit={mockOnSubmit} />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /add case/i });

    // Try to submit without filling required fields
    await user.click(submitButton);

    // onSubmit should not have been called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});