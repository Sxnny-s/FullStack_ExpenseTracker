# Expense Tracker App

# LIVE DEMO HERE =>  [APP](https://fullsstack-expense-production.up.railway.app/login)

A web-based application to track and manage personal expenses. This app allows users to securely log in, add, edit, and categorize expenses, and view their spending habits.

## Features

- **Track Expenses**: Add and categorize expenses (e.g., groceries, rent, entertainment).
- **Authentication**: Secure login/logout with Passport.js and local strategy.
- **Responsive Design**: Use the app on mobile, tablet, or desktop devices.
- **Data Storage**: All expenses are saved in MongoDB for persistent storage.

## Technologies Used

- **Frontend**: EJS (Embedded JavaScript) for templating
- **Backend**: Node.js with Express
- **Database**: MongoDB (using Mongoose)
- **Authentication**: Passport.js for secure authentication
- **Session Management**: Express-session for handling user sessions
- **Security**: bcrypt for password hashing

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (or use MongoDB Atlas for cloud database)

### Steps to Install

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sxnny-s/Personal-auth-expense
   cd personal-auth-expence

2. **Install dependencies**:
   ```bash
    npm install


3. **Set up environment variables**:
   
      3a. Create a .env file in the root directory of the project.
    
      3b. Add your MongoDB connection string and other environment variables:
    
   ```env
   DB_URI=your_mongodb_connection_string
   SECRET_KEY=your_secret_key


5. **To run the app locally:**:
   ```bash
   npm start


