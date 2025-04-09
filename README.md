# ToDoList Project

A ToDo List application built using **Laravel** (Backend) and **React** (Frontend). This application allows users to create, update, and delete tasks, while tracking the status of each task (Pending or Completed).

## Features
- Create tasks
- Update task details
- Delete tasks
- Mark tasks as completed or pending
- Categorize tasks

## Technologies Used
- **Frontend:** React, React Bootstrap, React Router
- **Backend:** Laravel (PHP)
- **Database:** MySQL 
- **Authentication:** JWT 
- **Datepicker:** react-datepicker for task due date

## Prerequisites
Before running this application, make sure you have the following software installed:

- [Node.js](https://nodejs.org/) (for React)
- [PHP](https://www.php.net/) (for Laravel)
- [Composer](https://getcomposer.org/) (for Laravel dependency management)
- [MySQL](https://www.mysql.com/)
- [Git](https://git-scm.com/) (for version control)

## Installation and Setup

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/Abdelrahmans123/ToDoList.git
cd ToDoList
```
## Step 2: Set up the Backend (Laravel)
Navigate to the backend directory (assuming the backend is inside a backend/ folder):
```bash
cd backend
```
Install Laravel dependencies using Composer:
```bash
composer install
```
Set up your .env file. You can copy the .env.example to .env:
```bash
cp .env.example .env
```
Set up your database connection in the .env file by updating the database settings:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=todo_list_db
DB_USERNAME=root
DB_PASSWORD=
```
Generate the application key:
```bash
php artisan key:generate
```
Run database migrations to create the necessary tables:
```bash
php artisan migrate
```
Start the Laravel development server:
```bash
php artisan serve
```
This will start the server at http://127.0.0.1:8000.
## Step 3: Set up the Frontend (React)
Navigate to the frontend directory (assuming the frontend is inside a frontend/ folder):
```bash
cd frontend/to_do_list
```
Install React dependencies using npm:
```bash
npm install
```
Start the React development server:
```bash
npm run dev
```
This will start the React frontend at http://localhost:5173.
## Step 4: Testing the Application
Once both the backend and frontend are running, navigate to the React app at http://localhost:5173 in your browser. You should be able to create, update, delete, and manage tasks in your ToDo list.
## Usage
* **Create Task:** Enter a title and description, select a category, and set a due date. Then click on "Create Task".
* **Update Task:** Click on a task and edit the title, description, category, or due date.
* **Delete Task:** Delete a task by clicking the delete icon.
* **Mark Task as Completed/Pending:** Toggle the task status between "completed" and "pending".
## Notes
* Make sure to set up the correct CORS settings on the Laravel backend if you're using a different domain or port for the frontend.
* This project assumes that you are familiar with React, Laravel, and basic development environment setup.
## Troubleshooting
If you encounter any issues during installation, make sure to check:
* Your local server is running on localhost:8000 for the Laravel backend and localhost:3000 for the React frontend.
* Your database connection details in .env file are correct.
* Dependencies for both Laravel and React have been successfully installed.
## License
This project is open-source and available under the [MIT](https://choosealicense.com/licenses/mit/) License.
