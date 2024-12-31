# Todo-Dockerised

**Todo-Dockerised** is a feature-rich, full-stack to-do list application designed to simplify task management while showcasing robust backend API development and seamless frontend integration.

## Features

### Core Functionalities
1. **View Todos**: Displays all tasks with filtering options for “All,” “Active,” and “Completed” states.
2. **Create Todos**: Allows users to add new tasks with a description.
3. **Update Todos**: Toggle task completion status.
4. **Delete Todos**: Permanently remove tasks from the list.

### User Experience
- **Real-time Updates**: Dynamic task updates without page reloads.
- **Error Handling**: Comprehensive error feedback for invalid inputs and server issues.
- **Loading States**: Visual feedback during API calls to enhance user experience.
- **Filters**: Intuitive filtering to manage active and completed tasks effectively.

### API Endpoints
The backend RESTful API supports the following operations:

1. **GET /todos/**
   - Fetches all to-do items.

2. **POST /todos/**
   - Creates a new to-do item.
   - Required field: `description` (string).

3. **PATCH /todos/:id/**
   - Updates an existing to-do item's status or description.

4. **DELETE /todos/:id/**
   - Deletes a to-do item by its unique ID.

### Technology Highlights
- **Frontend**: Built using React for a responsive, interactive interface.
- **Backend**: Django REST Framework (DRF) to handle API logic and database operations.
- **Database**: MongoDB for flexible and efficient data storage.

### Deployment
The app runs locally by default, and it can be easily deployed with Docker for scalable environments. Configuration is provided for connecting the app to a MongoDB instance.

## Setup

Clone the repository:
```bash
git clone https://github.com/keerthanyadava/Todo-Dockerised
```

Change into the cloned directory and set the environment variable for the code path. Replace `path_to_repository` appropriately:
```bash
export CODEBASE_PATH="{path_to_repository}/test/src"
```

### Build container
Build the Docker image:
```bash
docker-compose build
```

### Start containers
Once the build is completed, start the containers:
```bash
docker-compose up -d
```

Check that you are able to access:
- Frontend: [http://localhost:3000](http://localhost:3000)  
- Backend: [http://localhost:8000/todos](http://localhost:8000/todos)

## Future Enhancements
- Add user authentication for personalized task management.
- Include task due dates and reminders.
- Implement drag-and-drop task prioritization.
- Create a mobile-first design for better accessibility.

## Project Highlights
This project demonstrates:
- Efficient integration of a RESTful API with a React frontend.
- Practical use of MongoDB for schema-less data handling.
- Error handling and user-friendly interface design.
- Scalability with Docker for deployment.
