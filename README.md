# Kagoz E-commerce Web Application

## Backend Setup

### Tech Stack
- Node.js
- Express.js
- MongoDB Atlas (Mongoose)
- dotenv

### Project Structure
```
backend
├── config
│    └── db.js
├── controllers
├── models
├── routes
├── middleware
├── server.js
├── .env
├── .gitignore
└── package.json
```

### Setup Instructions
1. Copy your MongoDB Atlas connection string into `.env` as `MONGO_URI`.
2. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```
4. Test the API:
   - Visit [http://localhost:5000/api/test](http://localhost:5000/api/test)
   - You should see: `{ "message": "API working" }`

### Notes
- All backend features should be added as new modules in their respective folders.
- Environment variables are managed with dotenv.
- Error handling and logging are included in the base setup.
