# Sweet Shop Management

**Backend GitHub Repository:** [Backend_Sweet_Shop](https://github.com/SameerSinghal26/Backend_Sweet_Shop)

## Project Explanation
This project is a full-stack Sweet Shop Management system. The backend is built with Node.js, Express, TypeScript, and MongoDB, providing RESTful APIs for user authentication, sweet management, and admin features. The frontend is built with React and TypeScript for a modern, responsive user experience.

### Key Features
- User registration and login with JWT authentication
- Admins can add, update, restock, and delete sweets
- Sweets are managed with image uploads via Cloudinary
- Search, filter, and sort sweets by name, category, and price
- Role-based access for users and admins


## Components Overview
Reusable React components include:
- **Navbar:** Responsive navigation bar with search and filter options.
- **ProtectedRoute:** Guards private routes, redirecting unauthenticated users.
- **AdminRoute:** Restricts access to admin-only pages.

## Pages Overview
Main pages in the frontend:
- **Dashboard:** Displays sweets with search, filter, and sort functionality.
- **Admin:** Admin panel for managing sweets (add, update, restock, delete).
- **Login/Register:** User authentication forms.
- **NotFound:** Shown for undefined routes.

## Routing Overview
Routing is handled with React Router:
- `/` - Dashboard (protected)
- `/admin` - Admin panel (admin-only)
- `/login` - Login page
- `/register` - Registration page
- `*` - NotFound page for invalid routes

## My AI Usage

### AI Tools Used
- ChatGPT

### How I Used Them
- Used Copilot and ChatGPT to debug errors in Multer configuration and image uploading to Cloudinary.
- Used Copilot to create frontend templates and then manually customized them for project needs.

### Reflection on AI Impact
- AI tools greatly accelerated development, especially for repetitive code and initial test generation.
- Copilot helped resolve errors quickly and suggested best practices, improving code quality.
- ChatGPT provided architectural guidance and helped solve integration issues.
- AI allowed more time to focus on business logic and clean design, making the workflow faster and more reliable.

### Frontend Setup
1. Clone the frontend repository:
   ```
   git clone https://github.com/SameerSinghal26/Frontend_Sweet_Shop.git
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up the `.env` file and add:
   ```
   VITE_BASE_URL=http://localhost:8080
   ```
   (or your deployed backend URL)
4. Start the frontend:
   ```
   npm run dev
   ```
   You can now run the frontend locally on any device.
