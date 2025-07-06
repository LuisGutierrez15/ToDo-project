# Backend ToDo-project

A RESTful API built with Java 21 and Spring Boot to manage tasks in a to-do list application. It includes automated testing, Swagger documentation, and a clean architecture ready for production.

## Tech Stack

- **Java 21**
- **Spring Boot**
- **Lombok** – Reduces boilerplate code
- **Swagger (Springdoc OpenAPI)** – API documentation available at `/todos-doc`
- **JUnit + Spring Test** – Unit and integration testing
- **Maven** – Build and dependency management
- **In-memory HashMap** – Temporary data storage (database-ready structure)

## Available Endpoints

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| GET    | `/todos`             | Get all tasks                |
| GET    | `/todos/{id}`        | Get a specific task by ID    |
| GET    | `/todos/stats`       | Get task metrics by priority |
| GET    | `/todos/overdue`     | Get overdue ToDos            |
| POST   | `/todos`             | Create a new task            |
| POST   | `/todos/batch`       | Create multiple tasks        |
| POST   | `/todos/{id}/done`   | Mark a task as done          |
| PUT    | `/todos/{id}`        | Update an existing task      |
| PUT    | `/todos/{id}/undone` | Mark a task as undone        |
| DELETE | `/todos/{id}`        | Delete a task                |

### API Documentation

Interactive Swagger UI available at:  
**`/todos-doc`**

## How to Run

1. Make sure you have **Java 21** and **Maven** installed.
2. Navigate to the backend project directory.
3. Run the following command:

```bash
mvn spring-boot:run
```

The server will start on:  
**`http://localhost:9090`**

## Testing

To run tests run the following comand:

```bash
mvn test
```

## Configuration

The application includes a basic `application.properties` file, which can be extended for database configuration in the future.

## Notes

This backend is structured to support future integration with a relational database. Current operations are handled in-memory for development and testing purposes.

Developed by **Luis Angel Gutierrez Pineda**
