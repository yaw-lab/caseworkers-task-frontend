// src/components/MessageDisplay.js
import React from 'react';
import './MessageDisplay.css'; 

const MessageDisplay = ({ errorMessage, successMessage }) => {
  if (errorMessage) {
    return <div className="message error-message">{errorMessage}</div>;
  }
  if (successMessage) {
    return <div className="message success-message">{successMessage}</div>;
  }
  return null;
};

export default MessageDisplay;

