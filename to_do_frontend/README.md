# Frontend ToDo-project

A web application built with React and TypeScript that allows users to manage their tasks efficiently. With advanced filtering, sorting, pagination, and real-time metrics.

## Tech Stack

- **Node 21**
- **React** + **TypeScript**
- **Vite** – Fast build tool and development server
- **Material UI (MUI)** – UI components library
  - Includes **Data Grid Pro** (for testing only, not for production)
- **Redux Toolkit** – Global state management
- **Axios** - HTTP client for API communication
- **Vitest** – Unit testing framework
- **Custom styling** – Tailored UI components and styles using **Tailwind**

## Features

- Create, edit, and delete tasks
- Filter tasks by:
  - Task name (partial match)
  - Priority
  - Status (done / undone)
- Sort tasks by:
  - Due date
  - Priority
  - (Both only available with MUI Pro)
- Pagination to navigate large lists
- Mark all tasks on a page as done or undone, or toggle individual tasks
- Footer with real-time metrics:
  - Average resolution time per priority
  - Overall average time

## Project Structure

```bash
/src
  ├── api         # Axios instance and API request functions
  ├── assets      # Static files (images, icons, etc.)
  ├── components  # Reusable UI components
  ├── helpers     # Utility and formatting functions
  ├── hooks       # Custom React hooks
  ├── store       # Redux Toolkit slices and store setup
  ├── tests       # Unit and integration tests
  └── types       # TypeScript type definitions
```

## Feedback & Validation

The app provides real-time feedback to the user:

- Success messages when tasks are added or updated
- Error messages when required fields are missing

## How to Run

1. Make sure you have **Node 21** installed.
2. Navigate to the frontend project directory.
3. Install dependencies and start the app with the following commands:

```bash
npm install
npm run start
```

## Testing

To run tests run the following comand:

```bash
npm run tests
```

The app will be available at:  
**`http://localhost:8080`**

## Notes

- Data Grid Pro from MUI is used for testing purposes only; no license is currently active.
- The app is designed to integrate seamlessly with the Spring Boot backend on port **9090**.

Developed by **Luis Angel Gutierrez Pineda**
