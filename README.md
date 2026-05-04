"# Court Management System (CMS)

## Overview

The Court Management System (CMS) is a comprehensive web-based application designed to streamline and automate the management of court proceedings, cases, users, appointments, and related administrative tasks. Built with a modern tech stack, it provides role-based access for administrators, judges, prosecutors, registrars, court managers, and invoice clerks, ensuring secure and efficient operations within a judicial environment.

This system facilitates case tracking, document management, notification handling, invoicing, and more, making it an essential tool for legal professionals and court staff.

## Features

- **User Management**: Role-based authentication and authorization for different user types (Admin, Judge, Prosecutor, Registrar, Court Manager, Invoice Clerk).
- **Case Management**: Add, edit, delete, and track cases, including subtypes, types, and assignments.
- **Appointment Scheduling**: Manage court appointments and reminders.
- **Document Handling**: Upload and manage case documents, prosecutor documents, and other files.
- **Notification System**: Real-time notifications with mark-as-read functionality.
- **Invoicing**: Generate and manage invoices for services and cases.
- **Dashboard**: Role-specific dashboards with relevant statistics and quick actions.
- **Dark Mode Support**: Toggle between light and dark themes for better user experience.
- **Responsive Design**: Optimized for desktop and mobile devices using Material-UI.

## Tech Stack

### Backend
- **Node.js**: Runtime environment for server-side JavaScript.
- **Express.js**: Web framework for building RESTful APIs.
- **MySQL**: Relational database for data storage.
- **JWT (JSON Web Tokens)**: For secure authentication and authorization.
- **bcrypt**: For password hashing.
- **Multer**: For handling file uploads.
- **Nodemailer**: For sending emails (e.g., password reset).

### Frontend
- **React**: JavaScript library for building user interfaces.
- **React Router**: For client-side routing.
- **Material-UI (MUI)**: Component library for consistent UI design.
- **Axios**: For making HTTP requests to the backend API.
- **React Pro Sidebar**: For navigation sidebars.
- **JWT-Decode**: For decoding JWT tokens on the client side.

### Development Tools
- **npm**: Package manager for dependencies.
- **Webpack**: Module bundler (via Create React App).
- **Git**: Version control.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (version 14 or higher): Download from [nodejs.org](https://nodejs.org/).
- **MySQL** (version 8.0 or higher): Download from [mysql.com](https://www.mysql.com/).
- **Git**: For cloning the repository.

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cms
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a MySQL database (e.g., `court_management`).
   - Import the backup SQL file if available (located in `BackUp/`):
     ```bash
     mysql -u your_username -p court_management < BackUp/court_full.sql
     ```

4. Configure environment variables:
   - Create a `.env` file in the `backend/` directory with the following:
     ```
     DB_HOST=localhost
     DB_USER=your_mysql_username
     DB_PASSWORD=your_mysql_password
     DB_NAME=court_management
     JWT_SECRET=your_jwt_secret_key
     EMAIL_USER=your_email@example.com
     EMAIL_PASS=your_email_password
     PORT=5000
     ```

5. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`.

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The application will open in your browser at `http://localhost:3000`.

## Usage

1. **Login**: Use the provided credentials for different roles to log in.
2. **Navigate**: Use the sidebar to access different sections based on your role.
3. **Manage Cases**: Add new cases, assign advocates, update statuses, and upload documents.
4. **Appointments**: Schedule and manage court appointments.
5. **Notifications**: View and mark notifications as read.
6. **Invoicing**: Generate invoices and track payments.

### API Endpoints

The backend provides RESTful APIs. Key endpoints include:

- **Authentication**: `POST /api/login`, `POST /api/register`
- **Users**: `GET /api/users`, `POST /api/users`, `PUT /api/users/:id`
- **Cases**: `GET /api/cases`, `POST /api/cases`, `PUT /api/cases/:id`, `DELETE /api/cases/:id`
- **Appointments**: `GET /api/appointments`, `POST /api/appointments`
- **Notifications**: `GET /api/notifications`, `POST /api/notifications/markallasread`
- **Invoices**: `GET /api/invoices`, `POST /api/invoices`

For detailed API documentation, refer to the backend code or use tools like Postman to explore endpoints.

## Contributing

We welcome contributions to improve the Court Management System. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and test thoroughly.
4. Submit a pull request with a clear description of your changes.

Please follow the existing code style and include tests where applicable.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions, support, or feedback, please contact:

- **Email**: support@cms.com
- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)

## Screenshots

*(Add screenshots here if available)*

- Dashboard View
- Case Management Interface
- Appointment Scheduler

## Acknowledgments

- Thanks to the open-source community for the libraries and tools used.
- Special thanks to contributors and testers." 
