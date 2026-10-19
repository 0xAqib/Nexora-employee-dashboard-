# Nexora — Employee Management Dashboard

A modern and responsive Employee Management Dashboard built with React and Vite. Nexora provides an organized interface for viewing and managing employee records.

## Features

- Dashboard overview with employee statistics
- View and manage employee records
- Add, edit, and delete employees
- Search employees by name or email
- Filter employees by department
- Department overview
- Light and dark mode
- Form validation for employee details
- Persistent employee data using browser localStorage
- Responsive layout for desktop, tablet, and mobile screens
- Navigation using React Router
- Shared employee state using React Context API

## Technologies Used

- React
- Vite
- JavaScript
- CSS
- React Router
- React Context API
- Browser localStorage
- ESLint

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

### Installation

1. Clone this repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Open the project folder:

   ```bash
   cd nexora-employee-dashboard
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

## Project Structure

```text
employee-dashboard/
├── public/
├── src/
│   ├── assets/
│   ├── context/
│   │   └── EmployeeContext.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── employees.js
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Data Storage

Employee records are stored in the browser's localStorage. Data persists in the same browser until it is cleared. This project does not require a backend database.

## Future Enhancements

- Backend database integration
- User authentication and role-based access
- Employee profile photos
- Export employee records to CSV or PDF

## Author

**Aqib Ali**

GitHub: https://github.com/0xaqib

## License

This project was developed for learning and educational purposes.
