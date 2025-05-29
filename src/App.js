// src/App.js
import React from 'react';
import CaseManagementPage from './pages/CaseManagementPage'; // Corrected import path and component name
import './App.css'; // Optional: Add a general App.css for global styles

function App() {
  return (
    <div className="App"> {/* Added a class for potential global styling */}
      {/* The main heading is now within CaseManagementPage for better encapsulation
          so you can remove it from here if you prefer your current design.
          If you want a global app title, keep it, but adjust CaseManagementPage to avoid duplication. */}
      {/* <h1>Case Management App</h1> */}
      <CaseManagementPage />
    </div>
  );
}

export default App;