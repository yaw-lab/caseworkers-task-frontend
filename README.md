
# Caseworkers Task Frontend 

This project is the frontend application for the Caseworkers Task Management system, bootstrapped with Create React App.

# Connecting to the Backend 
This frontend application is designed to communicate with a separate [Spring Boot backend service ](https://github.com/yaw-lab/caseworkers-task-frontend). For the frontend to function correctly, the backend service must be running and accessible.

The frontend expects the backend API to be available at `http://localhost:8080`. If your backend is running on a different host or port, you'll need to update the `baseURL` in your src/api/caseService.js (or similar API configuration file).

# To start the backend (if you haven't already):

Navigate to your backend project directory. Run the backend application (e.g., via Maven: `mvn spring-boot:run` or by running the main class). Available Scripts In the project directory, you can run:

### `cd frontend `
Navigate into the frontend project directory. This step is crucial before running any npm commands for the frontend.

### `npm install` 
### `npm start` 
Runs the app in the development mode. Open [localhost](http://localhost:3000) to view it in your browser.

The page will reload when you make changes. You may also see any lint errors in the console.

### `npm test` 
Launches the test runner in the interactive watch mode. See the section about running tests for more information.

### `npm run build` 
Builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. Your app is ready to be deployed!

See the section about `deployment `  for more information.

### `npm run eject`
Note: This is a one-way operation. Once you eject, you can't go back!