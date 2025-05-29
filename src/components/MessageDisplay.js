// src/components/MessageDisplay.js
import React from 'react';
import './MessageDisplay.css'; // You'll need to create this CSS file

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

// src/components/MessageDisplay.css
/*
.message {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  font-weight: bold;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
*/