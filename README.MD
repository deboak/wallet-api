# Wallet API

A simple RESTful API for wallet management, built with Node.js, Express, and MongoDB.

## Features

- User authentication (register/login)
- Fund wallet
- Withdraw from wallet
- Transfer funds between users
- View wallet balance and transaction history
- Secure endpoints with authentication middleware
- Rate limiting, security headers, and input sanitization

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT for authentication
- Helmet, CORS, XSS-clean, Express-rate-limit

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/wallet-api.git
   cd wallet-api
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```

4. **Start the server:**
   ```sh
   npm start
   ```
   The API will run on `http://localhost:3001` by default.

## API Endpoints

| Method | Endpoint                | Description                |
|--------|------------------------ |----------------------------|
| POST   | `/api/v1/auth/register` | Register a new user        |
| POST   | `/api/v1/auth/login`    | Login and get JWT token    |
| GET    | `/api/v1/wallet/:id`    | Get wallet info & history  |
| POST   | `/api/v1/wallet/:id/fund`     | Fund wallet               |
| POST   | `/api/v1/wallet/:id/withdraw` | Withdraw from wallet      |
| POST   | `/api/v1/wallet/:id/transfer` | Transfer funds            |
| DELETE | `/api/v1/wallet/:id`    | Delete wallet              |

> **Note:** All `/wallet` routes require authentication via Bearer token.

## Example Request

**Fund Wallet**
```http
POST /api/v1/wallet/USER_ID/fund
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000
}
```

## Security

- Uses JWT for authentication
- Rate limiting to prevent abuse
- Helmet for HTTP headers
- XSS and input sanitization

## License