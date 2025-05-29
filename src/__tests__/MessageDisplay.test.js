// src/components/__tests__/MessageDisplay.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended matchers like .toBeInTheDocument()


import MessageDisplay from '../components/MessageDisplay';

describe('MessageDisplay', () => {
  test('does not render any message when no props are provided', () => {
    render(<MessageDisplay />);
    // Assert that neither error nor success messages are in the document
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/success/i)).not.toBeInTheDocument();
  });

  test('renders success message when successMessage prop is provided', () => {
    const successMsg = 'Operation successful!';
    render(<MessageDisplay successMessage={successMsg} />);

    // Assert that the success message is displayed
    const successElement = screen.getByText(successMsg);
    expect(successElement).toBeInTheDocument();
    expect(successElement).toHaveClass('success-message'); // Check for CSS class
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument(); // Ensure error isn't there
  });

  test('renders error message when errorMessage prop is provided', () => {
    const errorMsg = 'Something went wrong!';
    render(<MessageDisplay errorMessage={errorMsg} />);

    // Assert that the error message is displayed
    const errorElement = screen.getByText(errorMsg);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('error-message'); // Check for CSS class
    expect(screen.queryByText(/success/i)).not.toBeInTheDocument(); // Ensure success isn't there
  });

  test('renders only error message if both success and error messages are provided (error takes precedence)', () => {
    const successMsg = 'This should not appear';
    const errorMsg = 'Only this error should appear';
    render(<MessageDisplay successMessage={successMsg} errorMessage={errorMsg} />);

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
    expect(screen.queryByText(successMsg)).not.toBeInTheDocument();
  });
});