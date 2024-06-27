#Dedicated to Develope
This is web app and mobile app backend for an AI powered productivity SaaS platform

Bullet Journal with Habit Tracking - Backend
Table of Contents
Introduction
Features
Technologies Used
Installation
Configuration
Running the Application
API Endpoints
Contributing
License
Introduction
This project is a backend server for a Bullet Journal application, featuring habit tracking, future logs, notes, and self-suggestions. It is built using Node.js, Express, and MongoDB, with JWT for user authentication and Cloudinary for photo uploads.

Features
User Authentication: Secure user login and registration using JWT.
Habit Tracking: Track daily habits and monitor progress.
Future Logs: Record and view future logs for planning.
Notes: Create and manage personal notes.
Self Suggestions: Store and retrieve self-suggestions.
Photo Uploads: Upload and manage photos using Cloudinary.
Technologies Used
Node.js: JavaScript runtime environment.
Express: Web application framework for Node.js.
MongoDB: NoSQL database.
Mongoose: MongoDB object modeling tool.
JWT: JSON Web Tokens for authentication.
Cloudinary: Cloud-based image and video management.

Installation
Clone the repository:
https://github.com/Aarun1349/dedicated-to-develop-be.git
use develop branch

cd bullet-journal-backend

Install dependencies:
npm install

Configuration

PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Running the Application
npm start

The server will run on the port specified in the .env file (default is 8000).

API Endpoints
Authentication
Register: POST /api/auth/register
Login: POST /api/auth/login
Habits
Get Habits: GET /api/habits
Create Habit: POST /api/habits
Update Habit: PUT /api/habits/:id
Delete Habit: DELETE /api/habits/:id
Future Logs
Get Future Logs: GET /api/future-logs
Create Future Log: POST /api/future-logs
Update Future Log: PUT /api/future-logs/:id
Delete Future Log: DELETE /api/future-logs/:id
Notes
Get Notes: GET /api/notes
Create Note: POST /api/notes
Update Note: PUT /api/notes/:id
Delete Note: DELETE /api/notes/:id
Self Suggestions
Get Self Suggestions: GET /api/self-suggestions
Create Self Suggestion: POST /api/self-suggestions
Update Self Suggestion: PUT /api/self-suggestions/:id
Delete Self Suggestion: DELETE /api/self-suggestions/:id
Photo Uploads
Upload Photo: POST /api/upload
Delete Photo: DELETE /api/upload/:public_id
Contributing
Fork the repository.
Create a new branch (git checkout -b feature/your-feature-name).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature/your-feature-name).
Open a Pull Request.
